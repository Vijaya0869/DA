import React from "react";
import platformImg from "../assets/images/effective.jpeg";
import { FaBullhorn, FaCommentDots, FaChartLine } from "react-icons/fa";
const marketingFeatures = [
  {
    id: 1,
    icon: <FaBullhorn className="text-white text-2xl" />,
    title: "'Ads' through Social Media",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit, labore adth dolore magna aliqua",
  },
  {
    id: 2,
    icon: <FaCommentDots className="text-white text-2xl" />,
    title: "View the Responses",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit, labore adth dolore magna aliqua",
  },
  {
    id: 3,
    icon: <FaChartLine className="text-white text-2xl" />,
    title: "Key Performance Indicators",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit, labore adth dolore magna aliqua",
  },
];

const WholesaleAutomationSection = () => {
  return (
    <>
      <section className="py-16 px-6 relative bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
        {/* Top section with heading and description */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="text-indigo-600 uppercase font-medium tracking-wider mb-2">
            WHOLESALE AUTOMATION
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Powerful automation
            <br />
            for Easy Investment
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod labore et dolore magna aliqua enim ad minim veniam.
          </p>
        </div>

        {/* Purple showcase container */}
        <div className="max-w-6xl mx-auto relative">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 md:p-12 overflow-hidden">
            {/* Decorative lines in the background */}
            <div className="absolute left-0 top-0 w-full h-full opacity-10">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="absolute left-0 top-16 w-full h-1 border-b border-white"
                  style={{
                    transform: `rotate(${index * 3}deg)`,
                    transformOrigin: "left center",
                  }}
                ></div>
              ))}
            </div>

            {/* Content container */}
            <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">
              {/* Left text content */}
              <div className="text-white mb-8 lg:mb-0 lg:w-1/3">
                <h3 className="text-3xl font-bold mb-2">
                  Effortless investing
                </h3>
                <p className="text-indigo-100 text-lg mb-6">
                  with advanced automation
                </p>
                <button className="bg-white text-indigo-700 px-6 py-2 rounded-md font-medium hover:bg-opacity-90 transition-all">
                  Explore More
                </button>
              </div>

              {/* Right image content */}
              <div className="lg:w-2/3 transform translate-y-6">
                <img
                  src={platformImg}
                  alt="Investment Platform Interface"
                  className="w-full rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 relative bg-gradient-to-br from-indigo-50 to-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-50"></div>
        <div className="absolute top-40 right-10 w-8 h-8 bg-indigo-200 rounded-full opacity-50"></div>

        {/* Header section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="text-indigo-600 uppercase font-medium tracking-wider mb-2">
            ADVERTISEMENT DISTRIBUTION
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Marketing Automation
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod labore et dolore magna aliqua enim ad minim veniam.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {marketingFeatures.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon with decorative lines */}
              <div className="relative mb-6">
                {/* Decorative lines */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-10 group-hover:opacity-30 transition-opacity">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="0"
                      y1="10"
                      x2="40"
                      y2="10"
                      stroke="#5A67D8"
                      strokeWidth="2"
                    />
                    <line
                      x1="0"
                      y1="20"
                      x2="40"
                      y2="20"
                      stroke="#5A67D8"
                      strokeWidth="2"
                    />
                    <line
                      x1="0"
                      y1="30"
                      x2="40"
                      y2="30"
                      stroke="#5A67D8"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Icon */}
                <div className="bg-gradient-to-r from-[#5A39A9] to-[#8975D1] text-white p-4 w-16 h-16 rounded-lg flex items-center justify-center z-10 relative">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default WholesaleAutomationSection;
