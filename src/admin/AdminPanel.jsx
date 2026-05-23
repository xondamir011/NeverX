import { useState, useEffect } from "react";
import { getAllUsers } from "../firebase/userService";
import { getUserViews, getTotalViews } from "../firebase/viewService";
import { getSavedMovies, removeMovie } from "../firebase/movieService";

const TABS = ["Dashboard", "Foydalanuvchilar", "Filmlar"];

export default function AdminPanel({ setShowAdmin }) {
    const [tab, setTab] = useState("Dashboard");
    const [users, setUsers] = useState([]);
    const [movies, setMovies] = useState([]);
    const [totalViews, setTotalViews] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userViews, setUserViews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const u = await getAllUsers();
        const m = await getSavedMovies();
        const tv = await getTotalViews(u.map((x) => x.uid));
        setUsers(u);
        setMovies(m);
        setTotalViews(tv);
        setLoading(false);
    };

    const handleUserClick = async (user) => {
        setSelectedUser(user);
        const views = await getUserViews(user.uid);
        setUserViews(views);
    };

    const handleRemoveMovie = async (docId) => {
        await removeMovie(docId);
        setMovies((prev) => prev.filter((m) => m.docId !== docId));
    };

    const fmt = (ts) => {
        if (!ts) return "—";
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleString("uz-UZ");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
                <span className="loading loading-spinner loading-lg text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white">
            <div className="bg-[#0d1426] border-b border-white/10 px-3 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative">

                    <button onClick={() => setShowAdmin(false)}
                        className="btn btn-sm bg-white/10 text-white border-none hover:bg-white/20 mr-2">
                        ← Saytga qaytish
                    </button>
            
                <div className="flex justify-end w-full sm:w-auto    gap-2 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
                    {TABS.map((t) => (
                        <button key={t}
                            onClick={() => { setTab(t); setSelectedUser(null); }}
                            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${tab === t
                                ? "bg-indigo-600 text-white"
                                : "bg-white/5 text-white/60 hover:bg-white/10"
                                }`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-3 sm:p-6 max-w-6xl mx-auto">
                {tab === "Dashboard" && (
                    <div className="flex flex-col gap-6">

                        <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
                            Dashboard
                        </h2>

                        {/* STATS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

                            {[
                                { label: "Jami foydalanuvchilar", value: users.length, icon: "👥", color: "from-indigo-600 to-blue-600" },
                                { label: "Jami ko'rishlar", value: totalViews, icon: "👁️", color: "from-fuchsia-600 to-pink-600" },
                                { label: "Saqlangan filmlar", value: movies.length, icon: "🎬", color: "from-emerald-600 to-teal-600" },
                            ].map((s) => (
                                <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 sm:p-5`}>
                                    <p className="text-2xl sm:text-3xl mb-1">{s.icon}</p>
                                    <p className="text-2xl sm:text-3xl font-bold">{s.value}</p>
                                    <p className="text-white/70 text-xs sm:text-sm mt-1">{s.label}</p>
                                </div>
                            ))}

                        </div>

                        {/* USERS */}
                        <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
                            <h3 className="font-bold mb-4 text-base sm:text-lg">
                                Oxirgi kirgan foydalanuvchilar
                            </h3>

                            <div className="flex flex-col gap-3">
                                {users.slice(0, 5).map((u) => (
                                    <div key={u.uid} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">

                                        <img src={u.photo || "https://via.placeholder.com/36"}
                                            className="w-9 h-9 rounded-full object-cover"
                                            alt={u.name} />

                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{u.name}</p>
                                            <p className="text-white/40 text-xs">{u.email}</p>
                                        </div>

                                        <span className="text-white/40 text-xs">
                                            {fmt(u.lastSeen)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {tab === "Foydalanuvchilar" && !selectedUser && (
                    <div className="flex flex-col gap-4">

                        <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
                            Foydalanuvchilar ({users.length})
                        </h2>

                        <div className="flex flex-col gap-3">
                            {users.map((u) => (
                                <div key={u.uid}
                                    onClick={() => handleUserClick(u)}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 cursor-pointer hover:bg-white/10 transition-all">

                                    <img
                                        src={u.photo || "https://via.placeholder.com/44"}
                                        className="w-11 h-11 rounded-full object-cover"
                                        alt={u.name} />

                                    <div className="flex-1">
                                        <p className="font-semibold">{u.name}</p>
                                        <p className="text-white/50 text-sm">{u.email}</p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-xs text-white/40">Oxirgi kirish</p>
                                        <p className="text-xs text-white/60">{fmt(u.lastSeen)}</p>
                                    </div>

                                    <span className={`badge text-xs ${u.role === "admin" ? "badge-warning" : "badge-ghost"}`}>
                                        {u.role || "user"}
                                    </span>

                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* USER DETAIL */}
                {tab === "Foydalanuvchilar" && selectedUser && (
                    <div className="flex flex-col gap-4">

                        <button onClick={() => setSelectedUser(null)}
                            className="btn btn-sm btn-ghost w-fit">
                            ← Orqaga
                        </button>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <img src={selectedUser.photo || "https://via.placeholder.com/56"}
                                className="w-14 h-14 rounded-full object-cover"
                                alt={selectedUser.name} />

                            <div>
                                <p className="text-lg font-bold">{selectedUser.name}</p>
                                <p className="text-white/50 text-sm">{selectedUser.email}</p>
                                <p className="text-white/40 text-xs mt-1">
                                    Ro'yxatdan o'tgan: {fmt(selectedUser.createdAt)}
                                </p>
                            </div>

                        </div>

                        <h3 className="font-bold text-lg">
                            Ko'rgan filmlari ({userViews.length})
                        </h3>

                        {userViews.length === 0 ? (
                            <p className="text-white/40 text-sm">Hali film ko'rmagan</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                                {userViews.map((v) => (
                                    <div key={v.id} className="bg-white/5 rounded-xl overflow-hidden">

                                        <img src={v.poster
                                            ? `https://image.tmdb.org/t/p/w300${v.poster}`
                                            : "https://via.placeholder.com/150x220"}
                                            className="w-full aspect-[2/3] object-cover"
                                            alt={v.title} />

                                        <div className="p-2">
                                            <p className="text-xs font-medium truncate">{v.title}</p>
                                            <p className="text-white/40 text-xs">
                                                {fmt(v.watchedAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* FILMS */}
                {tab === "Filmlar" && (
                    <div className="flex flex-col gap-4">

                        <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
                            Saqlangan filmlar ({movies.length})
                        </h2>

                        {movies.length === 0 ? (
                            <div className="bg-white/5 rounded-2xl p-6 sm:p-10 text-center text-white/40">
                                <p className="text-3xl sm:text-4xl mb-3">🎬</p>
                                <p>Hali film qo'shilmagan</p>
                                <p className="text-sm mt-1">
                                    MovieCard'da "Saqlash" tugmasini bosing
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">

                                {movies.map((m) => (
                                    <div key={m.docId} className="bg-white/5 rounded-xl overflow-hidden relative group">

                                        <img src={m.poster
                                            ? `https://image.tmdb.org/t/p/w300${m.poster}`
                                            : "https://via.placeholder.com/150x220"}
                                            className="w-full aspect-[2/3] object-cover"
                                            alt={m.title} />

                                        <button onClick={() => handleRemoveMovie(m.docId)}
                                            className="absolute top-2 right-2 bg-red-600 rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110" >
                                            ✕
                                        </button>

                                        <div className="p-2">
                                            <p className="text-xs font-medium truncate">{m.title}</p>
                                            <p className="text-white/40 text-xs">
                                                ⭐ {m.rating?.toFixed(1)}
                                            </p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}