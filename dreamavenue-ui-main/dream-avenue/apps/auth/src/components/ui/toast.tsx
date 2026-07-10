import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
    FaCheckCircle, 
    FaTimesCircle, 
    FaExclamationTriangle, 
    FaInfoCircle 
  } from "react-icons/fa";
// Toast Types
type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast Configuration
interface ToastConfig {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}


// Toast Styling Configuration
const TOAST_STYLES = {
    success: {
      icon: FaCheckCircle,
      bgColor: "bg-green-500",
      iconColor: "text-white",
    },
    error: {
      icon: FaTimesCircle,
      bgColor: "bg-red-500",
      iconColor: "text-white",
    },
    warning: {
      icon: FaExclamationTriangle,
      bgColor: "bg-yellow-500",
      iconColor: "text-white",
    },
    info: {
      icon: FaInfoCircle,
      bgColor: "bg-blue-500",
      iconColor: "text-white",
    },
  };
// Toast Component
const ToastComponent: React.FC<ToastConfig & { onClose: () => void }> = ({
    type,
    message,
    duration = 2000,
    onClose
}) => {
    const { icon: Icon, bgColor, iconColor } = TOAST_STYLES[type];

    React.useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`
        flex items-center w-full max-w-md p-4 mb-4 
        text-textColor rounded-lg shadow-md
        animate-slide-in-right gap-2 ${bgColor}
      `}
            role="alert"
        >
            <div className={`
        inline-flex items-center justify-center 
        flex-shrink-0 w-8 h-8 
        ${bgColor} ${iconColor} 
        rounded-lg
      `}>
                <Icon className="w-5 h-5" />
                <span className="sr-only">{type} icon</span>
            </div>
            <div className="ms-3 text-sm font-normal">{message}</div>
            <button
                type="button"
                className={`ms-auto -mx-1.5 -my-1.5  rounded-lg focus:ring-2 
          focus:ring-gray-300 p-1 hover:bg-bgCard
          inline-flex items-center justify-center h-8 w-8`}
                onClick={onClose}
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <span>X</span>
            </button>
        </div>
    );
};


// Toaster Context
interface ToasterContextType {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

// Toaster Provider Component
interface ToasterProps {
    children: ReactNode;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const Toaster: React.FC<ToasterProps> = ({
    children,
    position = 'top-right'
}) => {
    const [toasts, setToasts] = useState<ToastConfig[]>([]);

    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4'
    };

    const addToast = (type: ToastType, message: string, duration?: number) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, type, message, duration }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const toasterContext: ToasterContextType = {
        success: (message, duration) => addToast('success', message, duration),
        error: (message, duration) => addToast('error', message, duration),
        warning: (message, duration) => addToast('warning', message, duration),
        info: (message, duration) => addToast('info', message, duration),
    };

    return (
        <ToasterContext.Provider value={toasterContext}>
            {children}
            <div
                className={`
          fixed ${positionClasses[position]} 
          z-[9999] flex flex-col items-end
        `}
            >
                {toasts.map(toast => (
                    <ToastComponent
                        key={toast.id}
                        {...toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToasterContext.Provider>
    );
};

// Custom Hook to use Toast
export const useToast = () => {
    const context = useContext(ToasterContext);
    if (!context) {
        throw new Error('useToast must be used within a ToasterProvider');
    }
    return context;
};
