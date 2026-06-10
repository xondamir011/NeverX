import { useState, useEffect } from "react";
import { getAllUsers } from "../firebase/userService";
import { getUserViews, getTotalViews } from "../firebase/viewService";
import { getSavedMovies, removeMovie } from "../firebase/movieService";
import { getAdminMovies, removeAdminMovie } from "../firebase/movieAdminService";
import AddMovie from "./AddMovie";

import {
  FaTimes,
  FaChevronLeft,
  FaUsers,
  FaEye,
  FaFilm,
  FaStar,
  FaPlus,
} from "react-icons/fa";

export default function AdminPanel({ setShowAdmin, lang }) {
  const texts = {
    EN: {
      dashboard: "Dashboard",
      users: "Users",
      movies: "Movies",
      addMovie: "Add Movie",
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

      title: "Movie title",
      poster: "Poster URL",
      backdrop: "Backdrop URL",
      rating: "Rating",
      year: "Year",
      genre: "Genre",
      desc: "Description",

      publish: "Publish Movie",
    },

    UZ: {
      dashboard: "Dashboard",
      users: "Foydalanuvchilar",
      movies: "Filmlar",
      addMovie: "Kino qo'shish",
      back: "Ortga",

      totalUsers: "Jami foydalanuvchilar",
      totalViews: "Jami ko'rishlar",
      savedMovies: "Saqlangan filmlar",

      lastUsers: "Oxirgi foydalanuvchilar",
      watchedMovies: "Ko'rgan filmlari",

      noMovies: "Hali kino yo'q",
      noWatched: "Ko'rilgan kino yo'q",

      role: "Rol",
      registerDate: "Ro'yxatdan o'tgan",
      lastLogin: "Oxirgi kirish",

      title: "Kino nomi",
      poster: "Poster URL",
      backdrop: "Backdrop URL",
      rating: "Reyting",
      year: "Yili",
      genre: "Janr",
      desc: "Tavsif",

      publish: "Kinoni joylash",
    },

    RU: {
      dashboard: "Панель",
      users: "Пользователи",
      movies: "Фильмы",
      addMovie: "Добавить фильм",
      back: "Назад",

      totalUsers: "Всего пользователей",
      totalViews: "Всего просмотров",
      savedMovies: "Сохранённые фильмы",

      lastUsers: "Последние пользователи",
      watchedMovies: "Просмотренные фильмы",

      noMovies: "Фильмов нет",
      noWatched: "Нет просмотренных фильмов",

      role: "Роль",
      registerDate: "Дата регистрации",
      lastLogin: "Последний вход",

      title: "Название фильма",
      poster: "Poster URL",
      backdrop: "Backdrop URL",
      rating: "Рейтинг",
      year: "Год",
      genre: "Жанр",
      desc: "Описание",

      publish: "Опубликовать",
    },

    DE: {
      dashboard: "Dashboard",
      users: "Benutzer",
      movies: "Filme",
      addMovie: "Film hinzufügen",
      back: "Zurück",

      totalUsers: "Gesamte Benutzer",
      totalViews: "Gesamte Aufrufe",
      savedMovies: "Gespeicherte Filme",

      lastUsers: "Letzte Benutzer",
      watchedMovies: "Angesehene Filme",

      noMovies: "Keine Filme",
      noWatched: "Keine angesehenen Filme",

      role: "Rolle",
      registerDate: "Registriert",
      lastLogin: "Letzte Anmeldung",

      title: "Filmtitel",
      poster: "Poster URL",
      backdrop: "Backdrop URL",
      rating: "Bewertung",
      year: "Jahr",
      genre: "Genre",
      desc: "Beschreibung",

      publish: "Film veröffentlichen",
    },

    TR: {
      dashboard: "Panel",
      users: "Kullanıcılar",
      movies: "Filmler",
      addMovie: "Film ekle",
      back: "Geri",

      totalUsers: "Toplam kullanıcı",
      totalViews: "Toplam görüntülenme",
      savedMovies: "Kaydedilen filmler",

      lastUsers: "Son kullanıcılar",
      watchedMovies: "İzlenen filmler",

      noMovies: "Film yok",
      noWatched: "İzlenen film yok",

      role: "Rol",
      registerDate: "Kayıt tarihi",
      lastLogin: "Son giriş",

      title: "Film adı",
      poster: "Poster URL",
      backdrop: "Backdrop URL",
      rating: "Puan",
      year: "Yıl",
      genre: "Tür",
      desc: "Açıklama",

      publish: "Filmi yayınla",
    },
  };

  const API_KEY = "44cae21994113f58296e3b6d0db555f3";

  const t = texts[lang] || texts.EN;
  const [tab, setTab] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userViews, setUserViews] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const usersData = await getAllUsers();
      const adminMovies = await getAdminMovies();

      const fullMovies = await Promise.all(
        adminMovies.map(async (movie) => {
          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=${API_KEY}&language=en-US`
            );

            const data = await res.json();

            return {
              ...data,
              docId: movie.docId,
            };
          } catch {
            return null;
          }
        })
      );

      const tv = await getTotalViews(
        usersData.map((u) => u.uid)
      );

      setUsers(usersData);

      setMovies(
        fullMovies.filter(Boolean)
      );

      setTotalViews(tv);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieAdded = async () => {
    await loadData();
    setTab("movies");
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);

    const views = await getUserViews(user.uid);

    setUserViews(views);
  };

  const handleRemoveMovie = async (docId) => {
    await removeAdminMovie(docId);

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
            className="btn bg-base-200 border-none hover:bg-base-300">
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

              {
                key: "addMovie",
                label: t.addMovie,
              },
            ].map((item) => (
              <button key={item.key}
                onClick={() => {
                  setTab(item.key);
                  setSelectedUser(null);
                }}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all
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

      {/* Dashboard */}
      <div className="p-4 max-w-6xl mx-auto">
        {tab === "addMovie" && (
          <AddMovie onMovieAdded={handleMovieAdded} />
        )}

        {/* USERS */}
        {tab === "users" && !selectedUser && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">
              {t.users} ({users.length})
            </h2>

            {users.map((u) => (
              <div key={u.uid} onClick={() => handleUserClick(u)}
                className="bg-base-200 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-base-300 transition-all">

                <img src={u.photo || "https://via.placeholder.com/50"}
                  className="w-12 h-12 rounded-full object-cover"/>

                <div className="flex-1">
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm opacity-60">{u.email}</p>
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
                className="w-16 h-16 rounded-full object-cover"/>

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
                <FaFilm size={50}
                  className="mx-auto opacity-50 mb-3"/>

                <p className="opacity-60">
                  {t.noMovies}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {movies.map((m) => (
                  <div key={m.docId}
                    className="bg-base-200 rounded-xl overflow-hidden relative group">
                    {m.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                        className="w-full aspect-[2/3] object-cover"/>
                    ) : (
                      <div className="w-full aspect-[2/3] flex items-center justify-center bg-base-300">
                        <FaFilm size={40} />
                      </div>
                    )}

                    <button
                      onClick={() =>
                        handleRemoveMovie(m.docId)
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <FaTimes size={14} />
                    </button>

                    <div className="p-3">
                      <p className="font-semibold truncate">
                        {m.title || m.name}
                      </p>

                      <p className="text-xs opacity-60 flex items-center gap-1 mt-1">
                        <FaStar />
                        {m.vote_average?.toFixed(1)}
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