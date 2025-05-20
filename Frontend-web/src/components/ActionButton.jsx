import React from "react";

export default function ActionButton({ icon: Icon, onClick, title, className = "", variant = "default" }) {
  const getVariantClasses = () => {
    switch (variant) {
      case "danger":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-lightYellow dark:bg-darkCopper dark:text-darktext hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full w-8 h-8 flex items-center justify-center transition-colors ${getVariantClasses()} ${className}`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
} 