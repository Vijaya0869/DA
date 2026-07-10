import React from "react";
import { Loader2, Upload, Download, X, RefreshCw } from "lucide-react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "success" | "danger" | "outline" | "link"; // Button types
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disable button
  loading?: boolean; // Show loader
  icon?: "upload" | "download" | "close" | "refresh"; // Icon types
  className?: string; // Custom Tailwind class
  style?: React.CSSProperties; // Custom styles
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  onClick,
  disabled = false,
  loading = false,
  icon,
  className = "",
  style,
  children,
}) => {
  // Define colors and styles based on variant
  const variantStyles: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-[#514b96] to-[#423E76] hover:from-[#423E76] hover:to-[#514b96] text-white",
    secondary: "bg-blue-500 hover:bg-blue-600 text-white",
    success: "bg-teal-500 hover:bg-teal-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline:
      "bg-transparent border border-gray-200 text-gray-500 hover:bg-gray-50",
    link: "bg-transparent text-blue-600 hover:underline",
  };

  // Get the correct icon
  const getIcon = () => {
    switch (icon) {
      case "upload":
        return <Upload className="w-4 h-4" />;
      case "download":
        return <Download className="w-4 h-4" />;
      case "close":
        return <X className="w-4 h-4" />;
      case "refresh":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium 
        ${variantStyles[variant]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
      style={style}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : getIcon()}
      {children}
    </button>
  );
};

export default Button;
