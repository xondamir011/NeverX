import { db } from "./config";
import {
  doc, setDoc, collection, getDocs,
  serverTimestamp, query, orderBy, getDoc
} from "firebase/firestore";

export const recordView = async (user, movie) => {
  if (!user) return;

  const ref = doc(
    db,
    "views",
    user.uid,
    "movies",
    String(movie.id)
  );

  await setDoc(ref, {
    movieId: movie.id,
    title: movie.title || movie.name || "",
    poster: movie.poster_path || "",
    watchedAt: serverTimestamp(),
  }, { merge: true }); 
};

// ── Bitta foydalanuvchi ko'rgan filmlar ───────────────────────
export const getUserViews = async (uid) => {
  const q = query(
    collection(db, "views", uid, "movies"),
    orderBy("watchedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── Barcha ko'rishlar soni (dashboard uchun) ──────────────────
export const getTotalViews = async (allUserIds) => {
  let total = 0;
  for (const uid of allUserIds) {
    const snap = await getDocs(collection(db, "views", uid, "movies"));
    total += snap.size;
  }
  return total;
};