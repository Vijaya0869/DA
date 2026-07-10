import React, { useEffect, useRef } from "react";
import { FaSquarePollVertical } from "react-icons/fa6";
import "./CustomSlider.css";

interface CustomSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  label,
  value,
  min,
  max,
  prefix = "",
  suffix = "",
  onChange,
}) => {
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updateSliderBackground();
  }, [value, min, max]);

  const updateSliderBackground = () => {
    if (sliderRef.current) {
      const percentage = ((value - min) / (max - min)) * 100;
      sliderRef.current.style.setProperty('--slider-percentage', `${percentage}%`);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base text-main font-medium flex items-center gap-2">
          {label}
          <FaSquarePollVertical className="w-4 h-4 text-main" />
        </span>
        <span className="text-lg font-bold text-textGreen">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <input
        ref={sliderRef}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-slider w-full"
      />
    </div>
  );
};

export default CustomSlider;