// WebRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./DreamAvenue/landingPage";
import Invest from "./Invest/Invest";
import Pricing from "./DreamAvenue/Pricing.tsx"; // Add if you have a Pricing component
import Blogs from "./DreamAvenue/InsightsHub"; // Assuming InsightsHub is your Blogs section
import BlogDetails from "./DreamAvenue/BlogDetailPage";
// import Resources from "./DreamAvenue/Resources"; // Add if you have a Resources component

export default function WebRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
      </Route>
    </Routes>
  );
}
