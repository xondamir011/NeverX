# 🎬 Movies App

A modern, multilingual movie application built with React, Vite, and Firebase. Users can explore movies, manage favorites, and enjoy a seamless experience with theme customization.

## Features

- 🌍 **Multilingual Support** - English, Uzbek, Russian, German, Turkish
- 🎨 **Theme Customization** - Dark, Valentine, Cyberpunk, Retro, Aqua themes
- 🔐 **Firebase Authentication** - Secure user login and registration
- 📱 **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- 🎭 **Movie Browsing** - Browse and search movies
- ❤️ **Favorites** - Save your favorite movies
- 👤 **User Profile** - Personalized user experience

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + DaisyUI
- **Authentication:** Firebase Auth
- **Routing:** React Router
- **Icons:** React Icons, React Feather
- **State Management:** React Hooks

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone "https://github.com/xondamir011/movies_01.git"
cd Movies
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` file and add Firebase config:
```
VITE_FIREBASE_API_KEY="AIzaSyDnJCaACKYimBbKX8Hsb0j5Cmgt958zrPA"
VITE_FIREBASE_AUTH_DOMAIN="mongodb-af2aa.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="mongodb-af2aa"
VITE_FIREBASE_STORAGE_BUCKET="mongodb-af2aa.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="753459863047"
VITE_FIREBASE_APP_ID="1:753459863047:web:8736ac7c2978ed375814a2"
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Project Structure

```
src/
├── components/      # React components
├── firebase/        # Firebase configuration
├── pages/           # Page components
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Features in Detail

### Multi-language Support
Switch between 5 languages with flag icons. Language preference is saved to localStorage.

### Theme System
Choose from 5 different themes. Your theme preference is saved locally.

### Authentication
- Sign up with email and password
- Login with existing account
- Logout functionality
- Google authentication support

### Responsive Navigation
- Mobile-friendly drawer menu
- Language selector
- Theme switcher
- User profile section

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

This project is open source and available under the MIT License.

## Author

Created by Xondamir Madaliyev

---

**Last Updated:** March 18, 2026