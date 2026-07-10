import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const SplitArrowConnector = () => {
  const lineRefs = useRef<SVGLineElement[]>([]);

  useEffect(() => {
    const [mainVertical, leftHorizontal, centerHorizontal, rightHorizontal, leftDown, centerDown, rightDown] =
      lineRefs.current;

    if (lineRefs.current.some((line) => !line)) return;

    const tl = gsap.timeline({ defaults: { duration: 0.4, ease: "power2.out" } });

    // Animate from top to 3 split
    tl.fromTo(mainVertical, { scaleY: 0 }, { scaleY: 1 })
      .fromTo([leftHorizontal, centerHorizontal, rightHorizontal], { scaleX: 0 }, { scaleX: 1, stagger: 0.1 })
      .fromTo([leftDown, centerDown, rightDown], { scaleY: 0 }, { scaleY: 1, stagger: 0.1 });
  }, []);

  return (
    <div className="relative w-full flex justify-center py-8">
      <svg width="100%" height="100" className="absolute top-0 left-0">
        <defs>
          <marker
            id="arrow"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L6,3 Z" fill="#A0AEC0" />
          </marker>
        </defs>

        {/* Main vertical line from top */}
        <line
          ref={(el) => (lineRefs.current[0] = el!)}
          x1="50%"
          y1="0"
          x2="50%"
          y2="40"
          stroke="#A0AEC0"
          strokeWidth="2"
          style={{ transform: "scaleY(0)", transformOrigin: "center top" }}
        />

        {/* Horizontal lines from the bottom of vertical */}
        <line
          ref={(el) => (lineRefs.current[1] = el!)}
          x1="20%"
          y1="40"
          x2="50%"
          y2="40"
          stroke="#A0AEC0"
          strokeWidth="2"
          style={{ transform: "scaleX(0)", transformOrigin: "right center" }}
        />
        <line
          ref={(el) => (lineRefs.current[2] = el!)}
          x1="50%"
          y1="40"
          x2="50%"
          y2="40" // no horizontal move, just placeholder for central drop
          stroke="#A0AEC0"
          strokeWidth="2"
          style={{ transform: "scaleX(0)", transformOrigin: "center center" }}
        />
        <line
          ref={(el) => (lineRefs.current[3] = el!)}
          x1="80%"
          y1="40"
          x2="50%"
          y2="40"
          stroke="#A0AEC0"
          strokeWidth="2"
          style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
        />

        {/* Down arrows */}
        <line
          ref={(el) => (lineRefs.current[4] = el!)}
          x1="20%"
          y1="40"
          x2="20%"
          y2="80"
          stroke="#A0AEC0"
          strokeWidth="2"
          markerEnd="url(#arrow)"
          style={{ transform: "scaleY(0)", transformOrigin: "top center" }}
        />
        <line
          ref={(el) => (lineRefs.current[5] = el!)}
          x1="50%"
          y1="40"
          x2="50%"
          y2="80"
          stroke="#A0AEC0"
          strokeWidth="2"
          markerEnd="url(#arrow)"
          style={{ transform: "scaleY(0)", transformOrigin: "top center" }}
        />
        <line
          ref={(el) => (lineRefs.current[6] = el!)}
          x1="80%"
          y1="40"
          x2="80%"
          y2="80"
          stroke="#A0AEC0"
          strokeWidth="2"
          markerEnd="url(#arrow)"
          style={{ transform: "scaleY(0)", transformOrigin: "top center" }}
        />
      </svg>
    </div>
  );
};

export default SplitArrowConnector;
