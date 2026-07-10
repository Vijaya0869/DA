import React from "react";
import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./index.scss";
import "container/styles";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PropertyRoutes from "./PropertyRoutes";

const App = () => {
  return (
    <>
      {/* <Button>Welcome</Button>
  <InputField type='search'/> */}
      <Router>
        <Routes>
          <PropertyRoutes />
        </Routes>
        {/* <Routes>
            <Route path="/" element={<Login />} />
            </Routes> */}
      </Router>
    </>
  );
};
const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(<App />);
