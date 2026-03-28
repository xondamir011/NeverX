import { useState } from "react";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Logged in with Google!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      alert("Logged in with GitHub!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-gray-800 text-white rounded mt-36">
      <h2 className="text-2xl mb-4 text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 mb-2 rounded text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-2 mb-4 rounded text-black"
      />
      <button onClick={handleEmailLogin} className="w-full mb-2 bg-purple-500 p-2 rounded">
        Login
      </button>

      <hr className="my-4 border-gray-600" />

      <button onClick={handleGoogleLogin} className="w-full mb-2 bg-red-500 p-2 rounded">
        Login with Google
      </button>
      <button onClick={handleGithubLogin} className="w-full bg-gray-700 p-2 rounded">
        Login with GitHub
      </button>
    </div>
  );
};

export default Login;