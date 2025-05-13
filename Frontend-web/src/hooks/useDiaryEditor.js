import { useState, useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/editor';
import { createDiary } from '../service/diaryApi';
import { useNavigate } from 'react-router-dom';

/**
 * 일기 에디터 관련 로직을 관리하는 커스텀 훅
 * @param {string} initialContent 
 * @returns {Object}
 */
export const useDiaryEditor = (initialContent = '') => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [mood, setMood] = useState(""); 
  const [isEditing, setIsEditing] = useState(false); 
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false); 
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); 
  
  // 에디터 관련 refs
  const editorRef = useRef(null); 
  const editorContainerRef = useRef(null); 

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

  const handleSave = () => {
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      const content = editorRef.current ? editorRef.current.getMarkdown() : '';
      
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
        return false;
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
      
      return true; 
    } catch (error) {
      console.error('일기 저장 중 오류:', error);
      alert(error.response?.data?.message || '일기 저장 중 오류가 발생했습니다.');
      return false; 
    }
  };

  const handleCancelSave = () => {
    setIsSaveModalOpen(false);
  };

  const handleGoBack = () => {
    if (isEditing) {
      setIsCancelModalOpen(true);
    } else {
      window.history.back();
    }
  };

  const handleConfirmCancel = () => {
    setIsCancelModalOpen(false);
    window.history.back();
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
  };

  useEffect(() => {
    if (!editorContainerRef.current || editorRef.current) return;

    try {
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

      editorRef.current.on('change', () => {
        setIsEditing(true);
      });
    } catch (error) {
      console.error('에디터 초기화 오류:', error);
    }

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
    setMood,  // 추가
    editorRef,  // 추가
  };
};