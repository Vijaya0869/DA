import React, { FC, ReactNode, SelectHTMLAttributes } from "react";
import  { UseFormWatch } from "react-hook-form";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  prefixText?: string;
  suffixText?: string;
  register?: any;
  error?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  width?: string;
  selected?: string;
  className?:string  
  watch?: UseFormWatch<any>;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: FC<SelectProps> = ({
  label,
  required,
  prefixIcon,
  suffixIcon,
  prefixText,
  suffixText,
  register,
  error,
  options,
  disabled,
  selected,
  className,
  width,
  onChange,
  ...props
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label className={`text-[#000929] font-medium text-sm ${width}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center w-full ">
        {prefixIcon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{prefixIcon}</div>}
        {prefixText && <span className="absolute left-3 text-gray-400">{prefixText}</span>}
        
        <select
          {...props}
          {...register}
          disabled={disabled}
          onChange={onChange}
          className={`w-full h-12 p-3 bg-bgPurple border rounded-[10px] focus:outline-none focus:ring-2   focus:ring-blue-500 
            ${error ? "border-red-500 focus:ring-red-500 placeholder-red-500" : "border-gray-300 focus:ring-blue-500"} 
            ${prefixIcon || prefixText ? "pl-10" : ""} ${suffixIcon || suffixText ? "pr-10" : ""}
          `}
        >
          <option value="">Select</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} selected={option.value === selected? true : false}>
              {option.label}
            </option>
          ))}
        </select>

        {suffixIcon && <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{suffixIcon}</div>}
        {suffixText && <span className="absolute right-3 text-gray-400">{suffixText}</span>}
      </div>
    </div>
  );
};

export default Select;
