import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/feed", label: "Feed" },
  { to: "/post", label: "Postar" },
  { to: "/profile", label: "Perfil" },
];

export default function NavBar() {
  const location = useLocation();
  // Avatar fake com inicial
  const user = JSON.parse(localStorage.getItem("user")) || { name: "U" };
  const initial = user.name ? user.name[0].toUpperCase() : "U";
  return (
    <nav className="bg-white shadow-md mb-8 sticky top-0 z-10 transition-all">
      <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-xl text-yellow-500 flex items-center gap-2">
          <span className="text-2xl">🍳</span> Breakfast Club
        </span>
        <div className="flex gap-2 items-center">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`font-medium px-4 py-2 rounded-full transition-all duration-200 text-sm shadow-sm hover:shadow-md hover:bg-yellow-100/80 ${location.pathname === item.to ? "bg-yellow-400 text-white shadow-md" : "text-gray-700"}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-4 w-9 h-9 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-yellow-700 text-lg shadow-inner border border-yellow-300">
            {initial}
          </div>
        </div>
      </div>
    </nav>
  );
} 