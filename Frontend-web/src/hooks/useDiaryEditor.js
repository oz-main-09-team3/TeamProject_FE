import { useState, useRef, useEffect } from 'react';
import Editor from '@toast-ui/editor';

/**
 * 일기 에디터 관련 로직을 관리하는 커스텀 훅
 * @param {string} initialContent - 에디터의 초기 내용
 * @returns {Object} 에디터 관련 상태와 핸들러 함수들
 */
export const useDiaryEditor = (initialContent = '') => {
  // 상태 관리
  const [mood, setMood] = useState("기본"); // 선택된 감정 상태
  const [originalContent, setOriginalContent] = useState(initialContent); // 원본 내용 저장
  const [isEditing, setIsEditing] = useState(true); // 편집 모드 상태
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false); // 저장 모달 상태
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // 취소 모달 상태
  
  // 에디터 관련 refs
  const editorRef = useRef(null); // Toast UI Editor 인스턴스
  const editorContainerRef = useRef(null); // 에디터 DOM 요소

  /**
   * 현재 날짜를 YYYY.MM.DD 형식으로 반환
   * @returns {string} 포맷된 날짜 문자열
   */
  const formatDate = () => {
    const today = new Date();
    return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  };

  /**
   * 감정 선택 핸들러
   * @param {string} newMood - 선택된 새로운 감정
   */
  const handleMoodChange = (newMood) => setMood(newMood);

  /**
   * 뒤로가기 핸들러
   * 편집 중이면 취소 모달을 표시하고, 아니면 뒤로 이동
   */
  const handleGoBack = () => {
    if (isEditing) {
      setIsCancelModalOpen(true);
    } else {
      console.log("뒤로가기");
    }
  };

  /**
   * 저장 버튼 클릭 핸들러
   * 저장 모달을 표시
   */
  const handleSave = () => setIsSaveModalOpen(true);

  /**
   * 저장 확인 핸들러
   * 현재 에디터 내용과 선택된 감정을 저장
   */
  const handleConfirmSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getMarkdown();
      console.log("저장된 내용:", content);
      console.log("선택된 감정:", mood);
      setIsSaveModalOpen(false);
    }
  };

  /**
   * 저장 취소 핸들러
   * 저장 모달을 닫음
   */
  const handleCancelSave = () => setIsSaveModalOpen(false);

  /**
   * 취소 버튼 클릭 핸들러
   * 취소 모달을 표시
   */
  const handleCancel = () => setIsCancelModalOpen(true);

  /**
   * 취소 확인 핸들러
   * 원본 내용으로 복원하고 취소 모달을 닫음
   */
  const handleConfirmCancel = () => {
    if (editorRef.current) {
      editorRef.current.setMarkdown(originalContent);
    }
    console.log("작성 취소");
    setIsCancelModalOpen(false);
  };

  /**
   * 취소 모달 닫기 핸들러
   */
  const handleCancelModalClose = () => setIsCancelModalOpen(false);

  // 에디터 초기화
  useEffect(() => {
    if (!editorContainerRef.current) return;

    // Toast UI Editor 인스턴스 생성
    editorRef.current = new Editor({
      el: editorContainerRef.current,
      height: "500px",
      previewStyle: "vertical",
      initialEditType: "markdown",
      initialValue: initialContent,
      toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol", "task", "indent", "outdent"],
        ["table", "image", "link"],
        ["code", "codeblock"],
      ],
    });

    // 컴포넌트 언마운트 시 에디터 정리
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, [initialContent]);

  // 훅에서 제공하는 값들 반환
  return {
    mood,
    isEditing,
    isSaveModalOpen,
    isCancelModalOpen,
    editorRef,
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
  };
}; 