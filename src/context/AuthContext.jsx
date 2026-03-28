import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // 🔥 USERNI KUZATISH (ENG MUHIM)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL
        }

        setUser(userData)
        localStorage.setItem("movies_user", JSON.stringify(userData))
      } else {
        setUser(null)
        localStorage.removeItem("movies_user")
      }
    })

    return () => unsubscribe()
  }, [])

  // 🔐 LOGIN
  const login = useCallback(async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  // 📝 REGISTER
  const register = useCallback(async (name, email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password)

    const userData = {
      uid: res.user.uid,
      name,
      email,
      avatar: null
    }

    setUser(userData)
    localStorage.setItem("movies_user", JSON.stringify(userData))
  }, [])

  // 🚪 LOGOUT
  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}