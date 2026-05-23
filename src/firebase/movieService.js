import { db } from "./config";
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from "firebase/firestore";

// ── Film qo'shish (admin) ─────────────────────────────────────
export const addMovie = async (movie, adminUid) => {
  await addDoc(collection(db, "savedMovies"), {
    movieId: movie.id,
    title: movie.title || movie.name || "",
    poster: movie.poster_path || "",
    backdrop: movie.backdrop_path || "",
    rating: movie.vote_average || 0,
    releaseDate: movie.release_date || movie.first_air_date || "",
    overview: movie.overview || "",
    addedAt: serverTimestamp(),
    addedBy: adminUid,
  });
};

// ── Film o'chirish (admin) ────────────────────────────────────
export const removeMovie = async (docId) => {
  await deleteDoc(doc(db, "savedMovies", docId));
};

// ── Barcha saqlangan filmlar ──────────────────────────────────
export const getSavedMovies = async () => {
  const q = query(collection(db, "savedMovies"), orderBy("addedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ docId: d.id, ...d.data() }));
};