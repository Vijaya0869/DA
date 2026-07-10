import React from "react";
import { FaFileAlt, FaRobot, FaFileInvoiceDollar } from "react-icons/fa";

const FeatureCardsSection = () => {
  // Feature cards data
  const featureCards = [
    {
      id: 1,
      icon: <FaFileAlt className="text-white text-2xl" />,
      title: "Analysis Report",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim minim veniam",
    },
    {
      id: 2,
      icon: <FaRobot className="text-white text-2xl" />,
      title: "Use of LLM/AI for Analysis",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim minim veniam",
    },
    {
      id: 3,
      icon: <FaFileInvoiceDollar className="text-white text-2xl" />,
      title: "Generate ARV",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim minim veniam",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-8 w-8 h-8 bg-amber-200 rounded-full opacity-50"></div>
      <div className="absolute bottom-40 left-1/4 w-6 h-6 bg-purple-200 rounded-full opacity-50"></div>
      <div className="absolute top-40 left-1/4 w-10 h-10 bg-amber-200 rounded-full opacity-50"></div>
      <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-purple-200 rounded-full opacity-50"></div>

      {/* Background pattern */}
      <div className="absolute right-0 bottom-0 w-full h-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          xmlns="http://www.w3.org/2000/svg"
          opacity="0.05"
        >
          <path
            d="M400,200 C500,100 600,200 700,100"
            stroke="#6366F1"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M100,300 C200,200 300,300 400,200"
            stroke="#6366F1"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M300,500 C400,400 500,500 600,400"
            stroke="#6366F1"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="200"
            cy="200"
            r="50"
            stroke="#6366F1"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="600"
            cy="300"
            r="80"
            stroke="#6366F1"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Real Estate Analytics
          <br />
          Features
        </h2>
        <p className="text-gray-600">
          Our platform provides comprehensive tools for real estate investment analysis
          <br />
          to help you make data-driven decisions.
        </p>
      </div>

      {/* Feature cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {featureCards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden">
            {/* Decorative elements for each card */}
            <div className="absolute top-2 right-2 w-4 h-4 bg-amber-200 rounded-full opacity-30"></div>
            <div className="absolute bottom-4 right-10 w-6 h-6 bg-purple-200 rounded-full opacity-30"></div>
            
            {/* Icon */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-[#5A39A9] to-[#8975D1] w-16 h-16 rounded-lg flex items-center justify-center mb-2">
                {card.icon}
              </div>
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{card.title}</h3>
            <p className="text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCardsSection;