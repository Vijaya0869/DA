import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const YellowLine = () => {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.out",
      delay: 0.3,
    });
  }, []);

  return (
    <svg
      width="487"
      height="34"
      viewBox="0 0 487 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={pathRef}
        d="M4 30C73.6307 10.3798 266.914 -17.0885 483 30"
        stroke="#E4BB67"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default YellowLine;
