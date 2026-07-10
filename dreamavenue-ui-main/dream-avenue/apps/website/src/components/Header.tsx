import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { Button } from "container/components";
import DreamLogo from "../assets/images/finallogo.svg";

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Invest", path: "/invest" },
    { name: "Pricing", path: "/pricing" },
    { name: "Blogs", path: "/blogs" },
  ];

  return (
    <header className="w-full bg-white shadow-md  top-0 sticky z-50">
      <div className="container mx-auto px-10  flex items-center justify-between ">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={DreamLogo}
            alt="Dream Avenue Logo"
            className="h-14 w-auto py-2"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              {link.name === "Resources" ? (
                <>
                  <button
                    onClick={() => setIsResourcesOpen((prev) => !prev)}
                    className={`flex items-center font-medium transition-colors ${
                      activeSection === link.name.toLowerCase()
                        ? "text-main"
                        : "text-gray-700 hover:text-indigo-800"
                    }`}
                  >
                    {link.name}
                    <FaChevronDown className="ml-1 text-xs" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate(link.path)}
                  className={`font-medium ${
                    activeSection === link.name.toLowerCase()
                      ? "text-main border-b-2 border-main py-6"
                      : "text-gray-700 hover:text-main"
                  }`}
                >
                  {link.name}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium border border-main text-main rounded-md hover:bg-indigo-50 transition-colors"
          >
            Login
          </button>
          <Button
            variant="primary"
            onClick={() => navigate("/create-account")}
            className="px-4 py-2 text-sm font-medium bg-main text-white rounded-md hover:bg-indigo-800 transition-colors text-center"
          >
            Sign up
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-gray-700 hover:text-main"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.name === "Resources" ? (
                  <>
                    <button
                      onClick={() => setIsResourcesOpen((prev) => !prev)}
                      className={`flex items-center w-full py-2 text-left font-medium ${
                        activeSection === link.name.toLowerCase()
                          ? "text-main"
                          : "text-gray-700 hover:text-main"
                      }`}
                    >
                      {link.name}
                      <FaChevronDown className="ml-2 text-xs" />
                    </button>

                    {isResourcesOpen && (
                      <div className="pl-4">
                        {[
                          {
                            label: "Investment Guides",
                            path: "/resources#guides",
                          },
                          {
                            label: "Calculators",
                            path: "/resources#calculators",
                          },
                          { label: "FAQ", path: "/resources#faq" },
                          { label: "Support", path: "/resources#support" },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              navigate(item.path);
                              setIsResourcesOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 text-sm text-gray-700 hover:text-main"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate(link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-2 font-medium ${
                      activeSection === link.name.toLowerCase()
                        ? "text-main"
                        : "text-gray-700 hover:text-main"
                    }`}
                  >
                    {link.name}
                  </button>
                )}
              </div>
            ))}
            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium border border-main text-main rounded-md hover:bg-indigo-50 transition-colors"
              >
                Login
              </button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/create-account");
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium bg-main text-white rounded-md hover:bg-indigo-800 transition-colors"
              >
                Sign up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
