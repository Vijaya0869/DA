import React, { useState } from "react";
import Home1 from "@/assets/images/home1.png";
import Home2 from "@/assets/images/home2.png";
import Home3 from "@/assets/images/home3.png";
import Home4 from "@/assets/images/home4.png";
import Home5 from "@/assets/images/home5.png";
import Home6 from "@/assets/images/home6.png";
import User from "@/assets/images/user.png";
import Line from "@/assets/images/bglines.png";

import {
  FaHome,
  FaSearch,
  FaBalanceScale,
  FaCalculator,
  FaChartBar,
  FaCogs,
  FaChartLine,
  FaMoneyBillWave,
  FaChartPie,
  FaDollarSign,
  FaHandHoldingUsd,
  FaBullhorn,
  FaTachometerAlt,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
} from "react-icons/fa";

type Props = {};
const FeatureCard: React.FC<{
  icon: JSX.Element;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCardVertical: React.FC<{ icon: JSX.Element; title: string }> = ({
  icon,
  title,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-purple-500 p-5 rounded-lg shadow-md">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
    </div>
  );
};

// Feature Item Component
const FeatureItem: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="border-l-4 border-blue-500 pl-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing sed do eiusmod
        labore.
      </p>
    </div>
  );
};

const MarkettingFeatureItem: React.FC<{
  icon: JSX.Element;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="flex items-center space-x-4 bg-white shadow-md p-4 rounded-lg">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <h3 className="text-gray-900 font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};
// Property Card Component
const PropertyCard: React.FC<{
  image: string;
  title: string;
  rental: string;
  returnRate: string;
  price: string;
}> = ({ image, title, rental, returnRate, price }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-sm">
      <img src={image} alt={title} className="w-full rounded-lg mb-4" />
      <div className="relative">
        <span className="absolute top-0 right-0 bg-orange-400 text-white px-3 py-1 text-xs rounded-full">
          Featured
        </span>
      </div>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <div className="flex justify-between text-gray-600 text-sm mt-2">
        <p>
          Projected Rental{" "}
          <span className="font-semibold text-green-600">{rental}</span>
        </p>
        <p>
          Projected Return{" "}
          <span className="font-semibold text-green-600">{returnRate}</span>
        </p>
      </div>
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 w-full">
        {price}
      </button>
    </div>
  );
};

// Investment Benefit Item
const InvestmentBenefit: React.FC<{ icon: JSX.Element; title: string }> = ({
  icon,
  title,
}) => {
  return (
    <div className="flex items-center space-x-4 bg-white shadow-md p-4 rounded-lg">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <h3 className="text-gray-900 font-semibold">{title}</h3>
    </div>
  );
};
const Home = (props: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is fractional investing in real estate?",
      answer:
        "Fractional investing in real estate is the process of sharing the ownership of a property among multiple investors, enabling them to invest in a property with a smaller financial commitment.",
    },
    {
      question: "How does Dreamavenue democratize real estate investment?",
      answer:
        "Dreamavenue provides fractional ownership opportunities, allowing small investors to participate in real estate markets without needing full property ownership.",
    },
    {
      question:
        "What are the benefits of real estate investing with Dreamavenue?",
      answer:
        "Benefits include lower financial risk, diversified portfolio opportunities, and access to premium real estate investments with minimal capital.",
    },
    {
      question: "Who are Dreamavenue's target investors?",
      answer:
        "Dreamavenue caters to both beginner and experienced investors looking for fractional ownership opportunities in real estate.",
    },
  ];

  return (
    <div className="pt-28">
      <section className="text-center py-16 px-4 bg-white">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900">
          Real Estate Analysis
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
          and <span className="text-gray-800">Investment</span>
        </h2>
        <p className="text-gray-500 mt-4 text-lg">
          Unlock a world of expert analysis & fractional ownership opportunities
        </p>
      </section>
      <div className="flex justify-center w-full">
        <img src={Home1} />
      </div>
      <section className="text-center py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Investment Analysis
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod labore et dolore magna aliqua enim ad minim veniam.
        </p>
      </section>
      <section className="py-16 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10">
        {/* Left Side - Feature Cards */}
        <div className="w-full md:w-1/2 space-y-6">
          <FeatureCard
            icon={<FaSearch className="text-green-500 w-8 h-8" />}
            title="Multiple Property Input"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim minim veniam."
          />
          <FeatureCard
            icon={<FaHome className="text-green-500 w-8 h-8" />}
            title="Recommendations of Best Investment Options"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim minim veniam."
          />
          <FeatureCard
            icon={<FaBalanceScale className="text-green-500 w-8 h-8" />}
            title="Compare Properties"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim minim veniam."
          />
        </div>

        {/* Right Side - Dashboard Mockup */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={Home2} // Replace with actual path
            alt="Investment Dashboard"
            className="w-full rounded-lg shadow-md"
          />
        </div>
      </section>

      <section className="py-16 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10">
        {/* Left Side - Analysis Dashboard */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={Home3} // Replace with actual path
            alt="Investment Dashboard"
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Right Side - Feature Cards */}
        <div className="w-full md:w-1/2 space-y-6">
          <FeatureCard
            icon={<FaChartBar className="text-green-500 w-8 h-8" />}
            title="Analysis Report"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim minim veniam."
          />
          <FeatureCard
            icon={<FaCogs className="text-green-500 w-8 h-8" />}
            title="Use of LLM/AI for Analysis"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim minim veniam."
          />
          <FeatureCard
            icon={<FaCalculator className="text-green-500 w-8 h-8" />}
            title="Generate ARV"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim minim veniam."
          />
        </div>
      </section>
      <section className="text-center py-16 px-6">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Investment Analysis Tools
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          Empower Your Investment
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Explore properties, analyze trends, and make informed decisions with
          DreamAvenue's data-driven investment analysis tools.
        </p>

        {/* Features */}
        <div className="mt-12 flex flex-col md:flex-row justify-center gap-12">
          <FeatureCardVertical
            icon={<FaChartLine className="text-white w-8 h-8" />}
            title="Data-Driven Decision Making"
          />
          <FeatureCardVertical
            icon={<FaChartBar className="text-white w-8 h-8" />}
            title="User-Friendly Charts & Graphs"
          />
          <FeatureCardVertical
            icon={<FaMoneyBillWave className="text-white w-8 h-8" />}
            title="Identify Investment Opportunities"
          />
        </div>
      </section>
      <section className="text-center py-16 px-6">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Wholesale Automation
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          Powerful automation for easy investment
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod labore et dolore magna aliqua enim ad minim veniam.
        </p>
      </section>
      <section className="py-16 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10">
        {/* Left Side - Feature List */}
        <div className="w-full md:w-1/2 space-y-6">
          <FeatureItem title="Data from MLS or public records" />
          <FeatureItem title="Generate Comps Data" />
          <FeatureItem title="Generate ARV" />
          <FeatureItem title="Property Package" />
          <FeatureItem title="Send Report for Marketing" />
        </div>

        {/* Right Side - Dashboard Mockup */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="bg-gradient-to-r from-green-200 to-blue-300 p-6 rounded-lg shadow-lg relative">
            <h2 className="text-white text-3xl font-bold">
              Effortless investing
            </h2>
            <p className="text-white text-lg">with advanced automation</p>
            <button className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg shadow-md hover:bg-gray-100">
              Explore More
            </button>
            <img
              src={Home4} // Replace with actual path
              alt="Investment Dashboard"
              className="w-full mt-6 rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>
      <section className="py-16 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10">
        {/* Left Side - Property Cards */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img src={Home5} alt="" className="h-[500px] w-[500px]" />
        </div>

        {/* Right Side - Investment Benefits */}
        <div className="w-full md:w-1/2">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Property Investment
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Fractional Investment
          </h2>
          <p className="text-gray-600 mt-4">
            Invest in real estate without traditional ownership barriers.
          </p>
          <div className="mt-6 space-y-4">
            <InvestmentBenefit
              icon={<FaDollarSign className="text-green-500 w-6 h-6" />}
              title="Lowers financial barriers"
            />
            <InvestmentBenefit
              icon={<FaChartPie className="text-green-500 w-6 h-6" />}
              title="Diversifies investment portfolio"
            />
            <InvestmentBenefit
              icon={<FaHandHoldingUsd className="text-green-500 w-6 h-6" />}
              title="Simplifies real estate investment"
            />
          </div>
        </div>
      </section>
      <section className="text-center py-16 px-6 bg-gray-50">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Advertisement Distribution
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          Marketing Automation
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod labore et dolore magna aliqua enim ad minim veniam.
        </p>
      </section>

      <section className="py-16 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10">
        {/* Left Side - Features */}
        <div className="w-full md:w-1/2 space-y-6">
          <MarkettingFeatureItem
            icon={<FaBullhorn className="text-blue-500 w-6 h-6" />}
            title="'Ads' through Social Media"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit, labore atdh dolore magna aliqua enim minim."
          />
          <MarkettingFeatureItem
            icon={<FaChartBar className="text-green-500 w-6 h-6" />}
            title="View the Responses"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed eiusmod labore atdh dolore magna aliqua enim minim."
          />
          <MarkettingFeatureItem
            icon={<FaTachometerAlt className="text-teal-500 w-6 h-6" />}
            title="Key Performance Indicators"
            description="Lorem ipsum dolor sit amet consectetur adipiscing elit, sed eiusmod labore atdh dolore magna aliqua enim minim."
          />
        </div>

        {/* Right Side - Pie Chart */}
        <div className="w-full md:w-1/2 flex justify-center items-center ">
          <img src={Home6} className="h-[350px]" />
        </div>
      </section>
      <section className="py-16 px-6 bg-[#24c188] text-white text-center relative">
        {/* Background pattern (Optional) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${Line})` }}
        ></div>

        {/* Testimonial Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-wide">Testimonial</p>
          <h2 className="text-2xl font-semibold mt-4">
            “Dreamavenue's user-friendly interface and tools made my investment
            decisions informed and seamless.”
          </h2>

          {/* User Info */}
          <div className="mt-6 flex flex-col items-center">
            <img
              src={User} // Replace with actual image path
              alt="User Testimonial"
              className="w-16 h-16 rounded-full border-4 border-white"
            />
            <p className="text-lg font-semibold mt-2">James B</p>
            <p className="text-sm text-gray-200">IT Consultant</p>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <FaChevronUp className="text-gray-600" />
                ) : (
                  <FaChevronDown className="text-gray-600" />
                )}
              </div>
              {openIndex === index && (
                <p className="text-gray-600 mt-2">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
