import React, { useState, useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import Editor from "@toast-ui/editor";
import testimage from "../assets/profile.png";

const DiaryEditor = () => {
  const [mood, setMood] = useState("기본");
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const moodImageSrc = testimage;

  const formatDate = () => {
    const today = new Date();
    return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  };

  const handleMoodChange = (newMood) => {
    setMood(newMood);
  };

  const handleGoBack = () => {
    console.log("뒤로가기");
  };

  useEffect(() => {
    if (!editorContainerRef.current) return;

    editorRef.current = new Editor({
      el: editorContainerRef.current,
      height: "500px",
      previewStyle: "vertical",
      initialEditType: "markdown",
      toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol", "task", "indent", "outdent"],
        ["table", "image", "link"],
        ["code", "codeblock"],
      ],
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  const moodButtons = [
    "짜릿해",
    "즐거움",
    "사랑",
    "기대감",
    "자신감",
    "기쁨",
    "행복함",
    "뿌듯함",
    "츄릅",
    "쑥스러움",
    "인생..",
    "꾸엑",
    "지침",
    "놀람",
    "니가?",
    "현타",
    "그래요",
    "당황",
    "소노",
    "슬픔",
    "억울함",
    "불안함",
    "어이없음",
    "울고싶음",
    "우울함",
    "안타까움",
    "화남",
    "열받음",
  ];

  return (
    <div className="min-h-screen pt-20 bg-lightBg dark:bg-darkBg text-lighttext dark:text-darkBrown transition-colors duration-300 flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-xl flex flex-col md:flex-row overflow-hidden">
        {/* 왼쪽 에디터 */}
        <div className="w-full md:w-2/3 p-6 flex flex-col">
          <div className="mb-6">
            <button
              className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center"
              onClick={handleGoBack}
            >
              ←
            </button>
          </div>

          <div className="flex justify-end mb-6">
            <div className="w-28 h-28 rounded-full flex justify-center items-center overflow-hidden relative">
              <div className="absolute inset-0 rounded-full border-4"></div>
              <img
                src={moodImageSrc}
                alt="현재 기분"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-2xl font-bold mb-4">{formatDate()}</div>

          <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
            <div ref={editorContainerRef} className="min-h-[400px]" />
          </div>

          <div className="text-right text-gray-400 text-sm">0 / 20</div>
        </div>

        {/* 오른쪽 감정 선택 */}
        <div className="w-full md:w-1/3 p-6 flex flex-col border-t md:border-t-0 md:border-l border-gray-200 dark:border-darkBrown max-h-[90vh] overflow-auto">
          <h3 className="text-center text-base mb-4 text-gray-400 dark:text-gray-300">
            이모지는 하나만 골라주세요!
          </h3>

          <div className="grid grid-cols-4 gap-3">
            {moodButtons.map((buttonText, index) => (
              <MoodButton
                key={index}
                text={buttonText}
                isSelected={mood === buttonText}
                onClick={() => handleMoodChange(buttonText)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MoodButton = ({ text, isSelected, onClick }) => (
  <button
    className={`
      py-1 px-2 text-sm h-12 w-full rounded-md flex items-center justify-center transition-colors
      ${
        isSelected
          ? "bg-lightOrange text-white dark:text-darkBrown border-2 border-lightGold dark:bg-darkOrange dark:border-darktext"
          : "bg-lightYellow text-lighttext hover:bg-lightGold dark:bg-[#FBDAAC] dark:text-darkBrown dark:hover:text-darktext dark:hover:bg-darkCopper"
      }
    `}
    onClick={onClick}
    style={{ wordBreak: "keep-all", whiteSpace: "normal", lineHeight: "1.2" }}
  >
    {text}
  </button>
);

export default DiaryEditor;
