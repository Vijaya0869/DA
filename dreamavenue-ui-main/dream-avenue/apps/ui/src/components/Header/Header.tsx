import React, { useEffect } from "react";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const userObj = localStorage.getItem("user");
    return userObj ? JSON.parse(userObj) : null;
  });

  // Add this effect to listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const updatedUserObj = localStorage.getItem("user");
      if (updatedUserObj) {
        setUser(JSON.parse(updatedUserObj));
      }
    };

    window.addEventListener("userProfileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
    };
  }, []);

  return (
    <div className="flex justify-between items-center p-4 rounded-lg shadow-sm bg-[#f7f7fd] ">
      {/* Search Bar - searches properties by address */}
      <div className="relative w-1/3">
        <FiSearch className="absolute left-3 top-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search properties"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              navigate(`/property?search=${encodeURIComponent(query.trim())}`);
            }
          }}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-8">
        {/* Notification Icon */}
        <div className="relative cursor-pointer">
          <FiBell size={24} fill="#000000" className="text-gray-600 text-xl" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        </div>

        {/* Profile Picture & Dropdown */}
        <div className="relative">
          {/* <img
            src={
              user?.picture ||
              "https://dinningtonhigh.co.uk/wp-content/uploads/2024/06/neutral-avatar-square.jpeg"
            }
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          /> */}
   <img
            src={
             "https://th.bing.com/th/id/OIP.ByNkifVPWm-R7eYaW4BdpgHaHa?w=191&h=191&c=7&r=0&o=5&pid=1.7"
            }
            alt="User"
            className="w-12 h-12 rounded-md cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="z-10 absolute right-0 mt-2 w-64 overflow-hidden bg-white shadow-md rounded-lg p-3">
              <div
                className="flex items-center gap-3 border-b pb-3 cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
              >
                {/* <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                /> */}
                <img
                  src={
                    user?.picture ||
                    "https://dinningtonhigh.co.uk/wp-content/uploads/2024/06/neutral-avatar-square.jpeg"
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => setDropdownOpen(false)}
                />
                <div>
                  <p className="text-gray-800 font-semibold">{`${user?.firstName} ${user?.lastName}`}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                className="flex items-center w-full mt-2 px-3 py-2 text-red-500 hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  navigate("/login");
                }}
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
