// Layout/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../index.css"; // Ensure your styles are imported
const Layout = () => {
  const location = useLocation();

  // Determine the active section based on the current route
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === "/" || path === "/home") return "home";
    if (path === "/invest") return "invest";
    if (path === "/pricing") return "pricing";
    if (path === "/blogs") return "blogs";
    if (path.startsWith("/blog")) return "blogs";
    return "home"; // Default to home
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white w-full">
      <Header activeSection={getActiveSection()} />
      <div className="w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
