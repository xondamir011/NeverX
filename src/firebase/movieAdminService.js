import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./config";

export const addAdminMovie = async (tmdbId) => {
  return await addDoc(collection(db, "movies"), {
    tmdbId,
    createdAt: serverTimestamp(),
  });
};

export const getAdminMovies = async () => {
  const snap = await getDocs(collection(db, "movies"));

  return snap.docs.map((d) => ({
    docId: d.id,
    ...d.data(),
  }));
};

export const removeAdminMovie = async (docId) => {
  await deleteDoc(doc(db, "movies", docId));
};