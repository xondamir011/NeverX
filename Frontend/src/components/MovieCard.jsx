import { useState, useRef, useEffect } from "react";
import { auth } from "../firebase/config";
import { recordView } from "../firebase/viewService";
import { addMovie, removeMovie, getSavedMovies } from "../firebase/movieService";
import {
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs, increment, updateDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import { FaPlay } from "react-icons/fa";

const [isPremium, setIsPremium] = useState(false);

useEffect(() => {
  const loadPremium = async () => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      setIsPremium(snap.data().isPremium === true);
    }
  };

  loadPremium();
}, [user]);

const T = {
  EN: { more: "Details", desc: "No description", details: "Details", save: "Save", saved: "Saved", like: "Like" },
  UZ: { more: "Batafsil", desc: "Tavsif yo'q", details: "Batafsil", save: "Saqlash", saved: "Saqlangan", like: "Like" },
  RU: { more: "Подробнее", desc: "Описание отсутствует", details: "Подробнее", save: "Сохранить", saved: "Сохранено", like: "Лайк" },
  DE: { more: "Details", desc: "Keine Beschreibung", details: "Details", save: "Speichern", saved: "Gespeichert", like: "Like" },
  TR: { more: "Detay", desc: "Açıklama yok", details: "Detay", save: "Kaydet", saved: "Kaydedildi", like: "Beğen" },
};

const TMDB_KEY = "44cae21994113f58296e3b6d0db555f3";

// ── SKELETON ────────────────────────────────────────────────────
export function MovieCardSkeleton() {
  return (
    <div className="bg-base-200 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-base-300" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-base-300 rounded w-3/4" />
        <div className="h-3 bg-base-300 rounded w-1/2" />
      </div>
    </div>
  );
}

// ── YOUTUBE PLAYER ───────────────────────────────────────────────
function YouTubePlayer({ videoId, title }) {
  const playerRef = useRef(null);
  const ytRef = useRef(null);
  const intervalRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
  };

  useEffect(() => {
    const loadAPI = () => {
      if (window.YT && window.YT.Player) { initPlayer(); return; }
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    };
    const initPlayer = () => {
      ytRef.current = new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: { controls: 0, disablekb: 1, modestbranding: 1, rel: 0, iv_load_policy: 3, autoplay: 1, origin: window.location.origin },
        events: {
          onReady: (e) => { setReady(true); e.target.setVolume(80); setDuration(e.target.getDuration()); },
          onStateChange: (e) => {
            const YT = window.YT.PlayerState;
            if (e.data === YT.PLAYING) { setPlaying(true); setDuration(ytRef.current.getDuration()); startTracking(); }
            else { setPlaying(false); stopTracking(); }
          },
        },
      });
    };
    loadAPI();
    return () => { stopTracking(); ytRef.current?.destroy?.(); };
  }, [videoId]);

  const startTracking = () => { stopTracking(); intervalRef.current = setInterval(() => { if (ytRef.current?.getCurrentTime) setCurrentTime(ytRef.current.getCurrentTime()); }, 500); };
  const stopTracking = () => clearInterval(intervalRef.current);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const yt = ytRef.current;
      if (!yt || !ready) return;
      switch (e.key) {
        case " ": e.preventDefault(); togglePlay(); break;
        case "ArrowLeft": yt.seekTo(Math.max(0, yt.getCurrentTime() - 10), true); break;
        case "ArrowRight": yt.seekTo(yt.getCurrentTime() + 10, true); break;
        case "ArrowUp": e.preventDefault(); { const v = Math.min(100, yt.getVolume() + 10); yt.setVolume(v); setVolume(v); } break;
        case "ArrowDown": e.preventDefault(); { const v = Math.max(0, yt.getVolume() - 10); yt.setVolume(v); setVolume(v); } break;
        case "m": case "M": toggleMute(); break;
        case "f": case "F": toggleFullscreen(); break;
        default: break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, playing]);

  const resetHideTimer = () => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    if (playing) hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  };
  const togglePlay = () => { const yt = ytRef.current; if (!yt) return; yt.getPlayerState() === 1 ? yt.pauseVideo() : yt.playVideo(); };
  const skip = (sec) => { const yt = ytRef.current; if (!yt) return; yt.seekTo(Math.max(0, yt.getCurrentTime() + sec), true); };
  const toggleMute = () => { const yt = ytRef.current; if (!yt) return; yt.isMuted() ? (yt.unMute(), setMuted(false)) : (yt.mute(), setMuted(true)); };
  const handleVolume = (val) => { const yt = ytRef.current; if (!yt) return; const v = parseInt(val); yt.setVolume(v); setVolume(v); if (v > 0 && yt.isMuted()) { yt.unMute(); setMuted(false); } };
  const handleSeek = (e) => { const yt = ytRef.current; if (!yt || !duration) return; const rect = e.currentTarget.getBoundingClientRect(); yt.seekTo(((e.clientX - rect.left) / rect.width) * duration, true); };
  const handleSpeed = (s) => { ytRef.current?.setPlaybackRate(s); setSpeed(s); setShowSpeedMenu(false); };
  const toggleFullscreen = () => { if (!document.fullscreenElement) containerRef.current?.requestFullscreen(); else document.exitFullscreen(); };

  const pct = duration ? (currentTime / duration) * 100 : 0;
  const btn = { background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 };

  return (
    <div ref={containerRef} onMouseMove={resetHideTimer} onMouseLeave={() => playing && setShowControls(false)}
      style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000", borderRadius: isFullscreen ? 0 : "12px 12px 0 0", overflow: "hidden", cursor: showControls ? "default" : "none" }}>
      <div ref={playerRef} style={{ width: "100%", height: "100%", pointerEvents: "none" }} />
      <div onClick={togglePlay} style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: showControls ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" : "transparent", opacity: showControls ? 1 : 0, transition: "opacity 0.35s", pointerEvents: showControls ? "auto" : "none" }}>
        <div style={{ padding: "8px 16px 2px", color: "#fff", fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ padding: "8px 14px 2px", cursor: "pointer" }} onClick={handleSeek}>
          <div style={{ position: "relative", height: 5, background: "rgba(255,255,255,0.25)", borderRadius: 4 }}>
            <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${pct}%`, background: "#e53e3e", borderRadius: 4 }} />
            <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 14, height: 14, background: "#e53e3e", borderRadius: "50%", border: "2.5px solid #fff" }} />
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "4px 10px 14px", color: "#fff" }}>
          <button onClick={togglePlay} style={btn}>{playing ? <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M8 5v14l11-7z" /></svg>}</button>
          <button onClick={() => skip(-10)} style={btn}><span style={{ position: "relative", display: "inline-flex" }}><svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6 8.5 6V6l-8.5 6z" /></svg><span style={{ position: "absolute", bottom: 0, right: -3, fontSize: 7, fontWeight: 900 }}>10</span></span></button>
          <button onClick={() => skip(10)} style={btn}><span style={{ position: "relative", display: "inline-flex" }}><svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" /></svg><span style={{ position: "absolute", bottom: 0, right: -3, fontSize: 7, fontWeight: 900 }}>10</span></span></button>
          <button onClick={toggleMute} style={btn}>{muted || volume === 0 ? <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" /></svg> : <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>}</button>
          <input type="range" min={0} max={100} step={1} value={muted ? 0 : volume} onChange={(e) => handleVolume(e.target.value)} style={{ width: 70, accentColor: "#e53e3e", cursor: "pointer" }} />
          <span style={{ fontSize: 12, marginLeft: 6, opacity: 0.85, whiteSpace: "nowrap" }}>{fmt(currentTime)} / -{fmt(duration - currentTime)}</span>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowSpeedMenu(p => !p)} style={{ ...btn, fontSize: 13, fontWeight: 700, padding: "3px 9px", border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 5 }}>{speed}x</button>
            {showSpeedMenu && (
              <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, background: "rgba(15,15,15,0.97)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", minWidth: 80, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.8)", zIndex: 20 }}>
                {speeds.map(s => <button key={s} onClick={() => handleSpeed(s)} style={{ display: "block", width: "100%", padding: "9px 18px", background: speed === s ? "rgba(229,62,62,0.2)" : "transparent", color: speed === s ? "#fc8181" : "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: speed === s ? 700 : 400, textAlign: "center" }}>{s}x</button>)}
              </div>
            )}
          </div>
          <button onClick={toggleFullscreen} style={btn}>{isFullscreen ? <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" /></svg> : <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>}</button>
        </div>
      </div>
    </div>
  );
}

// ── MOVIE CARD ───────────────────────────────────────────────────
export default function MovieCard({ movie, lang = "UZ" }) {
  const [showModal, setShowModal] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noTrailer, setNoTrailer] = useState(false);

  // Like
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Save
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedDocId, setSavedDocId] = useState(null);

  // Comments
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);

  const user = auth.currentUser;
  const t = T[lang] || T["UZ"];
  const title = movie.title || movie.name || "Nomsiz";
  const releaseDate = movie.release_date || movie.first_air_date || "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "0.0";
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

  // Modal ochilganda like/save/comments/view yuklash
  useEffect(() => {
    if (!showModal || !user) return;
    loadLike();
    loadSave();
    loadComments();
    recordView(user, movie);
  }, [showModal]);

  // ── LIKE ──
  const loadLike = async () => {
    const likeRef = doc(db, "likes", String(movie.id));
    const snap = await getDoc(likeRef);
    if (snap.exists()) {
      setLikeCount(snap.data().count || 0);
      const userLikeRef = doc(db, "likes", String(movie.id), "users", user.uid);
      const userSnap = await getDoc(userLikeRef);
      setLiked(userSnap.exists());
    }
  };

  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!user || likeLoading) return;
    setLikeLoading(true);
    const likeRef = doc(db, "likes", String(movie.id));
    const userLikeRef = doc(db, "likes", String(movie.id), "users", user.uid);
    try {
      if (liked) {
        await deleteDoc(userLikeRef);
        await setDoc(likeRef, { count: Math.max(0, likeCount - 1), movieId: movie.id }, { merge: true });
        setLikeCount(p => Math.max(0, p - 1));
        setLiked(false);
      } else {
        await setDoc(userLikeRef, { likedAt: serverTimestamp() });
        await setDoc(likeRef, { count: likeCount + 1, movieId: movie.id, title }, { merge: true });
        setLikeCount(p => p + 1);
        setLiked(true);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  // ── SAVE ──
  const loadSave = async () => {
    const saved = await getSavedMovies();
    const found = saved.find(m => m.movieId === movie.id);
    if (found) { setSaved(true); setSavedDocId(found.docId); }
    else { setSaved(false); setSavedDocId(null); }
  };

  const toggleSave = async (e) => {
    e.stopPropagation();
    if (!user || saveLoading) return;
    setSaveLoading(true);
    try {
      if (saved && savedDocId) {
        await removeMovie(savedDocId);
        setSaved(false);
        setSavedDocId(null);
      } else {
        await addMovie(movie, user.uid);
        const updated = await getSavedMovies();
        const found = updated.find(m => m.movieId === movie.id);
        if (found) setSavedDocId(found.docId);
        setSaved(true);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // ── COMMENTS ──
  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const snap = await getDocs(collection(db, "comments", String(movie.id), "list"));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setComments(list);
    } finally {
      setCommentsLoading(false);
    }
  };

  const addComment = async () => {
    if (!commentText.trim() || !user) return;
    const ref = doc(collection(db, "comments", String(movie.id), "list"));
    const newComment = {
      text: commentText.trim(),
      userName: user.displayName || user.email,
      userPhoto: user.photoURL || "",
      createdAt: serverTimestamp(),
      uid: user.uid,
    };
    await setDoc(ref, newComment);
    setComments(prev => [{ id: ref.id, ...newComment, createdAt: { seconds: Date.now() / 1000 } }, ...prev]);
    setCommentText("");
  };

  // ── OPEN MOVIE ──
  const openMovie = async () => {
    setShowModal(true);
    setLoading(true);
    setNoTrailer(false);
    setVideoId(null);
    try {
      const type = movie.first_air_date ? "tv" : "movie";
      const res = await fetch(`https://api.themoviedb.org/3/${type}/${movie.id}/videos?api_key=${TMDB_KEY}&language=en-US`);
      const data = await res.json();
      const trailer = data.results?.find(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
      if (trailer) setVideoId(trailer.key);
      else setNoTrailer(true);
    } catch { setNoTrailer(true); }
    finally { setLoading(false); }
  };

  const closeModal = () => { setShowModal(false); setVideoId(null); };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    if (showModal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  const fmtDate = (ts) => {
    if (!ts?.seconds) return "";
    return new Date(ts.seconds * 1000).toLocaleDateString("uz-UZ");
  };

  return (
    <>
      {/* ── CARD ── */}
      <div onClick={openMovie}
        className="bg-base-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group">
        <div className="relative overflow-hidden aspect-[2/3]">
          <img src={posterUrl} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-base-200 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl ml-1"><FaPlay /></span>
            </div>
          </div>
          {/* Like badge on card */}
          {likeCount > 0 && (
            <div className="absolute top-2 left-2 bg-black/60 rounded-full px-2 py-0.5 text-xs text-white flex items-center gap-1">
              ❤️ {likeCount}
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-base truncate mb-1">{title}</h3>
          <div className="flex items-center justify-between text-sm opacity-70">
            <span>📅 {releaseDate}</span>
            <span>⭐ {rating}</span>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(6px)" }}
          onClick={closeModal}>

          <div className="bg-base-100 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative"
            onClick={e => e.stopPropagation()}>

            {/* Close */}
            <button onClick={closeModal} className="absolute top-3 right-3 z-10 btn btn-sm btn-circle btn-ghost text-lg">✕</button>

            {/* Player */}
            {loading && <div className="w-full aspect-video bg-black rounded-t-2xl flex items-center justify-center"><span className="loading loading-spinner loading-lg text-red-500" /></div>}
            {noTrailer && !loading && (
              <div className="w-full aspect-video bg-black rounded-t-2xl flex flex-col items-center justify-center gap-2">
                <span className="text-4xl">🎬</span>
                <p className="text-white/60 text-sm">Treyler topilmadi</p>
              </div>
            )}
            {videoId && !loading && <YouTubePlayer videoId={videoId} title={title} />}

            {/* Info */}
            <div className="p-4 sm:p-5">
              <h2 className="text-2xl font-bold mb-1">{title}</h2>
              <div className="flex gap-4 text-sm opacity-70 mb-3">
                <span>📅 {releaseDate}</span>
                <span>⭐ {rating}/10</span>
              </div>
              <p className="text-sm leading-relaxed opacity-80 mb-4">{movie.overview || t.desc}</p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {/* Like */}
                <button onClick={toggleLike}
                  disabled={likeLoading}
                  className={`btn btn-sm gap-1 ${liked ? "bg-red-500 text-white border-none" : "btn-outline"}`}>
                  {liked ? "❤️" : "❤️"} {likeCount > 0 ? likeCount : ""} {t.like}
                </button>

                {/* Save */}
                <button onClick={toggleSave}
                  disabled={saveLoading}
                  className={`btn btn-sm gap-1 ${saved ? "bg-indigo-600 text-white border-none" : "btn-outline"}`}>
                  {saved ? "🔖" : "📌"} {saved ? t.saved : t.save}
                </button>

                {/* TMDB link */}
                <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer"
                  className="btn btn-sm btn-ghost opacity-60" onClick={e => e.stopPropagation()}>
                  ℹ️ {t.details}
                </a>
              </div>

              {/* ── COMMENTS ── */}
              <div className="border-t border-base-300 pt-4">
                <h3 className="font-bold text-base mb-3">
                  💬 Izohlar {comments.length > 0 && <span className="text-indigo-400">({comments.length})</span>}
                </h3>

                {/* Comment input */}
                <div className="flex gap-2 mb-4">
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addComment()}
                    placeholder="Izoh yozing..."
                    className="input input-bordered input-sm flex-1 bg-base-200"/>

                  <button onClick={addComment} className="btn btn-sm bg-indigo-600 text-white border-none">
                    Yuborish
                  </button>
                </div>

                {/* Comments list */}
                {commentsLoading ? (
                  <div className="flex justify-center py-4">
                    <span className="loading loading-spinner loading-sm" />
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-sm opacity-40 text-center py-4">Hali izoh yo'q. Birinchi bo'ling! 🎉</p>
                ) : (
                  <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                    {comments.map(c => (
                      <div key={c.id} className="flex gap-3 items-start">
                        {c.userPhoto ? (
                          <img src={c.userPhoto} className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt={c.userName} />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(c.userName || "?")[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 bg-base-200 rounded-xl px-3 py-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-indigo-400 truncate">{c.userName}</span>
                            <span className="text-xs opacity-40 flex-shrink-0">{fmtDate(c.createdAt)}</span>
                          </div>
                          <p className="text-sm mt-0.5 opacity-90">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}