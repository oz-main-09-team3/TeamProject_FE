import { useState, useRef, useEffect } from 'react';
import Editor from '@toast-ui/editor';
// import { updateDiary } from '../service/diaryApi';

/**
 * 일기 에디터 관련 로직을 관리하는 커스텀 훅
 * @param {string} initialContent - 에디터의 초기 내용
 * @returns {Object} 에디터 관련 상태와 핸들러 함수들
 */
export const useDiaryEditor = (initialContent = '') => {
  // 상태 관리
  const [mood, setMood] = useState("기본"); // 선택된 감정 상태
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
  const handleMoodChange = (newMood) => {
    setMood(newMood);
    setIsEditing(true);
  };

  /**
   * 저장 버튼 클릭 핸들러
   */
  const handleSave = () => {
    const content = editorRef.current?.getInstance().getMarkdown() || '';
    console.log("저장된 내용:", content);
    console.log("선택된 감정:", mood);
    setIsSaveModalOpen(true);
  };

  /**
   * 저장 확인 핸들러
   */
  const handleConfirmSave = async () => {
    try {
      const content = editorRef.current?.getInstance().getMarkdown() || '';
      const diaryData = {
        content,
        mood,
        date: formatDate()
      };
      
      // TODO: API 연결 후 주석 해제
      // const diaryId = 1; // 임시로 1로 설정
      // await updateDiary(diaryId, diaryData);
      
      console.log('저장할 데이터:', diaryData); // 임시로 데이터 확인용
      
      setIsSaveModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error('일기 저장 중 오류:', error);
      alert('일기 저장 중 오류가 발생했습니다.');
    }
  };

  /**
   * 저장 취소 핸들러
   */
  const handleCancelSave = () => {
    setIsSaveModalOpen(false);
  };

  /**
   * 뒤로가기 버튼 클릭 핸들러
   */
  const handleGoBack = () => {
    if (isEditing) {
      setIsCancelModalOpen(true);
    } else {
      // TODO: 이전 페이지로 이동
    }
  };

  /**
   * 취소 확인 핸들러
   */
  const handleConfirmCancel = () => {
    editorRef.current?.getInstance().setMarkdown(initialContent);
    setMood("기본");
    setIsEditing(false);
    setIsCancelModalOpen(false);
  };

  /**
   * 취소 모달 닫기 핸들러
   */
  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
  };

  // 에디터 초기화
  useEffect(() => {
    if (!editorContainerRef.current) return;

    // Toast UI Editor 인스턴스 생성
    editorRef.current = new Editor({
      el: editorContainerRef.current,
      height: "400px",
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

    // 내용 변경 이벤트 리스너
    editorRef.current.on('change', () => {
      setIsEditing(true);
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
    editorContainerRef,
    formatDate,
    handleMoodChange,
    handleGoBack,
    handleSave,
    handleConfirmSave,
    handleCancelSave,
    handleConfirmCancel,
    handleCancelModalClose,
    setIsSaveModalOpen,
  };
}; 