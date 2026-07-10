import React from "react";
import insights from "../assets/blogs/topnav.svg"; // Replace with your hero image
import "./landingPage.css";
import { FaChevronRight } from "react-icons/fa";
import House1 from "../assets/blogs/house1.png";
import House2 from "../assets/blogs/Rectangle 38.png";
import House3 from "../assets/blogs/house3.png";
import rightSide9 from "../assets/9thsection/rightside.svg";
import { useNavigate } from "react-router-dom";

const articles = [
  {
    id: 1,
    category: "Investment",
    title:
      "The Impact of Technology on the Workplace: How Technology is Changing",
    author: "Esther Howard",
    date: "August 6, 2024",
    image: House1,
  },
  {
    id: 2,
    category: "Wholesale",
    title:
      "The Impact of Technology on the Workplace: How Technology is Changing",
    author: "Wade Warren",
    date: "August 8, 2024",
    image: House2,
  },
  {
    id: 3,
    category: "Fractional Investment",
    title:
      "The Impact of Technology on the Workplace: How Technology is Changing",
    author: "Devon Lane",
    date: "August 11, 2024",
    image: House3,
  },
];

const InsightsHub = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-50">
      {/* Hero Section */}
      <div className=" w-full h-auto">
        <img
          src={insights}
          alt="Hero Background"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Latest Topics */}
      <div className="sect">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            Latest Topics
          </h3>
          <div className="flex gap-10 justify-start">
            <button className="bgMain text-white px-5 py-2 rounded-md font-semibold hover:opacity-90  flex items-center justify-betwee gap-2">
              See more <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
          {articles.map((article) => (
            <div
              key={article.id}
              className="min-w-[280px] max-w-[320px] flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => navigate(`/blog/${article.id}`)}
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full  object-cover"
              />
              <div className="p-4 ">
                <span className="text-xs text-main bg-[#E8E6F9] font-semibold px-2 py-1 rounded-md ">
                  {article.category}
                </span>
                <h4 className="text-lg font-semibold text-gray-800 py-4">
                  {article.title}
                </h4>
                <div className="text-sm text-gray-800 mt-2 flex items-center gap-4 py-2">
                  <span className="min-w-5 min-h-5 rounded-full bg-[#E8E6F9]"></span>
                  <p className="flex gap-2">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Most Viewed */}
      <div className="sect">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Most Viewed</h3>
          <div className="flex gap-10 justify-start">
            <button className="bgMain text-white px-5 py-2 rounded-md font-semibold hover:opacity-90  flex items-center justify-betwee gap-2">
              See more <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
          {articles.map((article) => (
            <div
              key={article.id}
              className="min-w-[280px] max-w-[320px] flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => navigate(`/blog/${article.id}`)}
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full  object-cover"
              />
              <div className="p-4 ">
                <span className="text-xs text-main bg-[#E8E6F9] font-semibold px-2 py-1 rounded-md ">
                  {article.category}
                </span>
                <h4 className="text-lg font-semibold text-gray-800 py-4">
                  {article.title}
                </h4>
                <div className="text-sm text-gray-800 mt-2 flex items-center gap-4 py-2">
                  <span className="min-w-5 min-h-5 rounded-full bg-[#E8E6F9]"></span>
                  <p className="flex gap-2">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* All Topics */}
      <div className="sect">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">All Topics</h3>
          <div className="flex gap-10 justify-start">
            <button className="bgMain text-white px-5 py-2 rounded-md font-semibold hover:opacity-90  flex items-center justify-betwee gap-2">
              See more <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
          {articles.map((article) => (
            <div
              key={article.id}
              className="min-w-[280px] max-w-[320px] flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => navigate(`/blog/${article.id}`)}
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full  object-cover"
              />
              <div className="p-4 ">
                <span className="text-xs text-main bg-[#E8E6F9] font-semibold px-2 py-1 rounded-md ">
                  {article.category}
                </span>
                <h4 className="text-lg font-semibold text-gray-800 py-4">
                  {article.title}
                </h4>
                <div className="text-sm text-gray-800 mt-2 flex items-center gap-4 py-2">
                  <span className="min-w-5 min-h-5 rounded-full bg-[#E8E6F9]"></span>
                  <p className="flex gap-2">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* nine */}
      <section className="sect p-10 bg-white py-20">
        <div className="bg-bgPurple border border-borderColor w-full flex items-center justify-between gap-10 rounded-md ">
          {/* Left Section */}
          <section className=" w-1/2  px-2  py-12 md:px-16 lg:px-24 ">
            <div className="p-6">
              <h2 className="textMain text-3xl font-bold  mb-4 leading-snug">
                Begin Your Real Estate <br /> Investment Journey <br /> today!
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Lorem ipsum dolor sit amet consectetur adipiscing elit, labore
                adth dolore magna aliqua
              </p>

              <div className="flex gap-10 justify-start">
                <button className="bgMain text-white px-5 py-2 rounded-md font-semibold hover:opacity-90  flex items-center justify-betwee gap-2">
                  Join Us Now <FaChevronRight />
                </button>
              </div>
            </div>
          </section>

          {/* Right Section */}
          <section className="w-1/2 gap-6 bg-bgPurple  flex items-center justify-center border-l border-bgPurple">
            <img src={rightSide9}></img>
          </section>
        </div>
      </section>
    </section>
  );
};

export default InsightsHub;
