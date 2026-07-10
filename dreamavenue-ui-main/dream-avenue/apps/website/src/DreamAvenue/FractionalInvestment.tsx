import React from "react";
import { FaMoneyBillWave, FaChartPie, FaHome } from "react-icons/fa";
import sideImg from "../assets/images/card.jpeg"
const FractionalInvestmentSection = () => {
  // Sample property card data
  const propertyCards = [
    {
      id: 1,
      image: "/path-to-house-image.jpg", // Replace with actual path
      address: "621 E Le Claire Rd",
      location: "IA 52748",
      projectedRental: "24.9%",
      amount: "$750.00",
    },
    {
      id: 2,
      image: "/path-to-apartment-image.jpg", // Replace with actual path
      address: "1401A Arcadia Road NE",
      location: "Albuquerque, NM 87123",
      projectedRental: "24.9%",
      projectedReturn: "28.9%",
      amount: "$750.00",
      featured: true,
    },
  ];

  // Feature benefits
  const benefits = [
    {
      id: 1,
      icon: <FaMoneyBillWave className="text-white text-lg" />,
      text: "Lowers financial barriers",
    },
    {
      id: 2,
      icon: <FaChartPie className="text-white text-lg" />,
      text: "Diversifies investment portfolio",
    },
    {
      id: 3,
      icon: <FaHome className="text-white text-lg" />,
      text: "Simplifies real estate investment",
    },
  ];

  return (
    <section className="py-16 px-6 overflow-hidden relative bg-gradient-to-br from-white to-gray-50">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-8 h-8 bg-yellow-200 rounded-full opacity-50"></div>
      <div className="absolute bottom-20 left-10 w-10 h-10 bg-purple-100 rounded-full opacity-50"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-10 items-center w-full">
          {/* Left content section */}
          <div className="w-1/2 lg:w-1/2">
            <div className="text-indigo-600 uppercase font-medium tracking-wider mb-2">
              PROPERTY INVESTMENT
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Fractional Investment
            </h2>
            <p className="text-gray-600 mb-2">
              Invest in real estate without traditional ownership barriers
            </p>
            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod labore et dolore magna aliqua enim ad minim
              veniam. Lorem ipsum dolor sit amet, consectetur adipiscing
            </p>
            
            {/* Benefits list */}
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-[#5A39A9] to-[#8975D1] text-white p-3 rounded-lg">
                    {benefit.icon}
                  </div>
                  <span className="text-gray-700">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right property cards section */}
          <div className="w-1/2 lg:w-1/2 ">
            {/* Property cards with overlap effect */}
           <img src={sideImg} className="w-full h-auto"></img>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FractionalInvestmentSection;