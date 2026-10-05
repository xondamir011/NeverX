import { useState, useRef, useEffect } from "react";
import Drawer from "./Drawer";
import PremiumModal from "../pages/PremiumModal";
import neverx from "../assets/neverx.png";
import {
  FaUserCircle, FaCog, FaPlus, FaUserShield, FaCrown, FaSearch,
  FaChevronDown, FaPalette, FaVideo, FaClosedCaptioning, FaPlay, FaBell,
  FaLock, FaSignOutAlt,
} from "react-icons/fa";
import {
  signOut, updatePassword,
  reauthenticateWithCredential, EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/config";

const THEMES = ["dark", "valentine", "synthwave", "winter", "aqua"];
const QUALITIES = ["Auto", "480p", "720p", "1080p"];
const SUBTITLES = [
  { code: "off", label: null },
  { code: "EN", label: "English" },
  { code: "UZ", label: "O'zbek" },
  { code: "RU", label: "Русский" },
  { code: "DE", label: "Deutsch" },
  { code: "TR", label: "Türkçe" },
];

const T = {
  theme: { EN: "Theme", UZ: "Mavzu", RU: "Тема", DE: "Design", TR: "Tema" },
  quality: { EN: "Video quality", UZ: "Video sifati", RU: "Качество видео", DE: "Videoqualität", TR: "Video kalitesi" },
  subtitles: { EN: "Subtitles", UZ: "Subtitr", RU: "Субтитры", DE: "Untertitel", TR: "Altyazı" },
  off: { EN: "Off", UZ: "O'chiq", RU: "Выкл.", DE: "Aus", TR: "Kapalı" },
  autoplay: { EN: "Autoplay", UZ: "Avto-ijro", RU: "Автовоспроизведение", DE: "Autoplay", TR: "Otomatik oynat" },
  notif: { EN: "Notifications", UZ: "Bildirishnomalar", RU: "Уведомления", DE: "Benachrichtigungen", TR: "Bildirimler" },
  changePw: { EN: "Change password", UZ: "Parolni o'zgartirish", RU: "Сменить пароль", DE: "Passwort ändern", TR: "Şifre değiştir" },
  curPw: { EN: "Current password", UZ: "Joriy parol", RU: "Текущий пароль", DE: "Aktuelles Passwort", TR: "Mevcut şifre" },
  newPw: { EN: "New password", UZ: "Yangi parol", RU: "Новый пароль", DE: "Neues Passwort", TR: "Yeni şifre" },
  save: { EN: "Save", UZ: "Saqlash", RU: "Сохранить", DE: "Speichern", TR: "Kaydet" },
  saving: { EN: "Saving...", UZ: "Saqlanmoqda...", RU: "Сохранение...", DE: "Speichern...", TR: "Kaydediliyor..." },
  cancel: { EN: "Cancel", UZ: "Bekor qilish", RU: "Отмена", DE: "Abbrechen", TR: "İptal" },
  pwOk: { EN: "Password changed successfully", UZ: "Parol muvaffaqiyatli o'zgartirildi", RU: "Пароль успешно изменён", DE: "Passwort erfolgreich geändert", TR: "Şifre başarıyla değiştirildi" },
  pwShort: { EN: "New password must be at least 6 characters", UZ: "Yangi parol kamida 6 ta belgi bo'lsin", RU: "Новый пароль — минимум 6 символов", DE: "Mindestens 6 Zeichen", TR: "En az 6 karakter olmalı" },
  pwWrong: { EN: "Wrong password", UZ: "Parol noto'g'ri", RU: "Неверный пароль", DE: "Falsches Passwort", TR: "Şifre yanlış" },
  relogin: { EN: "Please log in again and retry", UZ: "Qaytadan login qilib, urinib ko'ring", RU: "Войдите заново и повторите", DE: "Bitte erneut anmelden und wiederholen", TR: "Tekrar giriş yapıp deneyin" },
  error: { EN: "Something went wrong", UZ: "Xatolik yuz berdi", RU: "Произошла ошибка", DE: "Etwas ist schiefgelaufen", TR: "Bir hata oluştu" },
};


// localStorage bilan ishlaydigan hook
function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(key);
    if (raw === null) return initial;
    try { return JSON.parse(raw); } catch { return raw; }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export default function Navbar({
  user, setLang, lang, theme, setTheme,
  isAdmin, setShowAdmin, setShowAddMovie, onSearch,
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);

  // Settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [quality, setQuality] = useStored("videoQuality", "Auto");
  const [subtitle, setSubtitle] = useStored("subtitleLang", "off");
  const [autoplay, setAutoplay] = useStored("autoplay", true);
  const [notifications, setNotifications] = useStored("notifications", true);

  // Parol modali
  const [pwModal, setPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const langRef = useRef(null);
  const dropRef = useRef(null);

  const tr = (key) => T[key]?.[lang] || T[key]?.EN || key;
  const toggleSection = (name) => setOpenSection((p) => (p === name ? null : name));

  const handleLogout = async () => await signOut(auth);
  const hasPassword = auth.currentUser?.providerData?.some(
    (p) => p.providerId === "password"
  );

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

  const labels = {
    premium: { EN: "Premium", UZ: "Obuna", RU: "Премиум", DE: "Abonnement", TR: "Abonelik" },
    add: { EN: "Add Movie", UZ: "Film qo'shish", RU: "Добавить фильм", DE: "Film hinzufügen", TR: "Film ekle" },
    admin: { EN: "Admin", UZ: "Administrator", RU: "Админ", DE: "Admin", TR: "Yönetici" },
    settings: { EN: "Settings", UZ: "Sozlamalar", RU: "Настройки", DE: "Einstellungen", TR: "Ayarlar" },
  };

  const out = {
    EN: "Logout", UZ: "Chiqish", RU: "Выйти", DE: "Abmelden", TR: "Çıkış",
  };

  const closePwModal = () => {
    setPwModal(false);
    setCurrentPw("");
    setNewPw("");
    setMsg({ type: "", text: "" });
  };

  const openPwModal = () => {
    setMsg({ type: "", text: "" });
    setDropOpen(false);
    setPwModal(true);
  };

  const errText = (err) => {
    if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential")
      return tr("pwWrong");
    if (err.code === "auth/requires-recent-login") return tr("relogin");
    return tr("error");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw.length < 6) {
      setMsg({ type: "error", text: tr("pwShort") });
      return;
    }
    setLoading(true);
    try {
      const u = auth.currentUser;
      const cred = EmailAuthProvider.credential(u.email, currentPw);
      await reauthenticateWithCredential(u, cred);
      await updatePassword(u, newPw);
      setMsg({ type: "success", text: tr("pwOk") });
      setCurrentPw("");
      setNewPw("");
    } catch (err) {
      setMsg({ type: "error", text: errText(err) });
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ id, icon, title, children }) => (
    <div>
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-base-300 text-sm cursor-pointer"
      >
        <span className="flex items-center gap-2">{icon} {title}</span>
        <FaChevronDown size={10} className={`transition-transform ${openSection === id ? "rotate-180" : ""}`} />
      </button>
      {openSection === id && <div className="mt-1 mb-1 flex flex-col gap-1">{children}</div>}
    </div>
  );

  const Opt = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`btn btn-sm w-full justify-start cursor-pointer ${active ? "btn-primary" : "btn-ghost"}`}
    >
      {children}
    </button>
  );

  const ToggleRow = ({ icon, label, checked, onChange }) => (
    <label className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-base-300 cursor-pointer text-sm">
      <span className="flex items-center gap-2">{icon} {label}</span>
      <input
        type="checkbox"
        className="toggle toggle-sm toggle-primary cursor-pointer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );

  return (
    <>
      {premiumOpen && (
        <PremiumModal lang={lang} onClose={() => setPremiumOpen(false)} />
      )}

      <div className="sticky top-0 z-30 bg-base-200 border-b border-white/10">
        <div className="flex items-center justify-between gap-2 py-2 px-3 sm:px-4">

          {/* CHAP — Drawer + Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isMobile && (
              <Drawer lang={lang} user={user}
                open={drawerOpen} setOpen={setDrawerOpen}
                onSearch={onSearch} setShowAddMovie={setShowAddMovie}
                isAdmin={isAdmin} />
            )}
            <div className="hidden md:flex items-center h-11">
              <img src={neverx} className="h-[115px] w-auto max-w-none object-contain" alt="NeverX" />
            </div>
          </div>

          {/* O'RTA — Search */}
          <div className="flex flex-1 justify-center px-2 md:px-6">
            <div className="relative w-full max-w-sm">
              <FaSearch className="absolute z-5 text-base-content/50 left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
              <input type="text"
                placeholder="Search..."
                onChange={(e) => onSearch?.(e.target.value)}
                className="input input-bordered pl-10 h-11 w-full" />
            </div>
          </div>

          {/* O'NG — tugmalar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {isAdmin && (
              <button onClick={() => { setShowAddMovie(true); localStorage.setItem("admin_tab", "add"); }}
                className="btn bg-base-200 hover:bg-base-100 border-none gap-1 cursor-pointer">
                <FaPlus size={12} /> {labels.add[lang] || "Add Movie"}
              </button>
            )}

            {isAdmin && (
              <button onClick={() => setShowAdmin(true)}
                className="flex items-center btn gap-1 cursor-pointer px-3 py-2 rounded-lg hover:bg-base-300 transition text-sm font-semibold">
                <FaUserShield size={14} /> {labels.admin[lang] || "Admin"}
              </button>
            )}

            {/* Premium tugmasi */}
            <button onClick={() => setPremiumOpen(true)}
              className="btn bg-gradient-to-r from-blue-800 to-red-500 text-white border-none hover:scale-105 transition-all duration-300 shadow-lg gap-1 cursor-pointer">
              <FaCrown size={17} />
              {!isMobile && (labels.premium[lang] || "Premium")}
            </button>

            {/* Language */}
            <div ref={langRef} className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="cursor-pointer text-sm font-semibold px-2 py-1 rounded-lg hover:bg-base-300 transition">
                {lang}
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 bg-base-200 p-2 rounded-xl shadow-xl w-40 z-50 border border-base-300">
                  {languages.map((l) => (
                    <div key={l.code} onClick={() => { setLang(l.code); localStorage.setItem("lang", l.code); setLangOpen(false); }}
                      className="flex gap-2 p-2 hover:bg-base-300 cursor-pointer rounded-lg items-center">
                      <img src={`https://flagcdn.com/w40/${l.flag}.png`} className="w-5 h-4 rounded-sm" alt={l.label} />
                      <span className="text-sm">{l.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar + dropdown */}
            <div ref={dropRef} className="relative">
              <button onClick={() => setDropOpen(!dropOpen)} className="cursor-pointer">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="avatar" referrerPolicy="no-referrer"
                    className="rounded-full object-cover border-2 border-cyan-400 cursor-pointer"
                    style={{ width: isMobile ? 32 : 38, height: isMobile ? 32 : 38 }} />
                ) : (
                  <FaUserCircle size={isMobile ? 30 : 36} className="text-gray-400 cursor-pointer" />
                )}
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-12 w-64 max-h-[80vh] overflow-y-auto bg-base-200 p-4 rounded-2xl shadow-2xl border border-base-300 z-50"
                  style={{ animation: "dropIn 0.2s ease" }}>

                  <div className="text-center mb-4">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="avatar" referrerPolicy="no-referrer"
                        className="w-14 h-14 mx-auto rounded-full border-2 border-cyan-400 object-cover" />
                    ) : (
                      <FaUserCircle size={52} className="mx-auto text-gray-400" />
                    )}
                    <h2 className="mt-2 font-bold text-sm truncate">
                      {user?.displayName || user?.email}
                    </h2>
                  </div>

                  <div className="border-t border-base-300 pt-3">
                    {/* Settings sarlavhasi */}
                    <button
                      onClick={() => setSettingsOpen((v) => !v)}
                      className="w-full flex items-center justify-between cursor-pointer px-2 py-2 rounded-lg hover:bg-base-300 font-semibold text-sm mb-1"
                    >
                      <span className="flex items-center gap-2">
                        <FaCog size={16} /> {labels.settings[lang] || "Settings"}
                      </span>
                      <FaChevronDown size={11} className={`transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Settings ichida faqat sozlamalar */}
                    {settingsOpen && (
                      <div className="ml-2 pl-2 mb-2 border-l border-base-300 flex flex-col gap-1">
                        <Section id="theme" icon={<FaPalette size={13} />} title={tr("theme")}>
                          {THEMES.map((t) => (
                            <Opt key={t} active={theme === t}
                              onClick={() => { setTheme(t); localStorage.setItem("theme", t); }}>
                              {t}
                            </Opt>
                          ))}
                        </Section>

                        <Section id="quality" icon={<FaVideo size={13} />} title={tr("quality")}>
                          {QUALITIES.map((q) => (
                            <Opt key={q} active={quality === q} onClick={() => setQuality(q)}>
                              {q}
                            </Opt>
                          ))}
                        </Section>

                        <Section id="subs" icon={<FaClosedCaptioning size={13} />} title={tr("subtitles")}>
                          {SUBTITLES.map((s) => (
                            <Opt key={s.code} active={subtitle === s.code} onClick={() => setSubtitle(s.code)}>
                              {s.label || tr("off")}
                            </Opt>
                          ))}
                        </Section>

                        <ToggleRow icon={<FaPlay size={12} />} label={tr("autoplay")}
                          checked={autoplay} onChange={setAutoplay} />
                        <ToggleRow icon={<FaBell size={12} />} label={tr("notif")}
                          checked={notifications} onChange={setNotifications} />
                      </div>
                    )}

                    {/* Change password va Logout */}
                    {hasPassword && (
                      <button onClick={openPwModal}
                        className="w-full flex items-center cursor-pointer gap-2 px-2 py-2 rounded-lg hover:bg-base-300 text-sm text-left font-semibold">
                        <FaLock size={13} /> {tr("changePw")}
                      </button>
                    )}

                    <button onClick={handleLogout}
                      className="w-full flex items-center cursor-pointer gap-2 px-2 py-2 text-sm text-red-500 hover:bg-base-300 rounded-lg text-left font-semibold transition">
                      <FaSignOutAlt size={14} /> {out[lang] || "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes dropIn {
            from { opacity: 0; transform: translateY(-8px) scale(0.97);}
            to   { opacity: 1; transform: translateY(0) scale(1);}
          }
        `}</style>
      </div>

      {/* Parolni o'zgartirish modali */}
      {pwModal && (
        <div className="modal modal-open z-[999]">
          <form onSubmit={handleChangePassword} className="modal-box">
            <h3 className="font-bold text-lg mb-4">{tr("changePw")}</h3>
            <input
              type="password"
              placeholder={tr("curPw")}
              className="input input-bordered w-full mb-3"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={tr("newPw")}
              className="input input-bordered w-full"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
            />
            {msg.text && (
              <p className={`mt-3 text-sm ${msg.type === "error" ? "text-error" : "text-success"}`}>
                {msg.text}
              </p>
            )}
            <div className="modal-action">
              <button type="button" className="btn cursor-pointer" onClick={closePwModal}>{tr("cancel")}</button>
              <button type="submit" className="btn btn-primary cursor-pointer" disabled={loading}>
                {loading ? tr("saving") : tr("save")}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}