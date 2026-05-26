# 🎬 NeverX App

A modern, multilingual movie & TV show platform built with React, Vite, and Firebase. Explore movies, watch trailers, save favorites, like and comment — all in one place.

🌐 **Live:** [movies-01-sandy.vercel.app](https://movies-01-sandy.vercel.app)

---

## ✨ Features

- 🌍 **5 languages** — English, Uzbek, Russian, German, Turkish
- 🎨 **5 themes** — Dark, Valentine, Cyberpunk, Retro, Aqua
- 🔐 **Firebase Auth** — Email/Password, Google, GitHub login
- 📱 **PWA** — Install as a mobile app, works offline
- 🎬 **Movie & TV browsing** — Popular, Horror, Series, Comedy, Doramma
- 🔍 **Search** — Real-time movie search via TMDB API
- ▶️ **Trailer player** — Built-in YouTube player with custom controls
- ❤️ **Likes** — Like movies, count shown on cards
- 🔖 **Save** — Save movies to your collection
- 💬 **Comments** — Leave comments on any movie
- 👁️ **View history** — Track which movies you've watched
- 🛡️ **Admin panel** — Manage users, views, saved movies
- ⬜ **Skeleton loading** — Smooth loading experience

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | React 18 |
| Build | Vite + PWA |
| Styling | Tailwind CSS + DaisyUI |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| API | TMDB API |
| Routing | React Router v6 |
| Icons | React Icons |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

**1. Clone:**
```bash
git clone https://github.com/xondamir011/movies_01.git
cd movies_01
```

**2. Install:**
```bash
npm install
```

**3. Firebase sozlash:**

`src/firebase/config.js` faylini oching va o'zingizning Firebase config'ingizni qo'ying:
```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  ...
};
```

**4. Start:**
```bash
npm run dev
```

**5. Build:**
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── admin/
│   └── AdminPanel.jsx       # Admin panel (users, views, movies)
├── auth/
│   ├── Login.jsx
│   └── Register.jsx
├── components/
│   ├── Drawer.jsx
│   ├── Footer.jsx
│   ├── MovieCard.jsx        # Trailer, like, save, comments
│   ├── Navbar.jsx
│   └── Search.jsx
├── firebase/
│   ├── config.js            # Firebase + Firestore init
│   ├── userService.js       # User CRUD
│   ├── viewService.js       # View tracking
│   └── movieService.js      # Saved movies
├── App.jsx
└── main.jsx
```

---

## 🔥 Firestore Structure

```
users/{uid}           → name, email, photo, lastSeen, role
views/{uid}/movies/   → movieId, title, watchedAt
savedMovies/          → title, poster, addedAt, addedBy
likes/{movieId}       → count, users/{uid}
comments/{movieId}/list/ → text, userName, createdAt
```

---

## 🛡️ Admin Panel

Admin panel faqat belgilangan UID uchun ochiladi:
- 👥 Foydalanuvchilar ro'yxati + kim qachon kirgan
- 👁️ Har bir foydalanuvchi ko'rgan filmlar
- 🎬 Saqlangan filmlar + o'chirish
- 📊 Dashboard statistika

---

## 📱 PWA

```bash
npm run build
npm run preview
```
Brauzerda install tugmasi chiqadi → telefonga ilova sifatida o'rnatiladi.

---

## 🌐 Browser Support

Chrome · Firefox · Safari · Edge (latest versions)

---

## 👤 Author

**Xondamir Madaliyev**
- Telegram: [@xondamir_mi](https://t.me/xondamir_mi)
- GitHub: [xondamir011](https://github.com/xondamir011)
- Email: xondamirmadaliyev79@gmail.com

---

## 📄 License

MIT License — open source, free to use.

---

*Last updated: May 2026*