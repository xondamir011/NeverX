import { useState, useEffect } from "react";
import { FaUserCircle, FaTimes, FaDownload } from "react-icons/fa";

export default function Drawer({ lang, user, open, setOpen }) {
  const userImg = user?.photoURL;
  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Unknown User";

  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };

  const t = {
    EN: { role: "Frontend Dev | Mobile Graphics", install: "Install App", installed: "Installed ✓" },
    UZ: { role: "Frontend dasturchi | Mobilograf", install: "Ilovani o'rnatish", installed: "O'rnatildi ✓" },
    RU: { role: "Фронтенд разработчик | Мобильная графика", install: "Установить", installed: "Установлено ✓" },
    DE: { role: "Frontend Entwickler | Mobile Grafik", install: "App installieren", installed: "Installiert ✓" },
    TR: { role: "Fröntend Gelíştírící | Möbíl Grâfík", install: "Uygulamayı yükle", installed: "Yüklendi ✓" },
  };

  const texts = {
    EN: { phone: "Phone" },
    UZ: { phone: "Telefon" },
    RU: { phone: "Телефон" },
    DE: { phone: "Telefon" },
    TR: { phone: "Telefon" },
  };

  return (
    <div className="z-20">
      {/* Hamburger */}
      <button onClick={() => setOpen(true)}
        className="flex items-center justify-center text-2xl rounded-xl hover:bg-base-300 active:scale-95 transition-all">
        ☰
      </button>

      {/* Overlay */}
      {open && (
        <div onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"/>
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-base-200 text-base p-5 transform transition-transform duration-300 z-40 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Close */}
        <button className="flex justify-center items-center cursor-pointer w-10 h-10 rounded-full border-2 hover:bg-base-300 active:scale-95 transition-all duration-150"
          onClick={() => setOpen(false)}>
          <FaTimes size={22} />
        </button>

        {/* User */}
        <div className="text-center mt-5 flex flex-col items-center">
          {userImg ? (
            <img src={userImg}
              alt="user avatar"
              className="w-24 h-24 rounded-full border-2 border-cyan-400 object-cover"/>
          ) : (
            <FaUserCircle size={96} className="text-gray-400" />
          )}
          <h2 className="mt-3 text-2xl mb-1 font-semibold">{userName}</h2>
          <p className="text-cyan-400 text-sm mb-6">{t[lang]?.role || t.EN.role}</p>
        </div>

        {/* Links */}
        <div className="text-left space-y-4 flex-1">
          <div>
            <h2 className="text-sm opacity-50 uppercase tracking-wider">Telegram</h2>
            <a className="text-cyan-400 hover:text-cyan-300 transition" href="https://t.me/xondamir_mi" target="_blank">
              @xondamir_mi
            </a>
          </div>
          <div>
            <h2 className="text-sm opacity-50 uppercase tracking-wider">GitHub</h2>
            <a className="text-cyan-400 hover:text-cyan-300 transition" href="https://github.com/xondamir011" target="_blank">
              xondamir011
            </a>
          </div>
          <div>
            <h2 className="text-sm opacity-50 uppercase tracking-wider">Email</h2>
            <a className="text-cyan-400 hover:text-cyan-300 transition text-sm" href="mailto:xondamirmadaliyev79@gmail.com">
              xondamirmadaliyev79@gmail.com
            </a>
          </div>
          <div>
            <h2 className="text-sm opacity-50 uppercase tracking-wider">{texts[lang]?.phone}</h2>
            <a href="tel:+998935607563" className="text-cyan-400 hover:text-cyan-300 transition">
              📞 +998 93 560 75 63
            </a>
          </div>
        </div>

        {/* PWA Install tugmasi — pastda */}
        {!installed && installPrompt && (
          <button
            onClick={handleInstall}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #234E70, #5B8DB8)" }}>
            <FaDownload size={16} />
            {t[lang]?.install || t.EN.install}
          </button>
        )}

        {installed && (
          <div className="mt-4 w-full text-center py-3 rounded-xl text-sm opacity-50 border border-current">
            {t[lang]?.installed || t.EN.installed}
          </div>
        )}
      </div>
    </div>
  );
}