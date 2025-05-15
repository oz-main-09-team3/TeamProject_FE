export default function Button({ children, onClick, type = "button", variant = "primary", className = "" }) {
  const base = "w-full p-1.5 rounded-full font-semibold transition h-8";
  const color =
    variant === "primary"
      ? "bg-lightGold hover:bg-lightOrange dark:bg-darkOrange dark:hover:bg-darkCopper dark:text-darkBg"
      : "bg-lightOrange hover:bg-lightGold dark:bg-darkCopper dark:text-yl100 dark:hover:text-darkdark dark:hover:bg-darkOrange";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${color} ${className}`}
    >
      {children}
    </button>
  );
} 