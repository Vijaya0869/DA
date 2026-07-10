import React from "react";

// Dialog Size Types
export type DialogSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

// Main Dialog Component Props
export interface DialogProps {
  children: React.ReactNode;
  className?: string;
  open: boolean;
  onClose: () => void;
  size?: DialogSize;
}

// Dialog Part Props
export interface DialogPartProps {
  children: React.ReactNode;
  className?: string;
}

// Close Icon Props
interface CloseIconProps {
  onClick: () => void;
  className?: string;
}

// CloseIcon Component
const CloseIcon: React.FC<CloseIconProps> = ({ onClick, className = "" }) => {
  return (
    <button
      type="button"
      className={`text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center ${className}`}
      onClick={onClick}
    >
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        ></path>
      </svg>
    </button>
  );
};

// Dialog Component
const Dialog: React.FC<DialogProps> = ({
  children,
  className = "",
  open,
  onClose,
  size = "md",
}) => {
  if (!open) return null;

  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    xxl: "max-w-2xl",
  };

  const handleBackdropClick = () => {
    onClose();
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full transform transition-all duration-300 ${sizeClasses[size]} ${className}`}
        onClick={handleDialogClick}
      >
        {children}
      </div>
    </div>
  );
};

// DialogHeader Component
const DialogHeader: React.FC<DialogPartProps & { onClose?: () => void }> = ({
  children,
  className = "",
  onClose,
}) => {
  return (
    <div
      className={`border-b border-gray-200 p-4 font-semibold text-lg flex items-center justify-between ${className}`}
    >
      <div>{children}</div>
      {onClose && <CloseIcon onClick={onClose} />}
    </div>
  );
};

// DialogBody Component
const DialogBody: React.FC<DialogPartProps> = ({
  children,
  className = "",
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// DialogFooter Component
const DialogFooter: React.FC<DialogPartProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`border-t border-gray-200 p-4 flex justify-end space-x-2 ${className}`}
    >
      {children}
    </div>
  );
};

// Export the main Dialog as default
export default Dialog;

// Also export subcomponents individually for direct imports
export { DialogHeader, DialogBody, DialogFooter,Dialog };
