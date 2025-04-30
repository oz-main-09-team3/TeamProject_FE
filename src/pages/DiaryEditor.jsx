import React, { useState, useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import Editor from "@toast-ui/editor";
import testimage from "../assets/profile.png";

const DiaryEditor = () => {
  const [mood, setMood] = useState("기본");
  const [originalContent, setOriginalContent] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const moodImageSrc = testimage;

  const formatDate = () => {
    const today = new Date();
    return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  };

  const handleMoodChange = (newMood) => setMood(newMood);

  const handleGoBack = () => {
    if (
      isEditing &&
      window.confirm("저장하지 않은 변경사항이 있습니다. 나가시겠습니까?")
    ) {
      console.log("작성 취소, 뒤로가기");
    } else {
      console.log("뒤로가기");
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getMarkdown();
      console.log("저장된 내용:", content);
      console.log("선택된 감정:", mood);
      alert("일기가 저장되었습니다.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("작성을 취소하시겠습니까?")) {
      if (editorRef.current) {
        editorRef.current.setMarkdown(originalContent);
      }
      console.log("작성 취소");
    }
  };

  useEffect(() => {
    if (!editorContainerRef.current) return;
    setOriginalContent("");

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
    <div className="min-h-screen pt-20 text-lighttext dark:text-darkBrown transition-colors duration-300 flex justify-center items-center px-4 py-8">
      <div className="editor-card">
        <div className="w-full md:w-2/3 p-6 flex flex-col">
          <div className="editor-toolbar">
            <button className="back-button" onClick={handleGoBack}>
              ←
            </button>
            <div className="flex space-x-3">
              <button className="btn btn-outline" onClick={handleCancel}>
                취소
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                저장
              </button>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <div className="emoji-select-wrapper">
              <img
                src={moodImageSrc}
                alt="현재 기분"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="editor-date">{formatDate()}</div>
            <div className="editor-status">작성 중...</div>
          </div>

          <div className="editor-container">
            <div ref={editorContainerRef} className="min-h-[400px]" />
          </div>

          <div className="text-right text-gray-400 text-sm">0 / 20</div>
        </div>

        <div className="w-full md:w-1/3 p-6 flex flex-col border-t md:border-t-0 md:border-l border-lightYellow dark:border-darkBrown max-h-[90vh] overflow-auto">
          <h3 className="text-center text-base mb-4 text-gray-400 dark:text-gray-300">
            이모지는 하나만 골라주세요!
          </h3>
          <div className="text-sm text-gray-500 mb-4 text-center">
            현재 선택: <span className="font-medium">{mood}</span>
          </div>

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
