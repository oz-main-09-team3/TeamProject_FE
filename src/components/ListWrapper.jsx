export default function ListWrapper({ children }) {
  return (
    <div
      className="fixed top-[72px] right-0 h-[calc(100%-72px)] w-[30%] min-w-[360px] max-w-sm
                 bg-yl100 dark:bg-darktext text-lighttext 
                 shadow-2xl rounded-l-2xl p-6 overflow-y-auto z-40
                 transition-all
                 md:w-[360px] 
                 sm:top-[72px] sm:right-0 sm:w-full sm:h-[calc(100%-72px)] sm:rounded-none sm:p-4"
    >
      {children}
    </div>
  );
}