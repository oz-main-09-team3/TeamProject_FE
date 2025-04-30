import React, { useState, useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import Editor from "@toast-ui/editor";
import testimage from "../assets/profile.png";
import Modal from "../components/Modal";

const DiaryEditPage = () => {
  const [mood, setMood] = useState("기본");
  const [originalContent, setOriginalContent] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
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
    if (isEditing) {
      setIsCancelModalOpen(true);
    } else {
      console.log("뒤로가기");
    }
  };

  const handleSave = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getMarkdown();
      console.log("저장된 내용:", content);
      console.log("선택된 감정:", mood);
      setIsSaveModalOpen(false);
    }
  };

  const handleCancelSave = () => {
    setIsSaveModalOpen(false);
  };

  const handleCancel = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (editorRef.current) {
      editorRef.current.setMarkdown(originalContent);
    }
    console.log("작성 취소");
    setIsCancelModalOpen(false);
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
  };

  useEffect(() => {
    if (!editorContainerRef.current) return;

    setOriginalContent("테스트");

    editorRef.current = new Editor({
      el: editorContainerRef.current,
      height: "500px",
      previewStyle: "vertical",
      initialEditType: "markdown",
      initialValue: "테스트",
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
    "짜릿해", "즐거움", "사랑", "기대감", "자신감", "기쁨", "행복함", "뿌듯함",
    "츄릅", "쑥스러움", "인생..", "꾸엑", "지침", "놀람", "니가?", "현타",
    "그래요", "당황", "소노", "슬픔", "억울함", "불안함", "어이없음", "울고싶음",
    "우울함", "안타까움", "화남", "열받음",
  ];

  return (
    <div className="min-h-screen pt-20 text-lighttext dark:text-darkBrown transition-colors duration-300 flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-2/3 p-6 flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <button
              className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center"
              onClick={handleGoBack}
            >
              ←
            </button>
            <div className="flex space-x-3">
              <button
                className="py-2 px-4 bg-lightYellow dark:bg-darkCopper text-lighttext dark:text-white hover:bg-gray-300 dark:hover:bg-darkBrown rounded-md text-sm"
                onClick={handleCancel}
              >
                취소
              </button>
              <button
                className="py-2 px-4 bg-lightOrange dark:bg-darkOrange text-white hover:brightness-110 rounded-md text-sm"
                onClick={handleSave}
              >
                저장
              </button>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <div className="w-28 h-28 rounded-full border-2 flex justify-center items-center overflow-hidden relative">
              <div className="absolute inset-0 rounded-full border-4"></div>
              <img
                src={moodImageSrc}
                alt="현재 기분"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">{formatDate()}</div>
            <div className="text-sm text-gray-500">수정 중...</div>
          </div>

          <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
            <div ref={editorContainerRef} className="min-h-[400px]" />
          </div>

          <div className="text-right text-gray-400 text-sm mb-4">0 / 20</div>
        </div>

        <div className="w-full md:w-1/3 p-5 flex flex-col border-t md:border-t-0 md:border-l border-lightYellow dark:border-darktext max-h-[90vh] overflow-auto">
          <h3 className="text-lg font-medium mb-4">
            이모지는 하나만 골라주세요!
          </h3>
          <div className="text-sm text-gray-500 mb-4">
            현재 선택: <span className="font-medium">{mood}</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
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

      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Modal
            type="info"
            title="일기 수정"
            message="지금 내용을 수정하시겠습니까?"
            confirmText="수정하기"
            cancelText="취소"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        </div>
      )}

      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Modal
            type="warning"
            title="수정 취소"
            message="수정을 취소하시겠습니까?"
            confirmText="취소하기"
            cancelText="돌아가기"
            onConfirm={handleConfirmCancel}
            onCancel={handleCancelModalClose}
          />
        </div>
      )}
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

export default DiaryEditPage;
