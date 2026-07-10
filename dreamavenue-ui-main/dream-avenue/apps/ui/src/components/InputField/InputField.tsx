import React, { useState } from "react";
import { Search, Eye, EyeOff } from "lucide-react";

interface TextBoxProps {
  type?: "text" | "password" | "search";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const InputField: React.FC<TextBoxProps> = ({
  type = "text",
  placeholder = "Enter text...",
  value,
  onChange,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isSearch = type === "search";

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {isSearch && <Search className="absolute left-3 text-gray-500" size={18} />}
      
      <input
        type={isPassword && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`w-full px-4 py-3 border border-[#E0DEF7] rounded-lg focus:ring focus:ring-blue-300 bg-[#F7F7FD] outline-none transition
          ${isSearch ? "pl-10" : "pl-4"} 
          ${isPassword ? "pr-10" : "pr-4"}`}
      />

      {isPassword && (
        <button
          type="button"
          className="absolute right-3 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default InputField;
