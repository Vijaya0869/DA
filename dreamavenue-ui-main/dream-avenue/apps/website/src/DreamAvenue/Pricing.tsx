// DreamAvenue/Pricing.jsx
import React, { useRef, useState, useEffect } from "react";
import "./landingPage.css";
import {
  FaCheck,
  FaChevronDown,
  FaChevronRight,
  FaChevronUp,
} from "react-icons/fa";
import testYellow from "../assets/7thsection/yellow.svg";
import test1 from "../assets/7thsection/test1.svg";
import QuestionIcon from "../assets/7thsection/QuestionMarkIcon.svg";
import rightSide9 from "../assets/9thsection/rightside.svg";
import monthlyIcon from "../assets/pricing/monthly.svg";
import yearlyIcon from "../assets/pricing/yearly.svg";
import circleIcon from "../assets/pricing/circleIcon.svg";
import whitecircle from "../assets/pricing/whitecircle.svg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    question: "Who are Dreamavenue’s target investors?",
    answer: "",
  },
];

const Pricing = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const toggle = (index: React.SetStateAction<number>) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const [viewMode, setViewMode] = useState("monthly");
  const pricingRef = useRef(null);
  const testimonialRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  // Section 8 refs
  const section8HeaderRef = useRef(null);
  const section8FaqsRef = useRef(null);
  useEffect(() => {
    const cards = gsap.utils.toArray(".pricing-card");

    gsap.from(cards, {
      opacity: 0,
      y: 100,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: pricingRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
    gsap.from(".testimonial-text", {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: testimonialRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
    // Animate images
    gsap.from(".testimonial-img", {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: testimonialRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
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

 
  }, []);

  return (
    <div>
      {/* Pricing Section */}
      <div
        className="w-full flex flex-col items-center justify-center gap-10 px-8 py-12 bg-bgPurple"
        ref={pricingRef}
      >
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Select the best plan <br /> for your need
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
          </p>
          <div className="inline-flex  rounded-full ">
            <div className="flex space-x-2 border  border-borderColor bg-bgPurple rounded-md p-1">
              <button
                className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                  viewMode === "monthly" ? "bg-main text-white" : "text-main"
                }`}
                onClick={() => setViewMode("monthly")}
              >
                <img src={monthlyIcon} /> Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                  viewMode === "table" ? "bg-main text-white" : "text-main"
                }`}
                onClick={() => setViewMode("yearly")}
              >
                <img src={yearlyIcon} /> Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="py-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="pricing-card bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative ">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-bgPurple rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-main rounded-sm"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0">
                      For individuals
                    </p>
                    <h3 className="text-3xl font-bold text-iconBg">Basic</h3>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Lorem ipsum dolor sit amet dolor oil sitiol conse ctetur
                  adipiscing elit.
                </p>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-iconBg">$99</span>
                  <span className="text-gray-500 ml-1">/monthly</span>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-iconBg mb-4">
                    What's included
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <img src={circleIcon}></img>

                      <span className="text-main text-sm">
                        All analytics features
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <img src={circleIcon}></img>

                      <span className="text-main text-sm">
                        Up to 250,000 tracked visits
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <img src={circleIcon}></img>

                      <span className="text-main text-sm">Normal support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <img src={circleIcon}></img>

                      <span className="text-main text-sm">
                        Up to 3 team members
                      </span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-main hover:bg-main/90 text-white font-semibold py-4 px-6 rounded-full transition-colors">
                  Get started
                </button>
              </div>

              {/* Standard Plan - Popular */}
              <div className="pricing-card bg-gradient-to-tr from-[#514B96] to-[#423E76] rounded-2xl shadow-lg p-8 relative ">
                <div className="absolute top-6 -right-11 transform -translate-x-1/2">
                  <span className="bg-white text-main px-4 py-1 rounded-l-full text-sm font-semibold">
                    Popular
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm mb-0">For startups</p>
                    <h3 className="text-2xl font-bold text-white">Standard</h3>
                  </div>
                </div>

                <p className="text-purple-200 text-sm mb-6 leading-relaxed">
                  Lorem ipsum dolor sit amet dolor oil sitiol conse ctetur
                  adipiscing elit.
                </p>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-white">$199</span>
                  <span className="text-purple-200 ml-1">/monthly</span>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-white mb-4">
                    What's included
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <img src={whitecircle}></img>

                      <span className="text-white text-sm">
                        All analytics features
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <img src={whitecircle}></img>

                      <span className="text-white text-sm">
                        Up to 1,000,000 tracked visits
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <img src={whitecircle}></img>

                      <span className="text-white text-sm">
                        Premium support
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <img src={whitecircle}></img>

                      <span className="text-white text-sm">
                        Up to 10 team members
                      </span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-white hover:bg-gray-100 text-main font-semibold py-4 px-6 rounded-full transition-colors">
                  Get started
                </button>
              </div>

              {/* Premium Plan */}
              <div className="pricing-card bg-white rounded-2xl shadow-md border border-gray-100 p-8 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-bgPurple rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-main rounded-sm transform rotate-45"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0">
                      For big companies
                    </p>
                    <h3 className="text-2xl font-bold text-iconBg">Premium</h3>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Lorem ipsum dolor sit amet dolor oil sitiol conse ctetur
                  adipiscing elit.
                </p>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-iconBg">$399</span>
                  <span className="text-gray-500 ml-1">/monthly</span>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    What's included
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <img src={circleIcon}></img>

                      <span className="text-main text-sm">
                        All analytics features
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <img src={circleIcon}></img>

                      <span className="text-main text-sm">
                        Up to 5,000,000 tracked visits
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <img src={circleIcon}></img>

                      <span className="text-main text-sm">
                        Dedicated support
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <img src={circleIcon}></img>

                      <span className="text-main text-sm">
                        Up to 50 team members
                      </span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-main hover:bg-main/90 text-white font-semibold py-4 px-6 rounded-full transition-colors">
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* seventh */}
      <div
        ref={testimonialRef}
        className="sect w-full flex flex-col items-center justify-center gap-10 px-8 py-12 bg-bgPurple"
      >
        <div className="text-center max-w-3xl gap-2">
          <div className="flex flex-col items-center justify-center py-2">
            <h2 className=" text-3xl md:text-4xl font-bold mb-4">
              Testimonials{" "}
            </h2>
            <img src={testYellow} className=""></img>

            <p className="text-[#4D5461] text-sm">
              See what our customers have to say
            </p>
          </div>
          <p className="text-gray-600 text-sm md:text-base py-6">
            “Lorem ipsum dolor sit amet consectetur adipiscing elit, labore adth
            dolore magna aliquaLorem ipsum dolor sit amet consectetur adipiscing
            elit, labore adth dolore magna aliqua!”
          </p>
          <p>
            Mira Culos,
            <span className="text-gray-500"> Renter</span>
          </p>
        </div>

        <div className="sect flex items-center justify-between w-full gap-12 pt-6 max-w-xl">
          <img src={test1} className="w-18 h-18"></img>

          <img src={test1} className="w-18 h-18"></img>

          <img src={test1} className="w-18 h-18"></img>
        </div>
      </div>

      {/* eight */}
      <div
        className="sect mx-auto py-16 flex items-center justify-between w-full"
        style={{
          backgroundImage: `url(${QuestionIcon})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "40%", // or "contain", "auto", or fixed size
          backgroundPosition: "left bottom",
        }}
        ref={section8HeaderRef}
      >
        <div className="w-1/2 flex flex-col items-center h-full justify-center py-10">
          <div className=" w-full text-start pb-6">
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
                className="w-full flex justify-between items-center p-4 hover:bg-bgPurple  font-medium"
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
        <div className="bg-bgPurple border border-borderColor w-full flex items-center justify-between gap-10 rounded-md ">
          {/* Left Section */}
          <section
            className=" w-1/2  px-2  py-12 md:px-16 lg:px-24 "
            ref={leftRef}
          >
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
          <section
            className="w-1/2 gap-6 bg-bgPurple  flex items-center justify-center border-l border-bgPurple"
            ref={rightRef}
          >
            <img src={rightSide9}></img>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
