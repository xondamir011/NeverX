import { useState } from "react";

export default function Drawer( { lang }) {
  const [open, setOpen] = useState(false);

 const t = {
  EN: {
    name: "KXONDAMIR MADALIYEV",
    role: "Frontend Dev | Mobile Graphics",
  },
  UZ: {
    name: "Xondamir Madaliyev",
    role: "Frontend dasturchi | Mobilograf",
  },
  RU: {
    name: "Хондамир Мадалиев",
    role: "Фронтенд разработчик | Мобильная графика",
  },
  DE: {
    name: "Xondamir Madaliyev",
    role: "Frontend Entwickler | Mobile Grafik",
  },
  TR: {
    name: "Xöndâmir Mâdâlíyev",
    role: "Fröntend Gelíştírící | Möbíl Grâfík",
  },
 };

  return (
    <div className="z-20 sm:ml-3 md:ml-0">
      <button onClick={() => setOpen(true)} className="text-white text-2xl">☰</button>

      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50"/>
        )}

      <div className={`fixed top-0 left-0 h-full w-72 bg-gray-900 text-white p-5 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"}`}>
        <button className="w-12 h-12 border-white rounded-full border-2 cursor-pointer" onClick={() => setOpen(false)}>❌</button>

        <div className="text-center mt-5">
          <img src="https://i.pravatar.cc/150" className="w-24 h-24 rounded-full mx-auto border-2 border-cyan-400"/>
          <h2 className="mt-3 text-2xl mb-5">{t[lang]?.name || t.EN.name}</h2>
          <p className="text-cyan-300 text-lg shadow-sm shadow-cyan-500 mb-12">{t[lang]?.role || t.EN.role}</p>

          <h2 className="text-lg text-start">Telegram</h2>
          <a className="pr-40 text-cyan-300 hover:text-cyan-500 transition-colors" href="https://t.me/xondamir_mi">@xondamir_mi</a>

          <h2 className="text-start text-lg mt-5">Git Hub</h2>
          <a className="pr-40 text-cyan-300 hover:text-cyan-500 transition-colors" href="https://github.com/xondamir011">xondamir011</a>

          <h2 className="text-start text-lg mt-5">Email</h2>
          <a className="pr-40 text-cyan-300 hover:text-cyan-500 transition-colors" href="https://xondamirmadaliyev79@gmail.com">xondamirmadaliyev79@gmail.com</a>
        
          <h2 className="text-start text-lg mt-5 mb-1">Phone:</h2>
          <a href="tel:+998935607563" className="text-cyan-300 hover:text-cyan-500 pr-22 transition-colors text-start">📞 +998 93 560 75 63</a>  
        </div>
      </div>
    </div>
  );
}