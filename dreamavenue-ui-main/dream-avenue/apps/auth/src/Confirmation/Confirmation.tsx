import React from "react";
import DashboardBg from "@/assets/images/login.jpg";
import { Button, Logo } from "container/components";
import { useNavigate } from "react-router-dom";
import LoginLeft from "@/assets/images/login_left.svg";
import RightSide from "@/assets/images/Rightside.svg";
import House from "@/assets/images/middle.png";
import { FaWaveSquare } from "react-icons/fa";
import sideContent from "@/assets/images/grp1.png";


const Confirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex md:flex-row overflow-hidden">
      <div
        className="w-full md:w-1/2 bg-gradient-to-br px-4 md:px-2 from-blue-100 via-white to-emerald-100 rounded-lg overflow-hidden py-10"
        style={{
          backgroundImage: `url(${LoginLeft})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center justify-center py-6">
          <Logo className="h-24" />
        </div>
        <h1 className="text-xl font-bold text-center mb-6 mt-14">
          Email Confirmation Successful
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Thank you for confirming your email address. Your account is now
          verified and ready to use.
        </p>

        <div className="text-center mt-4 flex justify-center items-center">
          <Button
            variant="primary"
            onClick={() => {
              navigate("/login");
            }}
          >
            Go to Login
          </Button>
        </div>

        <div className="text-center text-gray-500 mt-8">
          © Dream Avenue 2024
        </div>
      </div>
      <div className="w-full md:w-1/2 relative hidden md:flex items-center justify-center">
        {/* Background image */}
        <img
          src={RightSide}
          alt="dashboardbg"
          className="absolute inset-0 w-full h-full object-cover scale-[1.05] z-0"
        />

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col items-center text-white px-6">
          <img src={sideContent} alt="Overlay Content" className="" />
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
