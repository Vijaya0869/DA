import { Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import React from "react";
import "./index.scss";
import "container/styles";
import Forgotpassword from "./ForgotPassword/Forgotpassword";
import CreateAccount from "./CreateAccount/CreateAccount";
import ResetPassword from "./Resetpassword/resetPassword";
import ParseToken from "./ParseToken/parseToken";
import Confirmation from "./Confirmation/Confirmation";
export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/parseToken" element={<ParseToken />} />
      <Route path="/confirm" element={<Confirmation />} />

      
    </Routes>
  );
}
