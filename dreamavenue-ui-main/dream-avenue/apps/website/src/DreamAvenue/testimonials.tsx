import React from "react";

const TestimonialsSection = () => {
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      quote: "It proved to be exactly the kind of home we wanted.",
      content: "We wish to express our thanks for your hard work in finding us a temporary home, which proved to be exactly what we wanted.",
      author: "Jaydon Aminoff",
      position: "UX Designer",
      avatar: "/api/placeholder/50/50" // Replace with actual avatar path
    },
    {
      id: 2,
      quote: "It proved to be exactly the kind of home we wanted.",
      content: "We wish to express our thanks for your hard work in finding us a temporary home, which proved to be exactly what we wanted.",
      author: "Jaydon Aminoff",
      position: "UX Designer",
      avatar: "/api/placeholder/50/50" // Replace with actual avatar path
    },
    {
      id: 3,
      quote: "It proved to be exactly the kind of home we wanted.",
      content: "We wish to express our thanks for your hard work in finding us a temporary home, which proved to be exactly what we wanted.",
      author: "Jaydon Aminoff",
      position: "UX Designer",
      avatar: "/api/placeholder/50/50" // Replace with actual avatar path
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-[#5A39A9] to-[#674cca] text-white p-4  relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="diagonalLines" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#diagonalLines)" />
        </svg>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#5A39A9] rounded-full opacity-20 transform translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-400 rounded-full opacity-20 blur-lg"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Testimonial</h2>
          <a href="#" className="text-white flex items-center font-medium hover:underline">
            Learn More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-[#5A39A9] shadow-md bg-opacity-50 p-8 rounded-lg backdrop-blur-sm"
            >
              {/* Quote icon */}
              <svg className="w-10 h-10 text-white opacity-50 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
              </svg>
              
              {/* Quote heading */}
              <h3 className="text-xl font-bold text-white mb-4">{testimonial.quote}</h3>
              
              {/* Quote content */}
              <p className="text-indigo-100 mb-6">{testimonial.content}</p>
              
              {/* Author info */}
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium text-white">{testimonial.author}</p>
                  <p className="text-indigo-200 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;