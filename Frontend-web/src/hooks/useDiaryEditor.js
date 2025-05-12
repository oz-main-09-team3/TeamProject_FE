import { useState, useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/editor';
import { createDiary } from '../service/diaryApi';

/**
 * 일기 에디터 관련 로직을 관리하는 커스텀 훅
 * @param {string} initialContent - 에디터의 초기 내용
 * @returns {Object} 에디터 관련 상태와 핸들러 함수들
 */
export const useDiaryEditor = (initialContent = '') => {
  // 상태 관리
  const [mood, setMood] = useState(""); // 선택된 감정 상태
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false); // 저장 모달 상태
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // 취소 모달 상태
  
  // 에디터 관련 refs
  const editorRef = useRef(null); // Toast UI Editor 인스턴스
  const editorContainerRef = useRef(null); // 에디터 DOM 요소

  /**
   * 현재 날짜를 YYYY-MM-DD 형식으로 반환
   * @returns {string} 포맷된 날짜 문자열
   */
  const formatDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
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
    setIsSaveModalOpen(true);
  };

  /**
   * 저장 확인 핸들러
   */
  const handleConfirmSave = async () => {
    try {
      // Toast UI Editor 인스턴스에서 직접 getMarkdown() 호출
      const content = editorRef.current ? editorRef.current.getMarkdown() : '';
      
      // emotion_id 매핑
      const emotionMap = {
        '짜릿해': 1, '즐거움': 2, '사랑': 3, '기대감': 4, '자신감': 5,
        '기쁨': 6, '행복함': 7, '뿌듯함': 8, '츄릅': 9, '쑥스러움': 10,
        '인생..': 11, '꾸엑': 12, '지침': 13, '놀람': 14, '니가?': 15,
        '현타': 16, '그래요': 17, '당황': 18, '소노': 19, '슬픔': 20,
        '억울함': 21, '불안함': 22, '어이없음': 23, '울고싶음': 24,
        '우울함': 25, '안타까움': 26, '화남': 27, '열받음': 28
      };
      
      if (!mood) {
        alert('기분을 선택해주세요.');
        return;
      }
      
      const diaryData = {
        emotion_id: emotionMap[mood],
        content: content,
        visibility: true,
        images: []
      };
      
      console.log('저장할 데이터:', diaryData);
      
      const response = await createDiary(diaryData);
      console.log('일기 저장 성공:', response.data);
      
      setIsSaveModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error('일기 저장 중 오류:', error);
      alert(error.response?.data?.message || '일기 저장 중 오류가 발생했습니다.');
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
      window.history.back();
    }
  };

  /**
   * 취소 확인 핸들러
   */
  const handleConfirmCancel = () => {
    setIsCancelModalOpen(false);
    window.history.back();
  };

  /**
   * 취소 모달 닫기 핸들러
   */
  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
  };

  // 에디터 초기화
  useEffect(() => {
    if (!editorContainerRef.current || editorRef.current) return;

    try {
      // Toast UI Editor 인스턴스 생성
      editorRef.current = new Editor({
        el: editorContainerRef.current,
        height: "500px",
        previewStyle: "vertical",
        initialEditType: "wysiwyg",
        initialValue: initialContent,
        placeholder: '오늘의 일기를 작성해주세요...',
        toolbarItems: [
          ["heading", "bold", "italic", "strike"],
          ["hr", "quote"],
          ["ul", "ol", "task", "indent", "outdent"],
          ["table", "image", "link"],
          ["code", "codeblock"],
        ],
      });

      // 변경 이벤트 리스너
      editorRef.current.on('change', () => {
        setIsEditing(true);
      });
    } catch (error) {
      console.error('에디터 초기화 오류:', error);
    }

    // 컴포넌트 언마운트 시 에디터 정리
    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.error('에디터 제거 오류:', error);
        }
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