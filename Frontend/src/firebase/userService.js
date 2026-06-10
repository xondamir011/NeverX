import { db } from "./config";
import {
  doc, setDoc, getDoc, collection,
  getDocs, serverTimestamp, updateDoc, orderBy, query
} from "firebase/firestore";

// ── Foydalanuvchi login qilganda chaqiriladi ──────────────────
export const saveUser = async (user) => {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Birinchi marta — yangi foydalanuvchi
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName || "Anonim",
      email: user.email || "",
      photo: user.photoURL || "",
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      role: "user", // admin uchun "admin" qiling
    });
  } else {
    // Keyingi kirish — lastSeen yangilanadi
    await updateDoc(ref, {
      lastSeen: serverTimestamp(),
    });
  }
};

// ── Barcha foydalanuvchilarni olish (admin uchun) ─────────────
export const getAllUsers = async () => {
  const q = query(collection(db, "users"), orderBy("lastSeen", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── Bitta foydalanuvchi ma'lumoti ─────────────────────────────
export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};