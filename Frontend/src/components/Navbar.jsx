import { useState, useRef, useEffect } from "react";
import Drawer from "./Drawer";
import { FaUserCircle, FaCog, FaPlus, FaUserShield, FaCrown, FaFilm, FaSearch } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Navbar({
  user, setLang, lang, theme, setTheme,
  isAdmin, setShowAdmin, setShowAddMovie, onSearch,
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const langRef = useRef(null);
  const dropRef = useRef(null);

  const handleLogout = async () => await signOut(auth);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const languages = [
    { code: "EN", label: "English", flag: "us" },
    { code: "UZ", label: "O'zbek", flag: "uz" },
    { code: "RU", label: "Русский", flag: "ru" },
    { code: "DE", label: "Deutsch", flag: "de" },
    { code: "TR", label: "Türkçe", flag: "tr" },
  ];

  const plans = [
    {
      id: "month",
      title: "1 Oylik",
      price: "80 900 so'm",
    },
    {
      id: "quarter",
      title: "3 Oylik",
      price: "105 900 so'm",
    },
    {
      id: "year",
      title: "1 Yillik",
      price: "249 900 so'm",
    },
  ];

  const premium = {
    EN: {
      label: "Premium",
    },
    UZ: {
      label: "Obuna",
    },
    RU: {
      label: "Премиум",
    },
    DE: {
      label: "Abonnement",
    },
    TR: {
      label: "Abonelik",
    }
  };

  const add = {
    EN: {
      label: "Add Movie",
    },
    UZ: {
      label: "Film qo'shish",
    },
    RU: {
      label: "Добавить фильм",
    },
    DE: {
      label: "Film hinzufügen",
    },
    TR: {
      label: "Film ekle",
    }
  }

  const admin = {
    EN: {
      label: "Admin",
    },
    UZ: {
      label: "Adminstrator",
    },
    RU: {
      label: "Админ",
    },
    DE: {
      label: "Admin",
    },
    TR: {
      label: "Yönetici",
    }
  }

  const cog = {
    EN: {
      label: "Settings",
    },
    UZ: {
      label: "Sozlamalar",
    },
    RU: {
      label: "Настройки",
    },
    DE: {
      label: "Einstellungen",
    },
    TR: {
      label: "Ayarlar",
    }
  }

  return (
    <>
      {premiumOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-base-100 rounded-2xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200"
                alt="premium" className="h-40 sm:h-56 w-full object-cover"/>

              <button onClick={() => {
                  setPremiumOpen(false);
                  setSelectedPlan(null);
                }}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 btn btn-circle btn-xs sm:btn-sm">
                ✕
              </button>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-3 sm:p-5 text-white">
                  <h2 className="text-xl sm:text-3xl font-bold flex items-center gap-2">
                    <FaCrown size={isMobile ? 18 : 22} />
                    Space Premium
                  </h2>
                  <p className="text-xs sm:text-sm opacity-90">
                    Premium imkoniyatlardan foydalaning
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-4 sm:p-5 space-y-4">

              {/* BENEFITS */}
              <div className="flex gap-3">
                <FaCrown className="text-warning mt-1" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Premium Nishon</h3>
                  <p className="text-xs sm:text-sm opacity-70">
                    Profilingiz yonida maxsus premium belgi.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <FaFilm className="text-info mt-1" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Eksklyuziv kontent</h3>
                  <p className="text-xs sm:text-sm opacity-70">
                    Premium foydalanuvchilar uchun maxsus filmlar.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <FaUserShield className="text-success mt-1" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Reklamasiz foydalanish</h3>
                  <p className="text-xs sm:text-sm opacity-70">
                    Hech qanday reklamalarsiz.
                  </p>
                </div>
              </div>

              {/* PLANS */}
              {!selectedPlan ? (
                <>
                <div className="divider text-xs sm:text-sm">Tarif tanlang</div>
                  <div className="space-y-3">
                    {plans.map((plan) => (
                      <button key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className="w-full border border-base-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-primary hover:bg-base-200 transition">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm sm:text-base">
                            {plan.title}
                          </span>
                          <span className="text-primary font-bold text-sm sm:text-base">
                            {plan.price}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-3">

                  <div className="alert alert-success text-xs sm:text-sm">
                    Tanlangan tarif: {selectedPlan.title}
                  </div>

                  <input type="text"
                    placeholder="8600 1234 5678 9012"
                    maxLength={19}
                    className="input input-bordered w-full text-sm"/>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <input type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="input input-bordered text-sm"/>

                    <input type="password"
                      placeholder="CVV"
                      maxLength={3}
                      className="input input-bordered text-sm"/>
                  </div>

                  <button
                    className="btn btn-primary w-full text-sm sm:text-base"
                    onClick={() => {
                      alert(
                        `Demo: ${selectedPlan.title} tanlandi.\nReal to'lov uchun Payme/Click backend kerak.`
                      );
                    }}>
                    {selectedPlan.price} to‘lash
                  </button>

                  <button className="btn btn-ghost w-full text-sm"
                    onClick={() => setSelectedPlan(null)}>
                    Ortga
                  </button>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-30 bg-base-200 border-b border-white/10">
        <div className="flex items-center justify-between gap-2 py-2 px-3 sm:px-4">
          {/* CHAP — Drawer + Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isMobile && (
              <Drawer
                lang={lang} user={user}
                open={drawerOpen} setOpen={setDrawerOpen}
                onSearch={onSearch} setShowAddMovie={setShowAddMovie}
                isAdmin={isAdmin} />
            )}
            <div className="hidden md:flex items-center gap-1">
              <FaFilm size={25} />
              <h2 className="font-bold text-lg">NeverX</h2>
            </div>
          </div>

          {/* O'RTA — Search */}
          <div className="flex flex-1 justify-center px-2 md:px-6">
            <div className="relative w-full md:max-w-sm">
              <FaSearch className="absolute z-5 text-white left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
              <input type="text"
                placeholder="Search..."
                onChange={(e) => onSearch?.(e.target.value)}
                className="input input-bordered pl-10 h-11 w-full sm:w-xl" />
            </div>
          </div>

          {/* O'NG — tugmalar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!isMobile && isAdmin && (
              <button onClick={() => { setShowAddMovie(true); localStorage.setItem("admin_tab", "add"); }}
                className="btn bg-base-200 hover:bg-base-100 border-none gap-1">
                <FaPlus size={12} /> {add[lang]?.label || "Add Movie"}
              </button>
            )}

            {!isMobile && isAdmin && (
              <button onClick={() => setShowAdmin(true)}
                className="flex items-center btn gap-1 cursor-pointer px-3 py-2 rounded-lg hover:bg-base-300 transition text-sm font-semibold">
                <FaUserShield size={14} /> {admin[lang]?.label || "Admin"}
              </button>
            )}

            <button onClick={() => setPremiumOpen(true)} className="btn bg-gradient-to-r from-blue-800 to-red-500 text-white border-none hover:scale-105 transition-all duration-300 shadow-lg gap-1">
              <FaCrown size={17} />{premium[lang]?.label || "Premium"}
            </button>

            <div ref={langRef} className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="cursor-pointer text-sm font-semibold px-2 py-1 rounded-lg hover:bg-base-300 transition">
                {lang}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 bg-base-200 p-2 rounded-xl shadow-xl w-40 z-50 border border-base-300">
                  {languages.map((l) => (
                    <div key={l.code}
                      onClick={() => { setLang(l.code); localStorage.setItem("lang", l.code); setLangOpen(false); }}
                      className="flex gap-2 p-2 hover:bg-base-300 cursor-pointer rounded-lg items-center">
                      <img src={`https://flagcdn.com/w40/${l.flag}.png`} className="w-5 h-4 rounded-sm" alt={l.label} />
                      <span className="text-sm">{l.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div ref={dropRef} className="relative">
              <button onClick={() => setDropOpen(!dropOpen)}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="avatar"
                    className="rounded-full object-cover border-2 border-cyan-400 cursor-pointer"
                    style={{ width: isMobile ? 32 : 38, height: isMobile ? 32 : 38 }} />
                ) : (
                  <FaUserCircle size={isMobile ? 30 : 36} className="text-gray-400 cursor-pointer" />
                )}
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-12 w-56 bg-base-200 p-4 rounded-2xl shadow-2xl border border-base-300 z-50"
                  style={{ animation: "dropIn 0.2s ease" }}>
                  <div className="text-center mb-4">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="avatar"
                        className="w-14 h-14 mx-auto rounded-full border-2 border-cyan-400 object-cover" />
                    ) : (
                      <FaUserCircle size={52} className="mx-auto text-gray-400" />
                    )}
                    <h2 className="mt-2 font-bold text-sm truncate">
                      {user?.displayName || user?.email}
                    </h2>
                  </div>

                  <div className="border-t border-base-300 pt-3">
                    <div className="dropdown dropdown-end w-full">
                      <div tabIndex={0} className="cursor-pointer flex justify-center gap-1 items-center px-2 py-2 rounded-lg hover:bg-base-300 font-semibold text-sm mb-1">
                        <FaCog size={18} /> <h2 className="leading-none">{cog[lang]?.label || "Settings"}</h2>
                      </div>

                      <ul className="dropdown-content bg-base-300 rounded-xl w-40 p-2 shadow-xl z-50">
                        {["dark", "valentine", "synthwave", "winter", "aqua"].map((t) => (
                          <li key={t}>
                            <button onClick={() => { setTheme(t); localStorage.setItem("theme", t); }}
                              className={`btn btn-sm w-full justify-start mb-1 ${theme === t ? "btn-primary" : "btn-ghost"}`}>
                              {t}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={handleLogout}
                      className="w-full px-2 py-2 text-sm text-red-500 hover:bg-base-300 rounded-lg text- font-semibold transition">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-8px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `}</style>
      </div>
    </>
  );
}
