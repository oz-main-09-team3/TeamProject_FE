import { createContext, useContext, useState } from "react";

const DiaryContext = createContext();

export function DiaryProvider({ children }) {
  const [diaryList, setDiaryList] = useState([]);
  const [emotionMap, setEmotionMap] = useState({});

  return (
    <DiaryContext.Provider value={{ diaryList, setDiaryList, emotionMap, setEmotionMap }}>
      {children}
    </DiaryContext.Provider>
  );
}

export function useDiaryContext() {
  return useContext(DiaryContext);
}
