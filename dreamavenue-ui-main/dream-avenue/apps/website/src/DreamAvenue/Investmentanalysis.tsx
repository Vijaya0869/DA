import React from "react";
import { FaArrowsAltH, FaChartBar, FaMoneyBillWave } from "react-icons/fa";
const InvestmentAnalysisSection = () => {
  return (
    <section className="py-16 px-6 bg-white relative overflow-hidden">
      {/* Background illustration */}
      <div className="absolute left-0 top-1/4 w-1/2 opacity-10">
        <svg
          viewBox="0 0 400 400"
          width="100%"
          height="100%"
          fill="none"
          stroke="#F8D49A"
          strokeWidth="1"
        >
          <path d="M200 50C200 50 100 100 100 200C100 300 200 350 200 350" />
          <circle cx="100" cy="200" r="80" />
          <path d="M270 150C270 150 320 180 320 250C320 320 270 350 270 350" />
          <rect x="240" y="190" width="60" height="100" />
          <path d="M50 270L150 270L150 370" />
        </svg>
      </div>

      <div className="container mx-auto relative z-10 space-y-32">
        {/* Top section */}
        <div className="text-center max-w-3xl mx-auto ">
          <h3 className="text-indigo-600 font-medium tracking-wide uppercase mb-6">
            INVESTMENT ANALYSIS TOOLS
          </h3>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            One customer platform.
            <br />
            Everyone's business.
          </h2>

          <p className="text-gray-600 text-lg">
            Explore properties, analyze trends, and make informed decisions
            <br />
            with Dreamavenue's data-driven investment analysis tools
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-32">
          {/* Feature 1 */}
          <div className="flex items-center shadow-sm p-4 rounded-lg">
            <div className="bg-gradient-to-r from-[#5A39A9] to-[#8975D1] text-white p-4 rounded-lg mr-4">
              <FaArrowsAltH />
            </div>
            <div>
              <h3 className="text-base  text-gray-800 mb-1">
                Data-Driven Decision <br></br>Making
              </h3>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center shadow-sm p-4 rounded-lg">
            <div className="bg-gradient-to-r from-[#5A39A9] to-[#8975D1] text-white p-4 rounded-lg mr-4">
              <FaChartBar />
            </div>
            <div>
              <h3 className="text-base  text-gray-800 mb-1">
                User-Friendly Charts & <br></br>Graphs
              </h3>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center shadow-sm p-4 rounded-lg">
            <div className="bg-gradient-to-r from-[#5A39A9] to-[#8975D1] text-white p-4 rounded-lg mr-4">
              <FaMoneyBillWave />
            </div>
            <div>
              <h3 className="text-base  text-gray-800 mb-1">
                Identify Investment<br></br> Opportunities
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentAnalysisSection;
