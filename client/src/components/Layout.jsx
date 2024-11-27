import React from "react";
import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>©️ me 2024</footer>
    </div>
  );
}

export default Layout;
