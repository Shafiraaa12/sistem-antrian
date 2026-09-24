import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import Login from "./Login.jsx";
import Petugas from "./Petugas.jsx";

let Halaman;

if (window.location.pathname === "/login") {
  Halaman = Login;
} else if (window.location.pathname === "/petugas") {
  if (sessionStorage.getItem("isLogin") === "true") {
    Halaman = Petugas;
  } else {
    window.location.href = "/login";
  }  
} else {
  Halaman = App;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Halaman />
  </StrictMode>
);