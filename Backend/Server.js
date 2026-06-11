const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const admin = require("firebase-admin");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// ── Firebase Admin init ──────────────────────────────────────────
const serviceAccount = require("./serviceAccountKey.json"); // Firebase Console dan yuklang
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// ── Payme config ─────────────────────────────────────────────────
const PAYME_MERCHANT_ID = process.env.PAYME_MERCHANT_ID || "YOUR_MERCHANT_ID";
const PAYME_SECRET_KEY  = process.env.PAYME_SECRET_KEY  || "YOUR_SECRET_KEY";
const PAYME_URL         = "https://checkout.payme.uz/api";

// Plan narxlari (tiyin hisobida — 1 so'm = 100 tiyin)
const PLANS = {
  monthly:   { price: 29900,  days: 30,  label: "1 Oy"  },
  quarterly: { price: 79900,  days: 90,  label: "3 Oy"  },
  yearly:    { price: 249900, days: 365, label: "1 Yil" },
};

// ── Helper: Payme auth header ────────────────────────────────────
function paymeAuth() {
  const encoded = Buffer.from(`Paycom:${PAYME_SECRET_KEY}`).toString("base64");
  return `Basic ${encoded}`;
}

// ── 1. To'lov yaratish ───────────────────────────────────────────
// Frontend bu endpoint'ni chaqiradi → Payme URL qaytaradi
app.post("/api/create-payment", async (req, res) => {
  const { planId, userId, userEmail } = req.body;

  if (!planId || !userId) {
    return res.status(400).json({ error: "planId va userId kerak" });
  }

  const plan = PLANS[planId];
  if (!plan) return res.status(400).json({ error: "Noto'g'ri plan" });

  try {
    // Firestore'ga order saqlaymiz
    const orderRef = await db.collection("orders").add({
      userId,
      userEmail,
      planId,
      amount: plan.price,
      days: plan.days,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const orderId = orderRef.id;

    // Payme checkout URL yasaymiz
    // Format: m=MERCHANT_ID;ac.order_id=ORDER_ID;a=AMOUNT;l=uz
    const params = `m=${PAYME_MERCHANT_ID};ac.order_id=${orderId};a=${plan.price};l=uz`;
    const encoded = Buffer.from(params).toString("base64");
    const paymeUrl = `https://checkout.payme.uz/${encoded}`;

    res.json({ paymeUrl, orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

// ── 2. Payme Webhook (to'lov natijasi) ───────────────────────────
// Payme to'lov bo'lganda shu endpoint'ni chaqiradi
app.post("/api/payme-webhook", async (req, res) => {
  const { method, params, id } = req.body;

  // Auth tekshirish
  const authHeader = req.headers.authorization || "";
  const expectedAuth = paymeAuth();
  if (authHeader !== expectedAuth) {
    return res.json({
      id, error: { code: -32504, message: "Insufficient privilege" }
    });
  }

  // PerformTransaction — to'lov muvaffaqiyatli
  if (method === "PerformTransaction") {
    const orderId = params.account?.order_id;
    if (!orderId) {
      return res.json({ id, error: { code: -31050, message: "Order not found" } });
    }

    try {
      const orderRef = db.collection("orders").doc(orderId);
      const order = await orderRef.get();

      if (!order.exists) {
        return res.json({ id, error: { code: -31050, message: "Order not found" } });
      }

      const { userId, days, planId } = order.data();

      // Premium muddatini hisoblash
      const now = new Date();
      const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      // Firestore'da user'ni premium qilamiz
      await db.collection("users").doc(userId).update({
        isPremium: true,
        premiumPlan: planId,
        premiumExpiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
        premiumActivatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Orderni yangilaymiz
      await orderRef.update({
        status: "paid",
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.json({
        id,
        result: {
          transaction: orderId,
          perform_time: Date.now(),
          state: 2,
        }
      });
    } catch (err) {
      console.error(err);
      return res.json({ id, error: { code: -31008, message: "Server error" } });
    }
  }

  // CheckTransaction
  if (method === "CheckTransaction") {
    const orderId = params.id;
    const orderRef = db.collection("orders").doc(orderId);
    const order = await orderRef.get();

    if (!order.exists) {
      return res.json({ id, error: { code: -31003, message: "Transaction not found" } });
    }

    const { status } = order.data();
    return res.json({
      id,
      result: {
        create_time: Date.now(),
        perform_time: status === "paid" ? Date.now() : 0,
        cancel_time: 0,
        transaction: orderId,
        state: status === "paid" ? 2 : 1,
        reason: null,
      }
    });
  }

  // CreateTransaction
  if (method === "CreateTransaction") {
    const orderId = params.account?.order_id;
    return res.json({
      id,
      result: {
        create_time: Date.now(),
        transaction: orderId,
        state: 1,
      }
    });
  }

  // CancelTransaction
  if (method === "CancelTransaction") {
    const orderId = params.id;
    await db.collection("orders").doc(orderId).update({ status: "cancelled" });
    return res.json({
      id,
      result: {
        transaction: orderId,
        cancel_time: Date.now(),
        state: -1,
      }
    });
  }

  res.json({ id, error: { code: -32601, message: "Method not found" } });
});

// ── 3. Premium statusni tekshirish ──────────────────────────────
app.get("/api/check-premium/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return res.json({ isPremium: false });

    const { isPremium, premiumExpiresAt } = userDoc.data();

    if (!isPremium) return res.json({ isPremium: false });

    // Muddati o'tganmi?
    const now = new Date();
    const expires = premiumExpiresAt?.toDate();
    if (expires && expires < now) {
      await db.collection("users").doc(userId).update({ isPremium: false });
      return res.json({ isPremium: false });
    }

    return res.json({ isPremium: true, expiresAt: expires });
  } catch (err) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));