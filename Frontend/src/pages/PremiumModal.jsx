// import { useState } from "react";
// import { FaTimes, FaCrown, FaFilm, FaStar, FaBolt, FaShieldAlt, FaInfinity } from "react-icons/fa";
// import { auth } from "../firebase/config";

// const BACKEND_URL = "http://localhost:3001";

// const plans = [
//   { id: "monthly",   label: { EN: "1 Month",  UZ: "1 Oy",  RU: "1 Месяц", DE: "1 Monat",  TR: "1 Ay"  }, price: "69 900", popular: false },
//   { id: "quarterly", label: { EN: "3 Months", UZ: "3 Oy",  RU: "3 Месяца",DE: "3 Monate", TR: "3 Ay"  }, price: "105 900", popular: true  },
//   { id: "yearly",    label: { EN: "1 Year",   UZ: "1 Yil", RU: "1 Год",   DE: "1 Jahr",   TR: "1 Yıl" }, price: "249 900", popular: false },
// ];

// const features = [
//   { icon: <FaFilm />,      color: "#f97316", title: { EN: "Unlimited Movies",  UZ: "Cheksiz filmlar",            RU: "Безлимитные фильмы"    }, desc: { EN: "Watch any movie without limits", UZ: "Istalgan filmni tomosha qiling", RU: "Смотрите любые фильмы" } },
//   { icon: <FaBolt />,      color: "#eab308", title: { EN: "No Ads",            UZ: "Reklamasiz",                 RU: "Без рекламы"           }, desc: { EN: "Uninterrupted viewing",          UZ: "Reklamasiz tomosha",             RU: "Без прерываний"        } },
//   { icon: <FaStar />,      color: "#8b5cf6", title: { EN: "Premium Badge",     UZ: "Premium nishoni",            RU: "Премиум значок"        }, desc: { EN: "Exclusive badge on your profile",UZ: "Profilingizda eksklyuziv belgi", RU: "Значок на профиле"     } },
//   { icon: <FaShieldAlt />, color: "#10b981", title: { EN: "Priority Support",  UZ: "Ustuvor yordam",             RU: "Приоритетная поддержка"}, desc: { EN: "Faster support response",        UZ: "Tezroq yordam",                  RU: "Быстрый ответ"         } },
//   { icon: <FaInfinity />,  color: "#3b82f6", title: { EN: "4K Quality",        UZ: "4K sifat",                   RU: "4K качество"           }, desc: { EN: "Watch in ultra HD 4K",           UZ: "Ultra HD 4K sifatida",           RU: "Смотрите в 4K"         } },
// ];

// export default function PremiumModal({ lang = "EN", onClose }) {
//   const [selected, setSelected] = useState("quarterly");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubscribe = async () => {
//     const user = auth.currentUser;
//     if (!user) { setError("Avval login qiling!"); return; }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/create-payment`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           planId: selected,
//           userId: user.uid,
//           userEmail: user.email,
//         }),
//       });

//       const data = await res.json();

//       if (data.paymeUrl) {
//         // Payme to'lov sahifasini ochamiz
//         window.open(data.paymeUrl, "_blank");
//         onClose();
//       } else {
//         setError(data.error || "Xatolik yuz berdi");
//       }
//     } catch (err) {
//       setError("Server bilan bog'lanib bo'lmadi");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const plan = plans.find(p => p.id === selected);

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
//       style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
//       onClick={onClose}>

//       <div className="bg-base-100 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
//         style={{ maxHeight: "92vh", overflowY: "auto" }}
//         onClick={e => e.stopPropagation()}>

//         {/* Header */}
//         <div className="flex items-center justify-between px-5 pt-5 pb-2">
//           <h2 className="text-lg font-bold">NeverX Premium</h2>
//           <button onClick={onClose} className="w-10 h-10 cursor-pointer rounded-full bg-base-200 flex items-center justify-center hover:bg-base-300 transition-all">
//             <FaTimes size={18} />
//           </button>
//         </div>

//         {/* Hero */}
//         <div className="mx-4 rounded-2xl overflow-hidden relative h-48"
//           style={{ background: "linear-gradient(135deg, #4FC3F7, #0288D1)" }}>
//           {[...Array(14)].map((_, i) => (
//             <div key={i} style={{
//               position: "absolute", width: 5, height: 5, borderRadius: "50%",
//               background: "rgba(255,255,255,0.9)",
//               top: `${Math.random() * 90}%`, left: `${Math.random() * 95}%`,
//               animation: `tw ${1 + Math.random() * 2}s ease-in-out infinite alternate`,
//             }}/>
//           ))}

//           <div style={{ position: "absolute", bottom: 0, center: 0, left: "50%", color: "orange", transform: "translate(-50%, -100%)", fontSize: 72 }}><FaCrown /></div>
//           <div style={{
//             position: "absolute", bottom: 0, left: 0, right: 0,
//             background: "linear-gradient(to top, rgba(2,136,209,0.9), transparent)",
//             padding: "16px 16px 12px", textAlign: "center",}}>

//             <p className="flex items-center justify-center gap-2 font-bold "><FaCrown /> NeverX Premium</p>
//             <p className="text-white/80 text-xs mt-0.5">
//               {lang === "UZ" ? "Premium bilan yanada ko'proq imkoniyatlarga ega bo'ling"
//                : lang === "RU" ? "Получите больше возможностей с Premium"
//                : "Get more features with NeverX Premium"}
//             </p>

//           </div>
//         </div>

//         {/* Features */}
//         <div className="px-4 mt-4 flex flex-col gap-3">
//           {features.map((f, i) => (
//             <div key={i} className="flex items-start gap-3">
//               <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
//                 style={{ background: f.color }}>
//                 {f.icon}
//               </div>
//               <div>
//                 <p className="font-bold text-sm">{f.title[lang] || f.title.EN}</p>
//                 <p className="text-xs opacity-55 mt-1">{f.desc[lang] || f.desc.EN}</p>
//               </div>
//             </div>
//           ))}   
//         </div>

//         {/* Plan selector */}
//         <div className="px-4 mt-5 flex gap-2">
//           {plans.map(p => (
//             <button key={p.id} onClick={() => setSelected(p.id)}
//               className="flex-1 rounded-2xl py-3 px-1 border-2 transition-all cursor-pointer relative text-center"
//               style={{
//                 borderColor: selected === p.id ? "#6366f1" : "rgba(255,255,255,0.1)",
//                 background: selected === p.id ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
//               }}>

//               {p.popular && (
//                 <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
//                   {lang === "UZ" ? "Mashhur" : lang === "RU" ? "Хит" : "Popular"}
//                 </span>
//               )}

//               <p className="font-bold text-sm">{p.label[lang] || p.label.EN}</p>
//               <p className="text-xs opacity-50 mt-0.5">{p.price} so'm</p>
//             </button>
//           ))}
//         </div>

//         {/* Error */}
//         {error && (
//           <p className="text-red-500 text-xs text-center mt-3 px-4">{error}</p>
//         )}

//         {/* Subscribe button */}
//         <div className="px-4 py-5">
//           <button onClick={handleSubscribe}
//             disabled={loading}
//             className="w-full py-4 cursor-pointer rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
//             style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", opacity: loading ? 0.7 : 1 }}>

//             {loading
//               ? <span className="loading loading-spinner loading-sm" />
//               : <>
//                   <FaCrown size={16} />
//                   {lang === "UZ" ? `Oyiga ${plan.price} so'm evaziga obuna bo'lish`
//                    : lang === "RU" ? `Подписаться за ${plan.price} сум/мес`
//                    : `Subscribe for ${plan.price} UZS`}
//                 </>
//             }
//           </button>
//           <p className="text-center text-xs opacity-35 mt-2">
//             {lang === "UZ" ? "Payme orqali xavfsiz to'lov"
//              : lang === "RU" ? "Безопасная оплата через Payme"
//              : "Secure payment via Payme"}
//           </p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes tw {
//           from { opacity: 0.2; transform: scale(0.7); }
//           to   { opacity: 1;   transform: scale(1.3); }
//         }
//       `}</style>
//     </div>
//   );
// }



import { useState } from "react";
import { FaTimes, FaCrown, FaFilm, FaStar, FaBolt, FaShieldAlt, FaInfinity } from "react-icons/fa";
import { auth, db } from "../firebase/config";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

const plans = [
    { id: "monthly", label: { EN: "1 Month", UZ: "1 Oy", RU: "1 Месяц", DE: "1 Monat", TR: "1 Ay" }, price: "69 900", days: 30, popular: false },
    { id: "quarterly", label: { EN: "3 Months", UZ: "3 Oy", RU: "3 Месяца", DE: "3 Monate", TR: "3 Ay" }, price: "105 900", days: 90, popular: true },
    { id: "yearly", label: { EN: "1 Year", UZ: "1 Yil", RU: "1 Год", DE: "1 Jahr", TR: "1 Yıl" }, price: "249 900", days: 365, popular: false },
];

const features = [
    { icon: <FaFilm />, color: "#f97316", title: { EN: "Unlimited Movies", UZ: "Cheksiz filmlar", RU: "Безлимитные фильмы" }, desc: { EN: "Watch any movie without limits", UZ: "Istalgan filmni tomosha qiling", RU: "Смотрите любые фильмы" } },
    { icon: <FaBolt />, color: "#eab308", title: { EN: "No Ads", UZ: "Reklamasiz", RU: "Без рекламы" }, desc: { EN: "Uninterrupted viewing", UZ: "Reklamasiz tomosha", RU: "Без прерываний" } },
    { icon: <FaStar />, color: "#8b5cf6", title: { EN: "Premium Badge", UZ: "Premium nishoni", RU: "Премиум значок" }, desc: { EN: "Exclusive badge on your profile", UZ: "Profilingizda eksklyuziv belgi", RU: "Значок на профиле" } },
    { icon: <FaShieldAlt />, color: "#10b981", title: { EN: "Priority Support", UZ: "Ustuvor yordam", RU: "Приоритетная поддержка" }, desc: { EN: "Faster support response", UZ: "Tezroq yordam", RU: "Быстрый ответ" } },
    { icon: <FaInfinity />, color: "#3b82f6", title: { EN: "4K Quality", UZ: "4K sifat", RU: "4K качество" }, desc: { EN: "Watch in ultra HD 4K", UZ: "Ultra HD 4K sifatida", RU: "Смотрите в 4K" } },
];

export default function PremiumModal({ lang = "EN", onClose }) {
    const [selected, setSelected] = useState("quarterly");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // ── DEMO: Firestore ga premium saqlaymiz (real to'lovsiz) ──
    const handleSubscribe = async () => {
        const user = auth.currentUser;

        if (!user) {
            setError("Avval login qiling!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const plan = plans.find((p) => p.id === selected);

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + plan.days);

            await setDoc(
                doc(db, "users", user.uid),
                {
                    isPremium: true,
                    premiumPlan: selected,
                    premiumExpiresAt: Timestamp.fromDate(expiresAt),
                    premiumActivatedAt: Timestamp.now(),
                },
                { merge: true }
            );

            setSuccess(true);

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error(err);
            setError("Xatolik yuz berdi. Qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    };

    const plan = plans.find(p => p.id === selected);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
            onClick={onClose}>

            <div className="bg-base-100 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-[slideUp_.25s_ease]"
                style={{ maxHeight: "92vh", overflowY: "auto" }}
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-2">
                    <h2 className="text-lg font-bold">NeverX Premium</h2>
                    <button onClick={onClose} className="w-10 h-10 cursor-pointer rounded-full bg-base-200 flex items-center justify-center hover:bg-base-300 transition-all">
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Hero */}
                <div className="mx-4 rounded-2xl overflow-hidden relative h-52 sm:h-48"
                    style={{ background: "linear-gradient(135deg, #4FC3F7, #0288D1)" }}>
                    {[...Array(14)].map((_, i) => (
                        <div key={i} style={{
                            position: "absolute", width: 5, height: 5, borderRadius: "50%",
                            background: "rgba(255,255,255,0.9)",
                            top: `${Math.random() * 90}%`, left: `${Math.random() * 95}%`,
                            animation: `tw ${1 + Math.random() * 2}s ease-in-out infinite alternate`,
                        }} />
                    ))}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-full text-7xl text-yellow-400 drop-shadow-lg">
                        <FaCrown />
                    </div>

                    <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "linear-gradient(to top, rgba(2,136,209,0.9), transparent)",
                        padding: "16px 16px 12px", textAlign: "center",
                    }}>
                        <p className="flex items-center justify-center gap-2 font-bold">
                            <FaCrown /> NeverX Premium
                        </p>
                        <p className="text-white/80 text-xs mt-0.5">
                            {lang === "UZ" ? "Premium bilan yanada ko'proq imkoniyatlarga ega bo'ling"
                                : lang === "RU" ? "Получите больше возможностей с Premium"
                                    : "Get more features with NeverX Premium"}
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="px-4 mt-4 flex flex-col gap-3">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg text-white"
                                style={{ background: f.color }}>
                                {f.icon}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{f.title[lang] || f.title.EN}</p>
                                <p className="text-xs opacity-55 mt-1">{f.desc[lang] || f.desc.EN}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Plan selector */}
                <div className="px-4 mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {plans.map(p => (
                        <button key={p.id} onClick={() => setSelected(p.id)}
                            className="flex-1 rounded-2xl py-3 px-1 border-2 transition-all cursor-pointer relative text-center hover:scale-[1.02]"
                            style={{
                                borderColor: selected === p.id ? "#6366f1" : "rgba(255,255,255,0.1)",
                                background: selected === p.id ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
                            }}>
                            {p.popular && (
                                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                    {lang === "UZ" ? "Mashhur" : lang === "RU" ? "Хит" : "Popular"}
                                </span>
                            )}
                            <p className="font-bold text-sm">{p.label[lang] || p.label.EN}</p>
                            <p className="text-xs opacity-50 mt-0.5">{p.price} so'm</p>
                        </button>
                    ))}
                </div>

                {/* Error */}
                {error && <p className="text-red-500 text-xs text-center mt-3 px-4">{error}</p>}

                {/* Subscribe button */}
                <div className="px-4 py-5">
                    <button onClick={handleSubscribe} disabled={loading || success}
                        className="w-full py-4 cursor-pointer rounded-2xl font-bold text-white text-base transition-all duration-300
                         hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                        style={{
                            background: success
                                ? "linear-gradient(135deg, #10b981, #059669)"
                                : "linear-gradient(135deg, #6366f1, #a855f7)",
                            opacity: loading ? 0.7 : 1,
                        }}>
                        {loading
                            ? <span className="loading loading-spinner loading-sm" />
                            : success
                                ? <>✓ {lang === "UZ" ? "Muvaffaqiyatli aktivlashtirildi!" : lang === "RU" ? "Успешно активировано!" : "Successfully activated!"}</>
                                : <>
                                    <FaCrown size={16} />
                                    {lang === "UZ" ? `${plan.price} so'm evaziga obuna bo'lish`
                                        : lang === "RU" ? `Подписаться за ${plan.price} сум`
                                            : `Subscribe for ${plan.price} UZS`}
                                </>
                        }
                    </button>
                    <p className="text-center text-xs opacity-35 mt-2">
                        {lang === "UZ" ? "🔒 Demo rejimda — haqiqiy to'lov tez kunda amalga oshiriladi"
                            : lang === "RU" ? "🔒 В демонстрационном режиме — реальная оплата будет произведена через несколько дней."
                                : "🔒 In demo mode — real payment will be made in a few days"}
                    </p>
                </div>
            </div>

            <style>{`
@keyframes tw {
  from {
    opacity: 0.2;
    transform: scale(0.7);
  }

  to {
    opacity: 1;
    transform: scale(1.3);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
         `}</style>
        </div>
    );
}