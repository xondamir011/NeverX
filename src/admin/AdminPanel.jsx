import { useState, useEffect } from "react";
import { getAllUsers } from "../firebase/userService";
import { getUserViews, getTotalViews } from "../firebase/viewService";
import { getSavedMovies, removeMovie } from "../firebase/movieService";

import {
    FaTimes,
    FaChevronLeft,
    FaUsers,
    FaEye,
    FaFilm,
    FaStar,
} from "react-icons/fa";

export default function AdminPanel({ setShowAdmin, lang }) {
    const [adminLang, setAdminLang] = useState(() => {
        return localStorage.getItem("admin_lang") || "UZ";
    });

    useEffect(() => {
        localStorage.setItem("admin_lang", adminLang);
    }, [adminLang]);

    const texts = {
        EN: {
            dashboard: "Dashboard",
            users: "Users",
            movies: "Movies",
            back: "Back",

            totalUsers: "Total users",
            totalViews: "Total views",
            savedMovies: "Saved movies",

            lastUsers: "Recently active users",
            watchedMovies: "Watched movies",

            noMovies: "No movies added",
            noWatched: "No watched movies",

            role: "Role",
            registerDate: "Registered",
            lastLogin: "Last login",
        },

        UZ: {
            dashboard: "Dashboard",
            users: "Foydalanuvchilar",
            movies: "Filmlar",
            back: "Ortga",

            totalUsers: "Jami foydalanuvchilar",
            totalViews: "Jami ko'rishlar",
            savedMovies: "Saqlangan filmlar",

            lastUsers: "Oxirgi kirgan foydalanuvchilar",
            watchedMovies: "Ko'rgan filmlari",

            noMovies: "Hali film qo'shilmagan",
            noWatched: "Hali film ko'rmagan",

            role: "Rol",
            registerDate: "Ro'yxatdan o'tgan",
            lastLogin: "Oxirgi kirish",
        },

        RU: {
            dashboard: "Панель",
            users: "Пользователи",
            movies: "Фильмы",
            back: "Назад",

            totalUsers: "Всего пользователей",
            totalViews: "Всего просмотров",
            savedMovies: "Сохранённые фильмы",

            lastUsers: "Последние пользователи",
            watchedMovies: "Просмотренные фильмы",

            noMovies: "Фильмы ещё не добавлены",
            noWatched: "Нет просмотренных фильмов",

            role: "Роль",
            registerDate: "Дата регистрации",
            lastLogin: "Последний вход",
        },

        DE: {
            dashboard: "Dashboard",
            users: "Benutzer",
            movies: "Filme",
            back: "Zurück",

            totalUsers: "Gesamte Benutzer",
            totalViews: "Gesamte Aufrufe",
            savedMovies: "Gespeicherte Filme",

            lastUsers: "Zuletzt aktive Benutzer",
            watchedMovies: "Angesehene Filme",

            noMovies: "Noch keine Filme",
            noWatched: "Keine angesehenen Filme",

            role: "Rolle",
            registerDate: "Registriert",
            lastLogin: "Letzte Anmeldung",
        },

        TR: {
            dashboard: "Panel",
            users: "Kullanıcılar",
            movies: "Filmler",
            back: "Geri",

            totalUsers: "Toplam kullanıcı",
            totalViews: "Toplam görüntülenme",
            savedMovies: "Kaydedilen filmler",

            lastUsers: "Son aktif kullanıcılar",
            watchedMovies: "İzlenen filmler",

            noMovies: "Henüz film yok",
            noWatched: "İzlenen film yok",

            role: "Rol",
            registerDate: "Kayıt tarihi",
            lastLogin: "Son giriş",
        },
    };

    const t = texts[lang] || texts.EN;

    const [tab, setTab] = useState("dashboard");

    const [users, setUsers] = useState([]);
    const [movies, setMovies] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);

    const [userViews, setUserViews] = useState([]);

    const [totalViews, setTotalViews] = useState(0);

    const [loading, setLoading] = useState(true);

    /* ================= LOAD ================= */

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        const u = await getAllUsers();

        const m = await getSavedMovies();

        const tv = await getTotalViews(
            u.map((x) => x.uid)
        );

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
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100">
            <div className="border-b border-white/10 p-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <button onClick={() => setShowAdmin(false)}
                        className="btn bg-base-200 border-none hover:bg-base-300 transition-all">
                        <FaChevronLeft />
                        {t.back}
                    </button>

                    <div className="flex items-center gap-2 overflow-x-auto">
                        {[
                            {
                                key: "dashboard",
                                label: t.dashboard,
                            },

                            {
                                key: "users",
                                label: t.users,
                            },

                            {
                                key: "movies",
                                label: t.movies,
                            },
                        ].map((item) => (
                            <button key={item.key}
                                onClick={() => {
                                    setTab(item.key);
                                    setSelectedUser(null);
                                }}
                                className={`px-4 py-2 rounded-xl cursor-pointer transition-all whitespace-nowrap
                                  ${tab === item.key
                                        ? "bg-primary text-white"
                                        : "bg-base-200 hover:bg-base-300"
                                    }`}>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-4 max-w-6xl mx-auto">
                {tab === "dashboard" && (
                    <div className="flex flex-col gap-5">

                        <h2 className="text-2xl font-bold">
                            {t.dashboard}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            {[
                                {
                                    label: t.totalUsers,
                                    value: users.length,
                                    icon: <FaUsers />,
                                },

                                {
                                    label: t.totalViews,
                                    value: totalViews,
                                    icon: <FaEye />,
                                },

                                {
                                    label: t.savedMovies,
                                    value: movies.length,
                                    icon: <FaFilm />,
                                },
                            ].map((s) => (
                                <div key={s.label}
                                    className="bg-base-200 rounded-2xl p-5">
                                    <div className="text-3xl mb-2">
                                        {s.icon}
                                    </div>

                                    <p className="text-3xl font-bold">
                                        {s.value}
                                    </p>

                                    <p className="opacity-70 mt-1">
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* LAST USERS */}
                        <div className="bg-base-200 rounded-2xl p-5">

                            <h3 className="font-bold text-lg mb-4">
                                {t.lastUsers}
                            </h3>

                            <div className="flex flex-col gap-3">

                                {users.slice(0, 5).map((u) => (
                                    <div key={u.uid}
                                        className="flex items-center gap-3">
                                        <img src={
                                            u.photo ||
                                            "https://via.placeholder.com/40"
                                        }
                                            className="w-10 h-10 rounded-full object-cover" />

                                        <div className="flex-1">
                                            <p>{u.name}</p>

                                            <p className="text-sm opacity-60">
                                                {u.email}
                                            </p>
                                        </div>

                                        <p className="text-xs opacity-60">
                                            {fmt(u.lastSeen)}
                                        </p>
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
                            <div key={u.uid}
                                onClick={() => handleUserClick(u)}
                                className="bg-base-200 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-base-300 transition-all">
                                <img src={
                                    u.photo ||
                                    "https://via.placeholder.com/50"
                                }
                                    className="w-12 h-12 rounded-full object-cover" />

                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {u.name}
                                    </p>

                                    <p className="text-sm opacity-60">
                                        {u.email}
                                    </p>
                                </div>

                                <p className="text-xs opacity-60">
                                    {fmt(u.lastSeen)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* USER DETAIL */}
                {tab === "users" && selectedUser && (
                    <div className="flex flex-col gap-4">

                        <button onClick={() => setSelectedUser(null)}
                            className="btn bg-base-200 border-none w-fit">
                            <FaChevronLeft />
                            {t.back}
                        </button>

                        <div className="bg-base-200 rounded-2xl p-5 flex gap-4">

                            <img src={
                                selectedUser.photo ||
                                "https://via.placeholder.com/60"
                            }
                                className="w-16 h-16 rounded-full object-cover" />

                            <div>
                                <p className="text-xl font-bold">
                                    {selectedUser.name}
                                </p>

                                <p className="opacity-60">
                                    {selectedUser.email}
                                </p>

                                <p className="text-sm opacity-50 mt-1">
                                    {t.registerDate}:{" "}
                                    {fmt(selectedUser.createdAt)}
                                </p>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg">
                            {t.watchedMovies} (
                            {userViews.length})
                        </h3>

                        {userViews.length === 0 ? (
                            <p className="opacity-50">
                                {t.noWatched}
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                                {userViews.map((v) => (
                                    <div key={v.id}
                                        className="bg-base-200 rounded-xl overflow-hidden">
                                        {v.poster ? (
                                            <img src={`https://image.tmdb.org/t/p/w300${v.poster}`}
                                                className="w-full aspect-[2/3] object-cover" />
                                        ) : (
                                            <div className="w-full aspect-[2/3] flex items-center justify-center bg-base-300">
                                                <FaFilm size={40} />
                                            </div>
                                        )}

                                        <div className="p-3">
                                            <p className="text-sm font-semibold truncate">
                                                {v.title}
                                            </p>

                                            <p className="text-xs opacity-60">
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
                            {t.movies} ({movies.length})
                        </h2>

                        {movies.length === 0 ? (
                            <div className="bg-base-200 rounded-2xl p-10 text-center">
                                <FaFilm size={50} className="mx-auto opacity-50 mb-3" />

                                <p className="opacity-60">
                                    {t.noMovies}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                                {movies.map((m) => (
                                    <div key={m.docId}
                                        className="bg-base-200 rounded-xl overflow-hidden relative group">

                                        {m.poster ? (
                                            <img src={`https://image.tmdb.org/t/p/w300${m.poster}`}
                                                className="w-full aspect-[2/3] object-cover" />
                                        ) : (
                                            <div className="w-full aspect-[2/3] flex items-center justify-center bg-base-300">
                                                <FaFilm size={40} />
                                            </div>
                                        )}

                                        <button onClick={() =>
                                            handleRemoveMovie(m.docId)
                                        }
                                            className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                            <FaTimes size={14} />
                                        </button>

                                        <div className="p-3">
                                            <p className="font-semibold truncate">
                                                {m.title}
                                            </p>

                                            <p className="text-xs opacity-60 flex items-center gap-1 mt-1">
                                                <FaStar />
                                                {m.rating?.toFixed(1)}
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