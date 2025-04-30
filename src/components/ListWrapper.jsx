export default function ListWrapper({ children }) {
  return (
    <div className="fixed top-20 right-0 h-[calc(100%-5rem)] w-[30%] min-w-[360px] bg-white dark:bg-[#3b2b22] shadow-lg rounded-l-2xl p-6 overflow-y-auto z-50 transition-all">
      {children}
    </div>
  );
}
