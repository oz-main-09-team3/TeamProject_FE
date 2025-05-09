import React from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import testimage from "../assets/profile.png";
import Modal from "../components/Modal";
import MoodButton from "../components/diary/MoodButton";
import { useDiaryEditor } from "../hooks/useDiaryEditor";

/**
 * 일기 작성 페이지 컴포넌트
 * @returns {JSX.Element} 일기 작성 페이지
 */
const DiaryEditor = () => {
  // useDiaryEditor 훅을 사용하여 에디터 관련 로직 관리
  const {
    mood,
    isEditing,
    isSaveModalOpen,
    isCancelModalOpen,
    editorContainerRef,
    formatDate,
    handleMoodChange,
    handleGoBack,
    handleSave,
    handleConfirmSave,
    handleCancelSave,
    handleCancel,
    handleConfirmCancel,
    handleCancelModalClose,
  } = useDiaryEditor();

  // 감정 아이콘 이미지 소스
  const moodImageSrc = testimage;

  // 사용 가능한 감정 목록
  const moodButtons = [
    "짜릿해", "즐거움", "사랑", "기대감", "자신감", "기쁨", "행복함", "뿌듯함",
    "츄릅", "쑥스러움", "인생..", "꾸엑", "지침", "놀람", "니가?", "현타",
    "그래요", "당황", "소노", "슬픔", "억울함", "불안함", "어이없음", "울고싶음",
    "우울함", "안타까움", "화남", "열받음",
  ];

  return (
    <div className="min-h-screen pt-20 text-lighttext dark:text-darkBrown transition-colors duration-300 flex justify-center items-center px-4 py-8">
      {/* 에디터 카드 컨테이너 */}
      <div className="editor-card">
        {/* 에디터 영역 */}
        <div className="w-full md:w-2/3 p-6 flex flex-col">
          {/* 툴바 */}
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

          {/* 감정 아이콘 */}
          <div className="flex justify-end mb-6">
            <div className="emoji-select-wrapper">
              <img
                src={moodImageSrc}
                alt="현재 기분"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 날짜 및 상태 표시 */}
          <div className="flex justify-between items-center mb-4">
            <div className="editor-date">{formatDate()}</div>
            <div className="editor-status">작성 중...</div>
          </div>

          {/* 에디터 컨테이너 */}
          <div className="editor-container">
            <div ref={editorContainerRef} className="min-h-[400px]" />
          </div>

          {/* 글자 수 표시 */}
          <div className="text-right text-gray-400 text-sm">0 / 20</div>
        </div>

        {/* 감정 선택 영역 */}
        <div className="w-full md:w-1/3 p-6 flex flex-col border-t md:border-t-0 md:border-l border-lightYellow dark:border-darkBrown max-h-[90vh] overflow-auto">
          <h3 className="text-center text-base mb-4 text-gray-400 dark:text-gray-300">
            이모지는 하나만 골라주세요!
          </h3>
          <div className="text-sm text-gray-500 mb-4 text-center">
            현재 선택: <span className="font-medium">{mood}</span>
          </div>

          {/* 감정 버튼 그리드 */}
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

      {/* 저장 확인 모달 */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Modal
            type="info"
            title="일기 저장"
            message="지금 내용을 저장하시겠습니까?"
            confirmText="저장하기"
            cancelText="취소"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        </div>
      )}

      {/* 취소 확인 모달 */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Modal
            type="warning"
            title="작성 취소"
            message="작성을 취소하시겠습니까?"
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

export default DiaryEditor;
