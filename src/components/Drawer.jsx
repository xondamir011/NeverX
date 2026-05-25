import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Drawer({ lang, user, open, setOpen }) {
  const userImg = user?.photoURL;
  const userEmail = user?.email || "No email";

  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Unknown User";

  const t = {
    EN: {
      role: "Frontend Dev | Mobile Graphics",
    },
    UZ: {
      role: "Frontend dasturchi | Mobilograf",
    },
    RU: {
      role: "Фронтенд разработчик | Мобильная графика",
    },
    DE: {
      role: "Frontend Entwickler | Mobile Grafik",
    },
    TR: {
      role: "Fröntend Gelíştírící | Möbíl Grâfík",
    },
  };

  return (
    <div className="z-20">
      <button onClick={() => setOpen(true)}
        className="text-white text-2xl">
        ☰
      </button>

      {/* OVERLAY */}
      {open && (
        <div onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50" />
      )}

      {/* DRAWER */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-gray-900 text-white p-5 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
        }`}>

        <button className="w-10 h-10 border-white rounded-full border-2"
          onClick={() => setOpen(false)}>
          ❌
        </button>

        {/* USER */}

        <div className="text-center mt-5 flex flex-col items-center">
          {userImg ? (
            <img src={userImg}
              alt="user avatar"
              className="w-24 h-24 rounded-full border-2 border-cyan-400 object-cover" />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400" />
          )}

          {/* NAME */}
          <h2 className="mt-3 text-2xl mb-2 font-semibold">
            {userName}
          </h2>

          {/* ROLE */}
          <p className="text-cyan-300 text-lg mb-8">
            {t[lang]?.role || t.EN.role}
          </p>
        </div>

        {/* LINKS */}
        <div className="text-left space-y-5">

          <div>
            <h2 className="text-lg">Telegram:</h2>
            <a className="text-cyan-300 hover:text-cyan-500"
              href="https://t.me/xondamir_mi"
              target="_blank">
              @xondamir_mi
            </a>
          </div>

          <div>
            <h2 className="text-lg">GitHub:</h2>
            <a className="text-cyan-300 hover:text-cyan-500"
              href="https://github.com/xondamir011"
              target="_blank">
              xondamir011
            </a>
          </div>

          <div>
            <h2 className="text-lg">Email:</h2>
            <a className="text-cyan-300 hover:text-cyan-500"
              href="mailto:xondamirmadaliyev79@gmail.com">
              xondamirmadaliyev79@gmail.com
            </a>
          </div>

          <div>
            <h2 className="text-lg">Phone:</h2>
            <a href="tel:+998935607563"
              className="text-cyan-300 hover:text-cyan-500">
              📞 +998 93 560 75 63
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}