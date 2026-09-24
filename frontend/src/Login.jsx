import { useState } from "react";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://sistem-antrian-production-85e7.up.railway.app/api/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        sessionStorage.setItem("isLogin", "true");
        window.location.href = "/petugas";
      } else {
        alert("Username atau password salah.");
      }
    } catch (error) {
      alert("Tidak dapat terhubung ke server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login Petugas</h1>
        <p>Silakan masuk untuk mengelola antrean.</p>

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Masuk</button>
        </form>
      </div>
    </div>
  );
}

export default Login;