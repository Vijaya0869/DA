import { useState } from "react";
import { FiChevronDown, FiChevronRight, FiMenu, FiX } from "react-icons/fi";
import { FaHome, FaChartPie, FaBullhorn, FaFileAlt, FaCogs } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward, IoIosStats } from "react-icons/io";
import React from "react";
import Logo from "../Logo";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Explore from '@/assets/images/explore.svg';
import ExploreN from '@/assets/images/explore_n.svg';

const menuItems = [
  { name: "Explore Property", icon: ExploreN, hIcon:Explore, path:'/property',selected: true },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
 const navigate =useNavigate();
  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className={`relative h-screen overflow-hidden bg-white shadow-lg ${isCollapsed ? "w-24" : "w-72"} transition-all duration-300 p-4`}>
      {/* Toggle Button */}
      <div className={`p-4 flex  items-center ${isCollapsed ? "justify-center" : "justify-between"}`} onClick={()=>{
        navigate('/property')
      }}>

        <h2 className="text-xl font-bold text-gray-800"><Logo small={isCollapsed} className={`${isCollapsed ?'w-24':''}`}/></h2>        
   
      </div>

      <ul className="space-y-2 overflow-auto h-1/2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <button
              className={`group relative w-full flex items-center   p-3 text-white hover:bg-[#f0effb] hover:text-white  rounded-lg transition ${isCollapsed ? "justify-center" : "justify-start"}`}
              onClick={() => {
                item.subItems && toggleMenu(item.name)
                item.path && navigate(item.path??"")
              
              }}
            >
                <span className="flex items-center space-x-2">
                <div>
                <img
                  src={item.hIcon}
                  alt={item.hIcon}
                  className={`h-6 w-6 group-hover:block ${item.selected ? '!block' : 'hidden'}  `}
                />
                <img
                  src={item.icon}
                  alt={item.icon}
                  className={`h-6 w-6 group-hover:hidden ${item.selected ? 'hidden' : 'block'}`}
                />
              </div>
                {!isCollapsed && <span className={`text-[#9f9dbb] text-start group-hover:text-[#100a55] ${item.selected ? 'text-[#100a55]' : ''} tracking-wide`}>{item.name}</span>}
                </span>
              {item.subItems && !isCollapsed && (
                <span>{expandedMenus[item.name] ? <FiChevronDown /> : <FiChevronRight />}</span>
              )}
            </button>
            {!isCollapsed && item.subItems && expandedMenus[item.name] && (
              <ul className="ml-6 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <li key={subItem} className="text-white text-sm p-2 hover:bg-bgMenuHover hover:text-white rounded-lg">
                    {subItem}
                  </li>
                ))}
              </ul>
            )}
            
          </li>
        ))}
      </ul>
      <button onClick={() => setIsCollapsed(!isCollapsed)} className={ `absolute ${isCollapsed ? 'bottom-4 right-6':'bottom-4 right-4'} text-[#9f9dbb]`}>
          {isCollapsed ? <IoIosArrowForward  size={24} /> : <IoIosArrowBack  size={24} />}
        </button>
    </div>
  );
};

export default Sidebar;
