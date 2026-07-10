import React, { FC, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  prefixText?: string;
  suffixText?: string;
  register?: any;
  width?: string; 
  height?: string;
  error?: any | null;

}

const Input: FC<InputProps> = ({
  label,
  prefixIcon,
  suffixIcon,
  prefixText,
  suffixText,
  register,
  error,
  width , 
  height , 
  ...props
}) => {
  return (
    <div className={`relative flex items-center ${width}`}>
      {prefixIcon && <div className="absolute left-3">{prefixIcon}</div>}
      {prefixText && <span className="absolute left-3 text-gray-400">{prefixText}</span>}
      <input
        {...props}
        {...register}
        className={`h-12 p-3 border bg-bgPurple border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500  ${height} 
          ${prefixIcon || prefixText ? "pl-10" : ""} 
          ${suffixIcon || suffixText ? "pr-10" : ""} ${error? "border-red-500 focus:ring-red-500 placeholder-red-500" : "border-gray-300 focus:ring-blue-500"} w-full`} // Input should always take full width inside the container
      />
      {suffixIcon && <div className="absolute right-3">{suffixIcon}</div>}
      {suffixText && <span className="absolute right-3 text-gray-400">{suffixText}</span>}
    </div>
  );
};

export default Input;
