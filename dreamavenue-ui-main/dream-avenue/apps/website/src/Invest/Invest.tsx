import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaSearch } from "react-icons/fa";
import InvestBG from "@/assets/invest/investbg.png";
import Invest1 from "@/assets/invest/investI1.png";
import Invest2 from "@/assets/invest/investI2.png";
import Invest3 from "@/assets/invest/investI3.png";
import Invest4 from "@/assets/invest/investI4.png";
import Invest5 from "@/assets/invest/investI5.png";

import Benifits1 from "@/assets/invest/benifits.png";
import Benifits2 from "@/assets/invest/benifits1.png";
import Benifits3 from "@/assets/invest/benifits2.png";
import Benifits4 from "@/assets/invest/benifits3.png";
import Benifits5 from "@/assets/invest/benifits4.png";
import Benifits6 from "@/assets/invest/benifits6.png";
import Lines from "@/assets/invest/lines.png";
import Housebenefit from "@/assets/invest/housebenefit.png";

import FP1 from "@/assets/invest/fp1.png";
import FP2 from "@/assets/invest/fp2.png";
import FP3 from "@/assets/invest/fp3.png";
import FP4 from "@/assets/invest/fp4.png";
import FP5 from "@/assets/invest/fp5.png";
import FP6 from "@/assets/invest/fp6.png";
import Popular from "@/assets/invest/popular.png";
import gsap from "gsap";
import InvesBtm from "@/assets/invest/invest_btm.png";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const propertyList = [
  {
    image: FP1, // Replace with actual image paths or null for fallback
    title: "14018 Arcadia Road NE, Albuquerque, NM 87123",
    rental: "24.9%",
    return: "26.9%",
    price: "$750.00",
    popular: true,
  },
  {
    image: FP2, // Replace with actual image paths or null for fallback
    title: "14018 Arcadia Road NE, Albuquerque, NM 87123",
    rental: "24.9%",
    return: "26.9%",
    price: "$750.00",
    popular: true,
  },
  {
    image: FP3, // Replace with actual image paths or null for fallback
    title: "14018 Arcadia Road NE, Albuquerque, NM 87123",
    rental: "24.9%",
    return: "26.9%",
    price: "$750.00",
    popular: true,
  },
  {
    image: FP4, // Replace with actual image paths or null for fallback
    title: "14018 Arcadia Road NE, Albuquerque, NM 87123",
    rental: "24.9%",
    return: "26.9%",
    price: "$750.00",
    popular: true,
  },
  {
    image: FP5, // Replace with actual image paths or null for fallback
    title: "14018 Arcadia Road NE, Albuquerque, NM 87123",
    rental: "24.9%",
    return: "26.9%",
    price: "$750.00",
    popular: true,
  },
  {
    image: FP6, // Replace with actual image paths or null for fallback
    title: "14018 Arcadia Road NE, Albuquerque, NM 87123",
    rental: "24.9%",
    return: "26.9%",
    price: "$750.00",
    popular: true,
  },
];

type Props = {};
// Property Card Component
const PropertyCard: React.FC<{
  image: string;
  title: string;
  rental: string;
  returnRate: string;
}> = ({ image, title, rental, returnRate }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold mt-4">{title}</h3>
      <div className="flex justify-between text-gray-600 text-sm mt-2">
        <p>
          Projected Rental <br />
          <span className="font-semibold text-indigo-600">{rental}</span>
        </p>
        <p>
          Projected Return <br />
          <span className="font-semibold text-indigo-600">{returnRate}</span>
        </p>
      </div>
    </div>
  );
};
const Invest = (props: Props) => {
  const navigate = useNavigate();
  const properties = [
    {
      image: Invest2, // Replace with actual image path
      title: "621 E Le Claire Rd Eldridge, IA 52748",
      rental: "24.9%",
      returnRate: "26.9%",
    },
    {
      image: Invest3,
      title: "14018 Arcadia Road NE, Albuquerque, NM 87123",
      rental: "24.9%",
      returnRate: "26.9%",
    },
    {
      image: Invest4,
      title: "3761 Jade Ave, Las Cruces, NM 88012",
      rental: "24.9%",
      returnRate: "26.9%",
    },
    {
      image: Invest5,
      title: "581 San Francisco St, Las Cruces, NM 88001",
      rental: "24.9%",
      returnRate: "26.9%",
    },
    // {
    //   image:Invest6,
    //   title: "27 Pillar Ln, Palm Coast, FL 32164",
    //   rental: "24.9%",
    //   returnRate: "26.9%",
    // },
    // {
    //   image:Invest7,
    //   title: "1580 Andover Dr, Dunedin, FL 34698",
    //   rental: "24.9%",
    //   returnRate: "26.9%",
    // },
  ];
  const benefits = [
    {
      icon: Benifits1,
      title: "Reduced Barrier to Entry for Investors",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim",
    },
    {
      icon: Benifits2,
      title: "Shared Ownership of Premium Properties",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim",
    },
    {
      icon: Benifits3,
      title: "Democratization of Investment Opportunities",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim",
    },
    {
      icon: Benifits4,
      title: "Cost–Efficient Way to Build Wealth",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim",
    },
    {
      icon: Benifits5,
      title: "Scalable Investment Strategy",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim",
    },
    {
      icon: Benifits6,
      title: "Reducing volatility by sharing risk",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit sed eiusmod labore magna aliqua enim",
    },
  ];
  const features = [
    {
      icon: Invest1,
      title: "Browse Investment–Ready Properties",
      description:
        "Discover curated listings with transparent rental and return projections. Pick properties that align with your goals.",
    },
    {
      icon: Invest2,
      title: "Invest What You Can",
      description:
        "Choose your investment amount. You can start with as little as $500—no need to buy the whole property.",
    },
    {
      icon: Invest3,
      title: "Become a Fractional Owner",
      description:
        "Own a share of the property, earn passive income, and build equity as the property appreciates.",
    },
    {
      icon: Invest4,
      title: "Track Your Performance",
      description:
        "Use your dashboard to monitor rental income, returns, and market value updates in real-time.",
    },
    {
      icon: Invest5,
      title: "Exit or Reinvest Easily",
      description:
        "When you’re ready, cash out your shares or reinvest in other opportunities. Flexibility and liquidity are built in.",
    },
  ];

  const bgRef = useRef(null);
  const cardRef = useRef(null);
  const dotsRef = useRef(null);
  const headerRef = useRef(null);
  const topCardRefs = useRef([]);
  const bottomCardRefs = useRef([]);
  const linesRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const benefitRefs = useRef([]);
  const headingRef = useRef(null);
  const filterRef = useRef(null);
  const cardsRef = useRef([]);
  const buttonRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bgRef.current,
        start: "top 80%",
      },
    });

    tl.from(bgRef.current, {
      scale: 1.1,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    })
      .from(
        cardRef.current,
        {
          x: 100,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .from(
        dotsRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.8"
      );
  }, []);
  useEffect(() => {
    // Heading animation
    gsap.from(headingRef.current, {
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 85%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
    // Left text content
    gsap.from(textRef.current, {
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 85%",
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });

    // Header animation
    gsap.from(headerRef.current, {
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 85%",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });

    // Top 3 cards animation
    gsap.from(topCardRefs.current, {
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
    });
    gsap.from(leftRef.current, {
      scrollTrigger: {
        trigger: leftRef.current,
        start: "top 85%",
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });

    gsap.from(rightRef.current, {
      scrollTrigger: {
        trigger: rightRef.current,
        start: "top 85%",
      },
      x: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
    // Bottom 2 cards animation
    gsap.from(bottomCardRefs.current, {
      scrollTrigger: {
        trigger: bottomCardRefs.current[0],
        start: "top 90%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
    });

    // Heading animation
    gsap.from(headingRef.current, {
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 85%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    // Filters + Search
    gsap.from(filterRef.current, {
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.2,
    });

    // Cards
    gsap.from(cardsRef.current, {
      scrollTrigger: {
        trigger: cardsRef.current[0],
        start: "top 90%",
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.2,
      ease: "power2.out",
    });

    // CTA Button
    gsap.from(buttonRef.current, {
      scrollTrigger: {
        trigger: buttonRef.current,
        start: "top 95%",
      },
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    });
  }, []);
  return (
    <div className="px-14">
      <section className="relative w-full h-[400px] pt-8">
        {/* Background Image */}
        <img
          src={InvestBG}
          ref={bgRef}
          alt="Property"
          className="w-full h-[400px] object-cover rounded-lg"
        />

        {/* Overlay Card */}
        <div
          ref={cardRef}
          className="absolute bg-white shadow-lg rounded-xl p-6 w-[300px] top-14 right-16 "
        >
          <h3 className="text-lg font-semibold text-gray-800">
            14018 Arcadia Road NE, <br />
            Albuquerque, NM 87123
          </h3>

          <div className="flex justify-between text-sm text-gray-500 mt-4">
            <div>
              <p>Projected Rental</p>
              <p className="font-bold text-black">24.9%</p>
            </div>
            <div>
              <p>Projected Return</p>
              <p className="font-bold text-black">26.9%</p>
            </div>
          </div>

          <button className="mt-6 bg-[#100A55] text-white py-2 px-4 rounded-md hover:bg-[#695df1] text-sm">
            Explore More
          </button>
        </div>

        {/* Dot indicators (optional) */}
        <div className="absolute bottom-4 left-4 flex space-x-2" ref={dotsRef}>
          <span className="w-2 h-2 bg-white rounded-full opacity-70"></span>
          <span className="w-2 h-2 bg-white rounded-full opacity-40"></span>
          <span className="w-2 h-2 bg-white rounded-full opacity-40"></span>
          <span className="w-2 h-2 bg-white rounded-full opacity-40"></span>
        </div>
      </section>
      <section className=" py-16 ">
        <div className="max-w-7xl  text-left ">
          <h2
            className="text-3xl sm:text-4xl font-bold text-indigo-900"
            ref={headerRef}
          >
            How Fractional Investment Works
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Investing in real estate is no longer reserved for the wealthy. At
            Dream Avenue, we simplify the process by offering fractional
            ownership—so you can invest in high-potential properties without the
            need to buy the entire home. Here’s how it works.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {features.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="bg-bgPurple rounded-lg  p-6 text-left border shadow-none  border-borderColor"
              ref={(el) => (topCardRefs.current[index] = el)}
            >
              <div className="mb-4">
                <img className="w-12 h-12" src={item.icon} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm font-medium text-gray-900">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.slice(3).map((item, index) => (
            <div
              key={index}
              className="bg-bgPurple rounded-lg  p-6 text-left border shadow-none  border-borderColor transition"
              ref={(el) => (bottomCardRefs.current[index] = el)}
            >
              <div className="mb-4">
                <img className="w-12 h-12" src={item.icon} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm font-medium text-gray-900">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#5A4D9D] py-16  relative">
        <div className="max-w-7xl mx-auto bg-[#f9f8ff] rounded-lg p-10 flex flex-row items-center justify-between">
          {/* Left Content */}
          <div
            className="md:w-1/2 space-y-6 text-center md:text-left"
            ref={textRef}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#100A55]">
              Benefits of Fractional <br /> Investment
            </h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod labore et dolore magna aliqua enim ad minim veniam.
            </p>
            <button
              onClick={() => navigate("/property")}
              className="bg-[#100A55] text-white font-medium py-2 px-5 rounded-md hover:bg-[#695df1] transition"
            >
              Browse Properties
            </button>
          </div>

          {/* Right Image */}
          <div className="mt-10 md:mt-0 flex justify-right" ref={imgRef}>
            <img
              src={Housebenefit}
              alt="Fractional Investment Illustration"
              className="max-w-sm w-full"
            />
          </div>
        </div>

        {/* Benefit Cards Grid */}
        <section className="bg-[#5A4D9D] py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-white">
            {benefits.map((item, index) => (
              <div
                key={index}
                className="text-center sm:text-left space-y-4"
                ref={(el) => (benefitRefs.current[index] = el)}
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <img src={item.icon} alt="benefits" className="w-12 h-12" />
                </div>
                <h3 className="font-bold text-2xl text-[#F0EFFB]">
                  {item.title}
                </h3>
                <p className="text-base text-[#D8D6F5] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
        <img
          ref={linesRef}
          src={Lines}
          alt="Lines"
          className="absolute bottom-0 opacity-50 w-full mt-10 z-50"
        />
      </section>

      <section className="bg-[#f7f6ff] py-16 ">
        <div className="mx-auto">
          {/* Heading */}
          <div className="text-center mb-10" ref={headingRef}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#100A55]">
              Featured Properties
            </h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod labore et dolore magna aliqua enim ad minim veniam.
            </p>
          </div>

          {/* Filters */}
          <div
            className="flex flex-row justify-between items-center gap-4 mb-10"
            ref={filterRef}
          >
            <div className="flex bg-[#E8E6FF] p-2">
              <button className="bg-[#FFFFFF] text-[#100A55] px-4 py-1 rounded-md font-medium">
                Cat1
              </button>
              <button className="bg-[#E8E6FF] text-gray-600 px-4 py-1 rounded-md">
                Cat2
              </button>
              <button className="bg-[#E8E6FF] text-gray-600 px-4 py-1 rounded-md">
                Cat3
              </button>
            </div>

            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyList.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                // ref={(el) => (cardsRef.current[index] = el)}
              >
                <div className="relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt="Property"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                      🖼️
                    </div>
                  )}
                  {item.popular && (
                    <img
                      src={Popular}
                      alt="Popular"
                      className="absolute  -bottom-6 -left- z-50"
                    />
                    // <span className="inline-block bg-[#5A4D9D] text-white text-xs px-2 py-1 rounded-full mb-2 absolute -bottom-4">
                    //   ★ POPULAR
                    // </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-[#100A55]">
                    {item.title}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <div>
                      <p className="text-gray-400">Projected Rental</p>
                      <p className="font-bold">{item.rental}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Projected Return</p>
                      <p className="font-bold">{item.return}</p>
                    </div>
                  </div>
                  <p className="text-green-600 font-bold text-lg">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center" ref={buttonRef}>
            <button
              onClick={() => navigate("/property")}
              className="bg-[#100A55] text-white font-medium py-2 px-5 rounded-md hover:bg-[#695df1] transition"
            >
              Browse Properties
            </button>
          </div>
        </div>
      </section>

      {/* nine */}
      <section className="sect p-10 bg-white py-20">
        <div className="bg-bgPurple border border-borderColor w-full flex items-center justify-between gap-10 rounded-md">
          {/* Left Section */}
          <section className="w-1/2 px-2 py-12 md:px-16 lg:px-24" ref={leftRef}>
            <div className="p-6">
              <h2 className="textMain text-3xl font-bold mb-4 leading-snug">
                Begin Your Real Estate <br /> Investment Journey <br /> today!
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Lorem ipsum dolor sit amet consectetur adipiscing elit, labore
                adth dolore magna aliqua
              </p>
              <div className="flex gap-10 justify-start">
                <button className="bgMain text-white px-5 py-2 rounded-md font-semibold hover:opacity-90 flex items-center gap-2">
                  Join Us Now <FaChevronRight />
                </button>
              </div>
            </div>
          </section>

          {/* Right Section */}
          <section
            className="w-1/2 gap-6 bg-bgPurple flex items-center justify-center border-l border-bgPurple"
            ref={rightRef}
          >
            <img src={InvesBtm} alt="Illustration" />
          </section>
        </div>
      </section>
    </div>
  );
};

export default Invest;
