import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/"); // 🔥 login bo‘lgandan keyin home
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-base-200 rounded-xl w-80">

        <h2 className="text-xl mb-4">Register</h2>

        <input
          className="input input-bordered w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input input-bordered w-full mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={register} className="btn btn-success w-full">
          Register
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-center mt-3 cursor-pointer"
        >
          Already have account? Login
        </p>

      </div>
    </div>
  );
}