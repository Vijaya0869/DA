import React from "react";
import "./landingPage.css";
import Profile from "../assets/blogs/details.svg";
import topImage from "../assets/blogs/details image.svg";
import RightImage from "../assets/blogs/bottomdetails.svg";
import { FaArrowRight, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import House1 from "../assets/blogs/house1.png";
import House2 from "../assets/blogs/Rectangle 38.png";
import House3 from "../assets/blogs/house3.png";
import rightSide9 from "../assets/9thsection/rightside.svg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// Define the Blog type for TypeScript
interface Blog {
  title: string;
  author: string;
  date: string;
  category: string;
  content: string;
  subheading: string;
}

const BlogDetails: React.FC = () => {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const quoteRef = useRef(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  sectionsRef.current = []; // initialize

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

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

  // Sample blog data (in a real app, this would come from props or a fetch)
  const blog: Blog = {
    title:
      "Invest in property today, secure your future wealth through real estate’s enduring and stable growth",
    author: "Esther Howard",
    date: "Aug 19, 2024",
    category: "Investment",
    subheading: "Consectetur adipiscing elit eusmod tempor incididunt",
    content: `

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

      Sed ut perspiciatis unde omnis iste natus

      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

      "Secure your future by investing in property today, benefiting from real estate’s steady, enduring growth."
    `,
  };

  useEffect(() => {
    // Fade in main block
    gsap.from(mainRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: mainRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    // Quote box animation
    gsap.from(quoteRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: quoteRef.current,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });

    // Animate each section
    sectionsRef.current.forEach((section, index) => {
      gsap.from(section, {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: index * 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, []);

  return (
    <div className="sect min-h-screen  bg-white">
      {/* Header Section */}
      <header className="p-4 flex items-center justify-start gap-4">
        <div className="flex items-center space-x-4">
          <img src={Profile} alt="Author" className="w-10 h-10 rounded-full" />
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm font-semibold text-gray-800">{blog.author}</p>
            <p className="text-xs text-gray-500">{blog.date}</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-600  bg-emerald-50  px-3 py-1 rounded-md">
          Latest
        </span>
        <span className="text-xs font-semibold text-main border border-main bg-bgPurple  px-3 py-1 rounded-md">
          {blog.category}
        </span>
      </header>
      {/* Main Content */}
      <main className=" mx-auto p-6 bg-white  rounded-lg " ref={mainRef}>
        <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>
        <img
          src={topImage}
          alt="Blog Header"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <div className="prose prose-lg text-gray-700">
          <h2 className="text-base font-semibold">{blog.subheading}</h2>
          {blog.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph.startsWith("") && paragraph.endsWith("") ? (
                <p>{paragraph.slice(2, -2)}</p>
              ) : paragraph.startsWith('"') && paragraph.endsWith('"') ? (
                <p className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
                  {paragraph.slice(1, -1)}
                </p>
              ) : (
                paragraph
              )}
            </p>
          ))}
        </div>
      </main>
      <div className="mx-auto p-6  px-4 py-8" ref={quoteRef}>
        <div className="bg-bgPurple text-[#111827] p-6 rounded-lg border-l-4 border-main shadow-sm">
          <p className="text-lg md:text-xl font-semibold">
            “
            <span className="font-semibold">
              Secure your future by investing in property today, benefiting from
              real estate's steady, enduring growth
            </span>
            ”
          </p>
        </div>
      </div>
      <div className="mx-auto px-4 py-8" ref={mainRef}>
        <div className="h-full rounded-xl flex  overflow-hidden">
          {/* Left Section */}
          <div className="w-full md:w-1/2 bg-iconBg text-white flex items-center">
            <div className="p-6">
              <p className="text-xl md:text-2xl font-semibold mb-6 leading-relaxed">
                Secure your financial future today
                <br />
                by investing in real estate, renowned for its stable growth
              </p>
              <button className="bg-white text-iconBg gap-2 flex items-center px-5 py-2 rounded-md font-semibold w-fit shadow hover:bg-gray-100 transition">
                See more <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="w-full md:w-1/2 bg-bgPurple flex items-center justify-center">
            <img
              src={RightImage}
              alt="investment visual"
              className="w-full max-w-xs h-auto object-contain"
            />
          </div>
        </div>
      </div>
      <div className=" mx-auto px-6 py-12 space-y-10" ref={mainRef}>
        {/* Section 1 */}
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-[#0F172A] mb-2">
            Nemo enim ipsam voluptatem
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
            magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
            quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
            adipisci velit, sed quia non numquam eius modi tempora incidunt.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-[#0F172A] mb-2">
            Lorem ipsum quia dolor sit amet
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        {/* Section 3 */}
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-[#0F172A] mb-2">
            Excepteur sint occaecat cupidatat
          </h3>
          <p className="text-gray-600 leading-relaxed">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga.
          </p>
        </div>
      </div>
      {/* Horizontal Scroll Carousel */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 text-center">
          Related Blogs
        </h3>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 items-center justify-center">
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
        <div className="flex gap-10 justify-center items-center">
          <button className="bgMain text-white px-5 py-2 rounded-md font-semibold hover:opacity-90  flex items-center justify-betwee gap-2">
            Load more <FaChevronRight />
          </button>
        </div>
      </div>

      {/* nine */}
      <section className="sect  bg-white py-20">
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
    </div>
  );
};

export default BlogDetails;
