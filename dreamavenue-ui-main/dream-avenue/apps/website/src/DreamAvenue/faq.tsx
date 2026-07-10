import React, { useState } from "react";

const FAQSection = () => {
  // Sample FAQ data
  const faqs = [
    {
      id: 1,
      question: "What is fractional investing in real estate?",
      answer: "Fractional investing in real estate is the process of sharing the ownership of a property among multiple investors, enabling them to invest in a property with a smaller financial commitment.",
      isOpen: true
    },
    {
      id: 2,
      question: "How does Dreamavenue democratize real estate investment?",
      answer: "Dreamavenue democratizes real estate investment by lowering the barrier to entry, providing access to professional management, and offering transparent analytics and reporting for all investors.",
      isOpen: false
    },
    {
      id: 3,
      question: "What are the benefits of real estate investing with Dreamavenue?",
      answer: "Benefits include lower minimum investment requirements, diversification opportunities, professional property management, passive income potential, and easy liquidity options compared to traditional real estate investments.",
      isOpen: false
    },
    {
      id: 4,
      question: "Who are Dreamavenue's target investors?",
      answer: "Dreamavenue's target investors include first-time real estate investors, experienced investors looking to diversify their portfolio, busy professionals seeking passive income, and those interested in real estate but lacking the time or expertise to manage properties directly.",
      isOpen: false
    }
  ];

  // State to manage which FAQ is open
  const [openFAQs, setOpenFAQs] = useState(
    faqs.reduce((acc, faq) => {
      acc[faq.id] = faq.isOpen;
      return acc;
    }, {})
  );

  // Toggle FAQ open/close
  const toggleFAQ = (id) => {
    setOpenFAQs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="py-16 px-6 bg-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-indigo-200 rounded-full opacity-50"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-50"></div>
      
      {/* Background question mark */}
      <div className="absolute right-0 bottom-0 w-96 h-96 opacity-5">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 80c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z" fill="#5A67D8"/>
          <path d="M50 25c-8.3 0-15 6.7-15 15 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.8 2.2-5 5-5s5 2.2 5 5c0 2.8-2.2 5-5 5-2.8 0-5 2.2-5 5v10c0 2.8 2.2 5 5 5s5-2.2 5-5v-6.7c5.9-2.2 10-7.9 10-14.3 0-8.3-6.7-15-15-15zm0 60c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" fill="#5A67D8"/>
        </svg>
      </div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform ${openFAQs[faq.id] ? 'rotate-180' : ''} transition-transform`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {openFAQs[faq.id] ? (
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  )}
                </svg>
              </button>
              
              {openFAQs[faq.id] && (
                <div className="px-6 pb-4 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;