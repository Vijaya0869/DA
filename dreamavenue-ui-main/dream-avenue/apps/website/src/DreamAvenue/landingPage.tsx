// DreamAvenue/LandingPage.jsx
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Yellow from "../assets/hero/yellow.svg";
import LoginLeft from "../assets/hero/BackgroundLeft.svg";
import Card1 from "../assets/hero/card1.svg";
import Card2 from "../assets/hero/card2.svg";
import BgRight from "../assets/hero/BGrIGHT.svg";
import rightNew from "../assets/hero/righnew.png";
import propertyIcon from "../assets/2ndsection/multiproperty.svg";
import compareIcon from "../assets/2ndsection/compareproperty.svg";
import ReccomendIcon from "../assets/2ndsection/recommendation.svg";
import ReportIcon from "../assets/2ndsection/analysisreport.svg";
import AiIcon from "../assets/2ndsection/ai.svg";
import ProfitableSnapIcon from "../assets/2ndsection/profitability.svg";
import "./landingPage.css";
import BulbBg from "../assets/2ndsection/bttmbulb.svg";
import ExplorePropertyIcon from "../assets/3rdsection/exploreProperty.svg";
import PropertyScreenIcon from "../assets/3rdsection/propertyScreenIcon.svg";
import InstantRankingIcomn from "../assets/3rdsection/InstantranIcon.svg";
import SmartPort from "../assets/3rdsection/smartportfolioIcon.svg";
import MarketingReportsIcon from "../assets/3rdsection/marketingIcon.svg";
import DataDrivenIcon from "../assets/4thsection/datadriven.svg";
import ChartsGraphsIcon from "../assets/4thsection/chartsGraphs.svg";
import Ilustration from "../assets/2ndsection/Illustration.svg";
import InvestmentOpportunitiesIcon from "../assets/4thsection/investment.svg";
import Background4 from "../assets/4thsection/background.svg";
import threesplit from "../assets/4thsection/Group 14079.png";
import side5img from "../assets/5thsection/side5img.svg";
import {
  FaArrowRight,
  FaChevronDown,
  FaChevronRight,
  FaChevronUp,
} from "react-icons/fa";
import campaignsIcon from "../assets/6thsection/campainsIcon.svg";
import performanceIcon from "../assets/6thsection/performanceIcon.svg";
import resIcon from "../assets/6thsection/ResIcon.svg";
import testYellow from "../assets/7thsection/yellow.svg";
import test1 from "../assets/7thsection/test1.svg";
import QuestionIcon from "../assets/7thsection/QuestionMarkIcon.svg";
import HouseDollarIcon from "../assets/5thsection/OBJECTS.svg";
import rightSide9 from "../assets/9thsection/rightside.svg";
import RightHero from "../assets/hero/newsideBg.svg";
import YellowLine from "../assets/animation/yellowLine";
import rightoneNav from "../assets/3rdsection/rightsidenav/one.png";
import righttwoNav from "../assets/3rdsection/rightsidenav/two.png";
import rightthreeNav from "../assets/3rdsection/rightsidenav/three.png";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowConnector from "../components/ArrowConnector";

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ icon, title, desc, refCallback }) => {
  return (
    <div
      ref={refCallback}
      className="p-6 rounded-lg transition-shadow bg-white  opacity-0 transform translate-y-8"
    >
      <img src={icon} className=" mb-4"></img>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed flex-wrap">{desc}</p>
    </div>
  );
};

const faqs = [
  {
    question: "What is fractional investing in real estate?",
    answer:
      "Fractional investing in real estate is the process of sharing the ownership of a property among multiple investors, enabling them to invest in a property with a smaller financial commitment.",
  },
  {
    question: "How does Dreamavenue democratize real estate investment?",
    answer: "",
  },
  {
    question:
      "What are the benefits of real estate investing with Dreamavenue?",
    answer: "",
  },
  {
    question: "Who are Dreamavenue's target investors?",
    answer: "",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const section4FeaturesRef = useRef(null);
  const rightImageRef = useRef(null);
  const featureRefs = useRef([]);

  // Hero section refs
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const statsRef = useRef(null);
  const imageRef = useRef(null);
  const yellowLineRef = useRef(null);

  // Section 2 refs
  const section2LeftRef = useRef(null);
  const illustrationRef = useRef(null);
  const featureCardsRef = useRef([]);

  // Section 3 refs
  const section3HeaderRef = useRef(null);
  const section3FeaturesRef = useRef(null);
  const section3ImageRef = useRef(null);

  // Section 4 refs
  const section4HeaderRef = useRef(null);
  const section4ItemsRef = useRef([]);

  // Section 5 refs
  const section5ImageRef = useRef(null);
  const section5ContentRef = useRef(null);

  // Section 6 refs
  const section6HeaderRef = useRef(null);
  const section6CardsRef = useRef([]);

  // Section 7 refs
  const section7HeaderRef = useRef(null);
  const section7TestimonialRef = useRef(null);
  const section7ImagesRef = useRef([]);

  // Section 8 refs
  const section8HeaderRef = useRef(null);
  const section8FaqsRef = useRef(null);

  // Section 9 refs
  const section9ContentRef = useRef(null);
  const section9ImageRef = useRef(null);

  // Reset refs arrays
  featureCardsRef.current = [];
  section4ItemsRef.current = [];
  section6CardsRef.current = [];
  section7ImagesRef.current = [];

  const addToFeatureRefs = (el) => {
    if (el && !featureCardsRef.current.includes(el)) {
      featureCardsRef.current.push(el);
    }
  };

const centerLine = useRef();
  const horizontalLine = useRef();
  const leftLine = useRef();
  const rightLine = useRef();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power2.out" } });

    tl.fromTo(centerLine.current, { scaleY: 0 }, { scaleY: 1 })
      .fromTo(horizontalLine.current, { scaleX: 0 }, { scaleX: 1 }, "-=0.2")
      .fromTo(leftLine.current, { scaleY: 0 }, { scaleY: 1 }, "-=0.2")
      .fromTo(rightLine.current, { scaleY: 0 }, { scaleY: 1 }, "-=0.6");
  }, []);

  const addToSection6Refs = (el) => {
    if (el && !section6CardsRef.current.includes(el)) {
      section6CardsRef.current.push(el);
    }
  };

  const addToSection7Refs = (el) => {
    if (el && !section7ImagesRef.current.includes(el)) {
      section7ImagesRef.current.push(el);
    }
  };

  useEffect(() => {
    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Hero Section Animation (on load)
    const heroTl = gsap.timeline({ delay: 0.5 });
    heroTl
      .from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
      })
      .from(
        yellowLineRef.current,
        {
          opacity: 0,
          scaleX: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .from(
        paragraphRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .from(
        statsRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .from(
        imageRef.current,
        {
          opacity: 0,
          x: 50,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.8"
      );

    // Section 2 Animation
    gsap.set(
      [
        section2LeftRef.current,
        illustrationRef.current,
        ...featureCardsRef.current,
      ],
      {
        opacity: 0,
        y: 50,
      }
    );

    gsap.to(section2LeftRef.current, {
      scrollTrigger: {
        trigger: section2LeftRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(illustrationRef.current, {
      scrollTrigger: {
        trigger: illustrationRef.current,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    featureCardsRef.current.forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power2.out",
      });
    });

    // Section 3 Animation
    gsap.set(
      [
        section3HeaderRef.current,
        section3FeaturesRef.current,
        section3ImageRef.current,
      ],
      {
        opacity: 0,
        y: 50,
      }
    );

    gsap.to(section3HeaderRef.current, {
      scrollTrigger: {
        trigger: section3HeaderRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(section3FeaturesRef.current, {
      scrollTrigger: {
        trigger: section3FeaturesRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out",
    });

    gsap.to(section3ImageRef.current, {
      scrollTrigger: {
        trigger: section3ImageRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.4,
      ease: "power2.out",
    });

    // Section 4 Animation
    gsap.set([section4HeaderRef.current, ...section4ItemsRef.current], {
      opacity: 0,
      y: 50,
    });

    gsap.to(section4HeaderRef.current, {
      scrollTrigger: {
        trigger: section4HeaderRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    section4ItemsRef.current.forEach((item, i) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.2,
        ease: "power2.out",
      });
    });

    // Section 5 Animation
    gsap.set([section5ImageRef.current, section5ContentRef.current], {
      opacity: 0,
    });

    gsap.set(section5ImageRef.current, { x: -50 });
    gsap.set(section5ContentRef.current, { x: 50 });

    gsap.to(section5ImageRef.current, {
      scrollTrigger: {
        trigger: section5ImageRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(section5ContentRef.current, {
      scrollTrigger: {
        trigger: section5ContentRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      x: 0,
      duration: 1,
      delay: 0.2,
      ease: "power2.out",
    });

    // Section 6 Animation
    gsap.set([section6HeaderRef.current, ...section6CardsRef.current], {
      opacity: 0,
      y: 50,
    });

    gsap.to(section6HeaderRef.current, {
      scrollTrigger: {
        trigger: section6HeaderRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    section6CardsRef.current.forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.2,
        ease: "power2.out",
      });
    });

    // Section 7 Animation
    gsap.set(
      [
        section7HeaderRef.current,
        section7TestimonialRef.current,
        ...section7ImagesRef.current,
      ],
      {
        opacity: 0,
        y: 30,
      }
    );

    gsap.to(section7HeaderRef.current, {
      scrollTrigger: {
        trigger: section7HeaderRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(section7TestimonialRef.current, {
      scrollTrigger: {
        trigger: section7TestimonialRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out",
    });

    section7ImagesRef.current.forEach((img, i) => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.1,
        ease: "power2.out",
      });
    });

    // Section 8 Animation
    gsap.set([section8HeaderRef.current, section8FaqsRef.current], {
      opacity: 0,
      y: 50,
    });

    gsap.to(section8HeaderRef.current, {
      scrollTrigger: {
        trigger: section8HeaderRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(section8FaqsRef.current, {
      scrollTrigger: {
        trigger: section8FaqsRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power2.out",
    });

    // Section 9 Animation
    gsap.set([section9ContentRef.current, section9ImageRef.current], {
      opacity: 0,
      y: 50,
    });

    gsap.to(section9ContentRef.current, {
      scrollTrigger: {
        trigger: section9ContentRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(section9ImageRef.current, {
      scrollTrigger: {
        trigger: section9ImageRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out",
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    // Initialize GSAP timeline for each feature
    const tl = gsap.timeline();

    // Pin the right section
    ScrollTrigger.create({
      trigger: section4FeaturesRef.current,
      start: "top top",
      end: `+=${features.length * 100}%`,
      pin: rightImageRef.current,
      scrub: true,
    });

    // Animate feature items and right image on scroll
    features.forEach((_, index) => {
      const featureElement = featureRefs.current[index];

      // ScrollTrigger for each feature
      ScrollTrigger.create({
        trigger: featureElement,
        start: "top 30%",
        end: "top 10%",
        scrub: true,
        onEnter: () => {
          setActiveIndex(index);
          // Update right image with fade animation
          gsap.to(rightImageRef.current, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              gsap.set(rightImageRef.current, {
                attr: { src: features[index].rightImage },
              });
              gsap.to(rightImageRef.current, {
                opacity: 1,
                duration: 0.3,
              });
            },
          });
        },
        onEnterBack: () => {
          setActiveIndex(index);
          // Update right image with fade animation
          gsap.to(rightImageRef.current, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              gsap.set(rightImageRef.current, {
                attr: { src: features[index].rightImage },
              });
              gsap.to(rightImageRef.current, {
                opacity: 1,
                duration: 0.3,
              });
            },
          });
        },
      });

      // Animate feature item opacity and border
      tl.to(featureElement, {
        opacity: 1,
        borderLeftColor: "#your-main-color", // Replace with your main color
        duration: 0.5,
        scrollTrigger: {
          trigger: featureElement,
          start: "top 50%",
          end: "top 20%",
          scrub: true,
        },
      });
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const features = [
    {
      title: "Property Screening Criteria",
      description:
        "Set filters based on budget, yield, risk level, zip code, and investment type.",
      icon: PropertyScreenIcon,
      rightImage: ExplorePropertyIcon,
    },
    {
      title: "Get Instant Rankings",
      description: "Properties are automatically scored and ranked by ROI.",
      icon: InstantRankingIcomn,
      rightImage: rightoneNav,
    },
    {
      title: "Smart Portfolio Builder",
      description:
        "Create a diversified investment portfolio across cities, property types, and risk levels.",
      icon: SmartPort,
      rightImage: righttwoNav,
    },
    {
      title: "One–Click Marketing Reports",
      description:
        "Export market-ready reports to share listings across social and investor platforms.",
      icon: MarketingReportsIcon,
      rightImage: rightthreeNav,
    },
  ];

  useEffect(() => {
    const sections = gsap.utils.toArray(".feature-section-item");

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full">
        {/* Left Section */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center p-6"
          style={{
            backgroundImage: `url(${LoginLeft})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full max-w-md">
            <h1
              ref={headingRef}
              className="text-4xl md:text-5xl font-bold leading-tight mb-4"
            >
              Real Estate <br /> Analysis and Investment
            </h1>
            <div className="py-2">
              <YellowLine />
            </div>
            <p ref={paragraphRef} className="text-gray-800 mb-6">
              Unlock a world of expert analysis & fractional ownership
              opportunities
            </p>

            <div ref={statsRef} className="flex gap-8">
              <div className="border-l-4 border-main pl-4">
                <p className="text-2xl font-semibold text-main">50k+</p>
                <p className="text-sm text-gray-600">Lorem ipsum</p>
              </div>
              <div className="border-l-4 border-main pl-4">
                <p className="text-2xl font-semibold text-main">10k+</p>
                <p className="text-sm text-gray-600">Lorem ipsum</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center p-4"
          style={{
            backgroundImage: `url(${RightHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          ref={imageRef}
        >
          <img
            src={rightNew}
            className="w-full max-w-lg h-auto object-contain"
            alt="Hero Visual"
          />
        </div>
      </div>

      {/* second section */}
      <div
        className="sect w-full grid grid-cols-1 md:grid-cols-[30%_70%] items-center justify-between flex-wrap px-8 py-12 bg-white"
        style={{
          backgroundImage: `url(${BulbBg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "20%",
          backgroundPosition: "right bottom",
        }}
      >
        {/* Left Section */}
        <div
          className=" xs:w-full bg-bgPurple rounded-md border border-[#E0DEF7] flex flex-col items-start pt-8"
          ref={section2LeftRef}
        >
          <div className="p-8 w-full">
            <h2 className="textMain text-3xl font-bold mb-4 leading-snug flex-wrap">
              Investment <br /> Analysis <br /> Insights Hub
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Make smarter decisions, faster. Our AI-driven insights engine
              analyzes hundreds of properties, helping you find the best
              opportunities based on your investment goals.
            </p>
            <button
              onClick={() => navigate("/property")}
              className="bgMain text-white px-5 py-2 rounded-md font-semibold hover:opacity-90"
            >
              Browse Properties
            </button>
          </div>
          {/* Decorative 3D Building Illustration */}
          <div className="relative" ref={illustrationRef}>
            <img src={Ilustration}></img>
          </div>
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-2 gap-6">
          <FeatureCard
            refCallback={addToFeatureRefs}
            icon={propertyIcon}
            title="Multiple Property Input"
            desc="Analyze several properties at once to compare returns, risk, and long-term growth potential."
          />
          <FeatureCard
            refCallback={addToFeatureRefs}
            icon={compareIcon}
            title="Compare Properties"
            desc="Use side-by-side comparisons for rental income, cap rate, neighborhood score, and cash-on-cash return."
          />
          <FeatureCard
            refCallback={addToFeatureRefs}
            icon={ReccomendIcon}
            title="Recommendations of Best Investment Options"
            desc="Get personalized property picks powered by smart algorithms and real-time market data."
          />
          <FeatureCard
            refCallback={addToFeatureRefs}
            icon={ReportIcon}
            title="Analysis Report"
            desc="Instantly download detailed reports with property summaries including neighborhood data, historical trends, and projected cash flow."
          />
          <FeatureCard
            refCallback={addToFeatureRefs}
            icon={AiIcon}
            title="Use of LLM/AI for Analysis"
            desc="Our AI uses large language models to interpret trends, summarize insights, and flag top-performing investments."
          />
          <FeatureCard
            refCallback={addToFeatureRefs}
            icon={ProfitableSnapIcon}
            title="Profitability Snapshot"
            desc="Get instant projections on rental income, cap rate, and overall returns using customizable financial inputs."
          />
        </div>
      </div>

      {/* third section */}
      <div className="w-full  grid grid-cols-1 md:grid-cols-[50%_50%] flex items-center justify-between gap-10 px-8 py-12 bg-white">
        {/* Left Section */}
        <section className="sect  bg-white px-6 py-12 md:px-16 lg:px-24">
          <div className="max-w-4xl mx-auto text-start" ref={section3HeaderRef}>
            <h2 className="textMain text-3xl md:text-4xl font-bold mb-4">
              Powerful Automation for Easy Investment
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-12">
              Automate your deal sourcing, analysis, and marketing with Dream
              Avenue's wholesale toolkit. Save time and scale your real estate
              operations effortlessly.
            </p>
          </div>

          {/* Left Section */}
          <section className="grid gap-10 grid-cols-1 w-full lg:w-1/2">
            {features.map((item, index) => (
              <div
                key={index}
                className={`feature-section-item flex items-start space-x-4 cursor-pointer p-3 ${
                  activeIndex === index
                    ? "border-l-4 border-main"
                    : "border-l-4 border-transparent"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <img src={item.icon} alt="" className="w-14 h-14" />
                <div>
                  <h3
                    className={`font-semibold text-lg ${
                      activeIndex === index ? "text-main" : "text-gray-900"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </section>
        </section>

        {/* Right Section */}
        <section
          className=" bg-bgPurple p-6 flex items-center justify-center border border-violet-400/50"
          ref={section3ImageRef}
        >
          <img
            src={features[activeIndex].rightImage}
            alt="Right visual"
            className="max-w-full h-auto"
          />
        </section>
      </div>

      {/* fourth */}
      <div
        className="sect w-full py-16 flex flex-col items-center justify-between gap-10 px-8 py-12 bg-white"
        style={{
          backgroundImage: `url(${Background4})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "50%",
          backgroundPosition: "right bottom",
        }}
      >
        <div className="text-center max-w-3xl gap-4" ref={section4HeaderRef}>
          <p className="text-sm textMain uppercase font-semibold mb-2">
            Investment Analysis Tools
          </p>
          <h2 className="textMain text-3xl md:text-4xl font-bold mb-4">
            Empower Your Investment
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-12">
            Explore properties, analyze trends, and make informed decisions with
            Dreamavenue's data-driven investment analysis tools
          </p>
        </div>

        <div className="relative w-full flex flex-col items-center">
         {/* <ArrowConnector/> */}

          {/* Cards/Icons */}
          <div className="pt-16 flex justify-between items-start w-full gap-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <img
                src={DataDrivenIcon}
                className="w-18 h-18"
                alt="Data Driven"
              />
              <h3 className="text-sm font-semibold">
                Data-Driven Decision Making
              </h3>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <img
                src={ChartsGraphsIcon}
                className="w-18 h-18"
                alt="Charts & Graphs"
              />
              <h3 className="text-sm font-semibold">
                User-Friendly Charts & Graphs
              </h3>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <img
                src={InvestmentOpportunitiesIcon}
                className="w-18 h-18"
                alt="Investment"
              />
              <h3 className="text-sm font-semibold">
                Identify Investment Opportunities
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* fifth */}
      <div
        className="mx-auto py-16 flex items-center justify-between w-full"
        style={{
          backgroundImage: `url(${HouseDollarIcon})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "20%",
          backgroundPosition: "right bottom",
        }}
      >
        <div
          className="w-1/2 flex flex-col items-end h-full"
          ref={section5ImageRef}
        >
          <img
            src={side5img}
            className="w-full object-contain centre h-[85vh]"
          ></img>
        </div>
        {/* Left Section - Text */}
        <div
          className="w-1/2 h-full flex items-center justify-center"
          ref={section5ContentRef}
        >
          <div className="sect w-full text-start">
            <p className="text-sm textMain text-start uppercase font-semibold mb-2">
              Property Investment
            </p>
            <h1 className="text-3xl font-bold leading-tight mb-4 md:text-4xl">
              Fractional Investment
            </h1>

            <img src={Yellow} className="w-[80%]"></img>
            <p className="text-gray-600 text-sm">
              Invest in real estate without traditional ownership barriers
            </p>
            <p className="text-gray-600 text-sm py-3">
              With Dream Avenue, you can invest in high-potential properties
              without needing to purchase the entire asset. Gain equity, earn
              rental income, and watch your money grow — all with low entry
              costs and full transparency.
            </p>
            <div className="flex gap-10 justify-start">
              <button className="bgMain text-white px-5 py-2 rounded-md font-semibold hover:opacity-90 flex items-center justify-betwee gap-2">
                See more <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* sixth */}
      <div className="sect w-full flex flex-col items-center justify-between gap-6 px-8 py-12 bg-white">
        <div className="text-center max-w-3xl gap-4" ref={section6HeaderRef}>
          <p className="text-sm textMain uppercase font-semibold mb-2">
            ADVERTISEMENT DISTRIBUTION{" "}
          </p>
          <h2 className="textMain text-3xl md:text-4xl font-bold mb-4">
            Marketing Automation{" "}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Get your listings in front of the right eyes. Our smart marketing
            engine distributes, tracks, and optimizes your real estate
            promotions across platforms.
          </p>
        </div>

        <div className="flex items-center justify-between w-full gap-12 pt-2">
          <div
            className="flex flex-col items-center justify-center gap-2 border border-bgPurple p-4 rounded-lg opacity-0 transform translate-y-8"
            ref={addToSection6Refs}
          >
            <img src={campaignsIcon} className="w-18 h-18"></img>
            <h3 className="text-base font-semibold mb-3 text-center">
              Automated Campaigns
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Run targeted email blasts and social media ads to promote your
              properties effortlessly.
            </p>
          </div>

          <div
            className="flex flex-col items-center justify-center gap-2 border border-bgPurple p-4 rounded-lg opacity-0 transform translate-y-8"
            ref={addToSection6Refs}
          >
            <img src={resIcon} className="w-18 h-18"></img>
            <h3 className="text-base font-semibold mb-3 text-center">
              View the Responses{" "}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Monitor clicks, interest levels, and engagement in real-time.
            </p>
          </div>

          <div
            className="flex flex-col items-center justify-center gap-2 border border-bgPurple p-4 rounded-lg opacity-0 transform translate-y-8"
            ref={addToSection6Refs}
          >
            <img src={performanceIcon} className="w-18 h-18"></img>
            <h3 className="text-basse font-semibold mb-3 text-center">
              Key Performance Indicators{" "}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Access visual dashboards to track ROI, leads, and conversion
              metrics.
            </p>
          </div>
        </div>
      </div>

      {/* seventh */}
      <div className="sect w-full flex flex-col items-center justify-center gap-10 px-8 py-12 bg-bgPurple">
        <div className="text-center max-w-3xl gap-2" ref={section7HeaderRef}>
          <div className="flex flex-col items-center justify-center py-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Testimonials{" "}
            </h2>
            <img src={testYellow} className=""></img>

            <p className="text-[#4D5461] text-sm">
              See what our customers have to say
            </p>
          </div>
          <div ref={section7TestimonialRef}>
            <p className="text-gray-600 text-sm md:text-base py-6">
              "Lorem ipsum dolor sit amet consectetur adipiscing elit, labore
              adth dolore magna aliquaLorem ipsum dolor sit amet consectetur
              adipiscing elit, labore adth dolore magna aliqua!"
            </p>
            <p>
              Mira Culos,
              <span className="text-gray-500"> Renter</span>
            </p>
          </div>
        </div>

        <div className="sect flex items-center justify-between w-full gap-12 pt-6 max-w-xl">
          <img
            src={test1}
            className="w-18 h-18 opacity-0 transform translate-y-4"
            ref={addToSection7Refs}
          ></img>
          <img
            src={test1}
            className="w-18 h-18 opacity-0 transform translate-y-4"
            ref={addToSection7Refs}
          ></img>
          <img
            src={test1}
            className="w-18 h-18 opacity-0 transform translate-y-4"
            ref={addToSection7Refs}
          ></img>
        </div>
      </div>

      {/* eight */}
      <div
        className="sect mx-auto py-16 flex items-center justify-between w-full"
        style={{
          backgroundImage: `url(${QuestionIcon})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "40%",
          backgroundPosition: "left bottom",
        }}
      >
        <div
          className="w-1/2 flex flex-col items-center h-full justify-center py-10"
          ref={section8HeaderRef}
        >
          <div className="w-full text-start pb-6">
            <h1 className="text-3xl font-bold leading-tight mb-4 md:text-4xl">
              Frequently Asked <br /> Questions
            </h1>

            <p className="text-gray-600 text-sm">
              Invest in real estate without traditional ownership barriers{" "}
            </p>
          </div>
          <div className="min-h-80"></div>
        </div>
        {/* Left Section - Text */}
        <div className="w-1/2 space-y-4 overflow-auto" ref={section8FaqsRef}>
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-md overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4 hover:bg-bgPurple font-medium"
                onClick={() => toggle(index)}
              >
                <span>{faq.question}</span>
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openIndex === index && faq.answer && (
                <div className="p-4 text-sm text-gray-700 bg-white">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* nine */}
      <section className="sect p-10 bg-white py-20">
        <div className="bg-bgPurple border border-borderColor w-full flex items-center justify-between gap-10 rounded-md">
          {/* Left Section */}
          <section
            className="w-1/2 px-2 py-12 md:px-16 lg:px-24"
            ref={section9ContentRef}
          >
            <div className="p-6">
              <h2 className="textMain text-3xl font-bold mb-4 leading-snug">
                Begin Your Real Estate <br /> Investment Journey <br /> today!
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Lorem ipsum dolor sit amet consectetur adipiscing elit, labore
                adth dolore magna aliqua
              </p>

              <div className="flex gap-10 justify-start">
                <button className="bgMain text-white px-5 py-2 rounded-md font-semibold hover:opacity-90 flex items-center justify-betwee gap-2">
                  Join Us Now <FaChevronRight />
                </button>
              </div>
            </div>
          </section>

          {/* Right Section */}
          <section
            className="w-1/2 gap-6 bg-bgPurple flex items-center justify-center border-l border-bgPurple"
            ref={section9ImageRef}
          >
            <img src={rightSide9}></img>
          </section>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
