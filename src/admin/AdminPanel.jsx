import { useState, useEffect } from "react";
import { getAllUsers } from "../firebase/userService";
import { getUserViews, getTotalViews } from "../firebase/viewService";
import { getSavedMovies, removeMovie } from "../firebase/movieService";

export default function AdminPanel({ setShowAdmin, lang }) {
    const [tab, setTab] = useState("dashboard");
    const [users, setUsers] = useState([]);
    const [movies, setMovies] = useState([]);
    const [totalViews, setTotalViews] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userViews, setUserViews] = useState([]);
    const [loading, setLoading] = useState(true);

    const texts = {
        EN: {
            dashboard: "Dashboard",
            users: "Users",
            movies: "Movies",
            back: "← Back to site",
            totalUsers: "Total users",
            totalViews: "Total views",
            savedMovies: "Saved movies",
            lastUsers: "Recently active users",
            lastLogin: "Last login",
            watchedMovies: "Watched movies",
            noMovies: "No movies added yet",
            noWatched: "No watched movies yet",
            added: "Added",
            role: "Role",
            registerDate: "Registered",
            saveMovie: 'Click "Save" button in MovieCard',
        },

        UZ: {
            dashboard: "Dashboard",
            users: "Foydalanuvchilar",
            movies: "Filmlar",
            back: "← Saytga qaytish",
            totalUsers: "Jami foydalanuvchilar",
            totalViews: "Jami ko'rishlar",
            savedMovies: "Saqlangan filmlar",
            lastUsers: "Oxirgi kirgan foydalanuvchilar",
            lastLogin: "Oxirgi kirish",
            watchedMovies: "Ko'rgan filmlari",
            noMovies: "Hali film qo'shilmagan",
            noWatched: "Hali film ko'rmagan",
            added: "Qo'shilgan",
            role: "Rol",
            registerDate: "Ro'yxatdan o'tgan",
            saveMovie: `MovieCard'da "Saqlash" tugmasini bosing`,
        },

        RU: {
            dashboard: "Панель",
            users: "Пользователи",
            movies: "Фильмы",
            back: "← Назад на сайт",
            totalUsers: "Всего пользователей",
            totalViews: "Всего просмотров",
            savedMovies: "Сохранённые фильмы",
            lastUsers: "Последние активные пользователи",
            lastLogin: "Последний вход",
            watchedMovies: "Просмотренные фильмы",
            noMovies: "Фильмы ещё не добавлены",
            noWatched: "Фильмы ещё не просмотрены",
            added: "Добавлено",
            role: "Роль",
            registerDate: "Дата регистрации",
            saveMovie: `Нажмите кнопку "Сохранить"`,
        },

        DE: {
            dashboard: "Dashboard",
            users: "Benutzer",
            movies: "Filme",
            back: "← Zurück zur Seite",
            totalUsers: "Gesamte Benutzer",
            totalViews: "Gesamte Aufrufe",
            savedMovies: "Gespeicherte Filme",
            lastUsers: "Zuletzt aktive Benutzer",
            lastLogin: "Letzte Anmeldung",
            watchedMovies: "Angesehene Filme",
            noMovies: "Noch keine Filme hinzugefügt",
            noWatched: "Noch keine angesehenen Filme",
            added: "Hinzugefügt",
            role: "Rolle",
            registerDate: "Registriert",
            saveMovie: `Drücke auf "Speichern"`,
        },

        TR: {
            dashboard: "Panel",
            users: "Kullanıcılar",
            movies: "Filmler",
            back: "← Siteye dön",
            totalUsers: "Toplam kullanıcı",
            totalViews: "Toplam görüntülenme",
            savedMovies: "Kaydedilen filmler",
            lastUsers: "Son aktif kullanıcılar",
            lastLogin: "Son giriş",
            watchedMovies: "İzlenen filmler",
            noMovies: "Henüz film eklenmedi",
            noWatched: "Henüz film izlenmedi",
            added: "Eklendi",
            role: "Rol",
            registerDate: "Kayıt tarihi",
            saveMovie: `"Kaydet" butonuna bas`,
        },
    };

    const t = texts[lang] || texts.EN;

    const tabs = [
        { key: "dashboard", label: t.dashboard },
        { key: "users", label: t.users },
        { key: "movies", label: t.movies },
    ];

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

        setMovies((prev) =>
            prev.filter((m) => m.docId !== docId)
        );
    };

    const fmt = (ts) => {
        if (!ts) return "—";

        const d = ts.toDate
            ? ts.toDate()
            : new Date(ts);

        return d.toLocaleString();
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

            {/* HEADER */}
            <div className="bg-[#0d1426] border-b border-white/10 px-3 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <button
                    onClick={() => setShowAdmin(false)}
                    className="btn btn-sm bg-white/10 text-white border-none hover:bg-white/20 w-full sm:w-auto"
                >
                    {t.back}
                </button>

                <div className="flex gap-2 overflow-x-auto">
                    {tabs.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => {
                                setTab(item.key);
                                setSelectedUser(null);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                                tab === item.key
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white/5 text-white/60 hover:bg-white/10"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-3 sm:p-6 max-w-6xl mx-auto">

                {/* DASHBOARD */}
                {tab === "dashboard" && (
                    <div className="flex flex-col gap-6">

                        <h2 className="text-2xl font-bold">
                            {t.dashboard}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            {[
                                {
                                    label: t.totalUsers,
                                    value: users.length,
                                    icon: "👥",
                                    color: "from-indigo-600 to-blue-600",
                                },

                                {
                                    label: t.totalViews,
                                    value: totalViews,
                                    icon: "👁️",
                                    color: "from-pink-600 to-fuchsia-600",
                                },

                                {
                                    label: t.savedMovies,
                                    value: movies.length,
                                    icon: "🎬",
                                    color: "from-emerald-600 to-teal-600",
                                },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className={`bg-gradient-to-br ${s.color} rounded-2xl p-5`}
                                >
                                    <p className="text-3xl mb-2">
                                        {s.icon}
                                    </p>

                                    <p className="text-3xl font-bold">
                                        {s.value}
                                    </p>

                                    <p className="text-white/70 text-sm mt-1">
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">

                            <h3 className="font-bold text-lg mb-4">
                                {t.lastUsers}
                            </h3>

                            <div className="flex flex-col gap-3">
                                {users.slice(0, 5).map((u) => (
                                    <div
                                        key={u.uid}
                                        className="flex items-center gap-3"
                                    >
                                        <img
                                            src={
                                                u.photo ||
                                                "https://via.placeholder.com/40"
                                            }
                                            className="w-10 h-10 rounded-full object-cover"
                                        />

                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {u.name}
                                            </p>

                                            <p className="text-white/40 text-xs">
                                                {u.email}
                                            </p>
                                        </div>

                                        <span className="text-xs text-white/40">
                                            {fmt(u.lastSeen)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* USERS */}
                {tab === "users" && !selectedUser && (
                    <div className="flex flex-col gap-4">

                        <h2 className="text-2xl font-bold">
                            {t.users} ({users.length})
                        </h2>

                        {users.map((u) => (
                            <div
                                key={u.uid}
                                onClick={() => handleUserClick(u)}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:bg-white/10 transition-all"
                            >
                                <img
                                    src={
                                        u.photo ||
                                        "https://via.placeholder.com/50"
                                    }
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {u.name}
                                    </p>

                                    <p className="text-sm text-white/50">
                                        {u.email}
                                    </p>
                                </div>

                                <div className="text-sm text-white/50">
                                    {fmt(u.lastSeen)}
                                </div>

                                <span className={`badge ${
                                    u.role === "admin"
                                        ? "badge-warning"
                                        : "badge-ghost"
                                }`}>
                                    {u.role || "user"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* USER DETAIL */}
                {tab === "users" && selectedUser && (
                    <div className="flex flex-col gap-4">

                        <button onClick={() => setSelectedUser(null)}
                            className="btn btn-sm btn-ghost w-fit">
                            ← Back
                        </button>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">

                            <img
                                src={
                                    selectedUser.photo ||
                                    "https://via.placeholder.com/60"
                                }
                                className="w-16 h-16 rounded-full object-cover"
                            />

                            <div>
                                <p className="text-xl font-bold">
                                    {selectedUser.name}
                                </p>

                                <p className="text-white/50 text-sm">
                                    {selectedUser.email}
                                </p>

                                <p className="text-white/40 text-xs mt-1">
                                    {t.registerDate}:{" "}
                                    {fmt(selectedUser.createdAt)}
                                </p>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold">
                            {t.watchedMovies} ({userViews.length})
                        </h3>

                        {userViews.length === 0 ? (
                            <p className="text-white/40">
                                {t.noWatched}
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                                {userViews.map((v) => (
                                    <div key={v.id}
                                        className="bg-white/5 rounded-xl overflow-hidden">
                                        <img
                                            src={
                                                v.poster
                                                    ? `https://image.tmdb.org/t/p/w300${v.poster}`
                                                    : "https://via.placeholder.com/150x220"
                                            }
                                            className="w-full aspect-[2/3] object-cover"
                                        />

                                        <div className="p-2">
                                            <p className="text-xs font-medium truncate">
                                                {v.title}
                                            </p>

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

                {/* MOVIES */}
                {tab === "movies" && (
                    <div className="flex flex-col gap-4">

                        <h2 className="text-2xl font-bold">
                            {t.savedMovies} ({movies.length})
                        </h2>

                        {movies.length === 0 ? (
                            <div className="bg-white/5 rounded-2xl p-10 text-center text-white/40">
                                <p className="text-4xl mb-3">🎬</p>

                                <p>{t.noMovies}</p>

                                <p className="text-sm mt-1">
                                    {t.saveMovie}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                                {movies.map((m) => (
                                    <div
                                        key={m.docId}
                                        className="bg-white/5 rounded-xl overflow-hidden relative group"
                                    >
                                        <img
                                            src={
                                                m.poster
                                                    ? `https://image.tmdb.org/t/p/w300${m.poster}`
                                                    : "https://via.placeholder.com/150x220"
                                            }
                                            className="w-full aspect-[2/3] object-cover"
                                        />

                                        <button
                                            onClick={() =>
                                                handleRemoveMovie(m.docId)
                                            }
                                            className="absolute top-2 right-2 bg-red-600 rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            ✕
                                        </button>

                                        <div className="p-2">
                                            <p className="text-xs font-medium truncate">
                                                {m.title}
                                            </p>

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