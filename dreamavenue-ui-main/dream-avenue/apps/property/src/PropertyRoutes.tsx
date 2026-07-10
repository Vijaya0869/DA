import { Routes, Route } from "react-router-dom";

import React from "react";
import "./index.scss";
import "container/styles";
import PropertyList from "./pages/property/PropertyList/PropertyList";
import AddProperty from "./pages/property/AddProperty/AddProperty";
import AddPropertyNew from "./pages/property/AddProperty/AddPropertyNew";
import ProfilePage from "./pages/property/ProfilePage/profilePage";
import PropertyDetails from "./pages/property/propertyDetails/propertyDetails";
import Searchproperty from "./pages/property/AddProperty/searchproperty";
import ComparePage from "./pages/property/Compare/ComparePage";

export default function PropertyRoutes() {
  return (
    <>
      <Route path="/property" element={<PropertyList />} />
      <Route path="/property/compare" element={<ComparePage />} />
      <Route path="/property/:propertyId" element={<PropertyDetails />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/new-property" element={<AddPropertyNew />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/search-property" element={<Searchproperty />} />
    </>
  );
}
