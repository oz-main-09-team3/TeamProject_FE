import React, { useState, useEffect } from 'react';
import "@toast-ui/editor/dist/toastui-editor.css";
import MoodButton from "../components/diary/MoodButton";
import { useDiaryEditor } from "../hooks/useDiaryEditor";
import Modal from "../components/Modal";
import { ChevronLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchEmotions } from "../service/diaryApi";
import { Helmet } from 'react-helmet-async';
import { EMOJI_TEXT_MAP, getDefaultEmojis } from '../constants/Emoji';
import useUiStore from '../store/uiStore'; 
/**
 * 일기 작성 페이지 컴포넌트
 * @returns {JSX.Element} 일기 작성 페이지
 */
const DiaryEditor = () => {
  const navigate = useNavigate();
  const [moodOptions, setMoodOptions] = useState([]);
  const [isLoadingMoods, setIsLoadingMoods] = useState(true);
  const [moodError, setMoodError] = useState(null);
  
  // Zustand 스토어의 openModal 함수 가져오기
  const { openModal } = useUiStore();
  
  // useDiaryEditor 훅을 사용하여 에디터 관련 로직 관리
  const {
    mood,
    isEditing,
    editorContainerRef,
    formatDate,
    handleMoodChange,
    handleConfirmSave,
    editorRef
  } = useDiaryEditor();

  // 이모지 목록을 API에서 가져오기
  useEffect(() => {
    const fetchMoodOptions = async () => {
      try {
        setIsLoadingMoods(true);
        const response = await fetchEmotions();
        
        // API 응답이 있는지 확인
        if (response && response.data) {
          // API 응답을 그대로 사용하되, 텍스트는 EMOJI_TEXT_MAP에서 가져오기
          const transformedData = response.data.map(item => ({
            id: item.id,
            emotion: item.emotion, // API에서 받은 emotion 텍스트 유지
            display_emotion: EMOJI_TEXT_MAP[Number(item.id)] || item.emotion, // 표시용 텍스트
            image_url: item.image_url
          }));
          
          console.log('API emotions:', response.data);
          console.log('Transformed data:', transformedData);
          
          setMoodOptions(transformedData);
        } else {
          throw new Error('유효하지 않은 응답');
        }
        setMoodError(null);
      } catch (error) {
        console.error('이모지 목록을 불러오는데 실패했습니다:', error);
        setMoodError('이모지 목록을 불러오는데 실패했습니다.');
        
        // 에러 발생 시 기본 이모지 목록 사용
        setMoodOptions(getDefaultEmojis().map(item => ({
          ...item,
          display_emotion: item.emotion
        })));
      } finally {
        setIsLoadingMoods(false);
      }
    };

    fetchMoodOptions();
  }, []);

  // 뒤로가기 버튼 클릭 시 실행
  const handleGoBack = () => {
    if (isEditing) {
      openModal('warning', {
        title: '작성을 취소하시겠습니까?',
        content: '작성 중인 내용이 저장되지 않습니다.',
        confirmText: '취소',
        cancelText: '계속 작성',
        onConfirm: () => navigate(-1),
      });
    } else {
      navigate(-1);
    }
  };

  // 저장 버튼 클릭 시 실행
  const handleSave = () => {
    if (!mood) {
      openModal('warning', {
        title: '이모지 선택 필요',
        content: '이모지를 선택해주세요.',
        confirmText: '확인',
      });
      return;
    }
    openModal('confirm', {
      title: '저장하시겠습니까?',
      content: '작성한 내용이 저장됩니다.',
      confirmText: '저장',
      cancelText: '취소',
      onConfirm: handleConfirmSaveAndShowSaved,
    });
  };

  // 저장 확인 모달에서 '저장' 클릭 시 실행
  const handleConfirmSaveAndShowSaved = async () => {
    const saveSuccess = await handleConfirmSave();
    if (saveSuccess) {
      openModal('success', {
        title: '저장 완료',
        content: '저장되었습니다.',
        confirmText: '확인',
        onConfirm: () => navigate('/main'),
      });
    }
  };

  // 선택된 mood의 텍스트 찾기
  const getSelectedMoodText = () => {
    if (!mood) return '없음';
    const selectedOption = moodOptions.find(option => String(option.id) === String(mood));
    return selectedOption ? selectedOption.display_emotion : EMOJI_TEXT_MAP[Number(mood)] || '없음';
  };

  return (
    <>
      <Helmet>
        <title>일기 작성 - 멋쟁이 감자</title>
        <meta name="description" content="감자의 새로운 일기를 작성해보세요!" />
        <meta property="og:title" content="일기 작성 - 멋쟁이 감자" />
        <meta property="og:description" content="감자의 새로운 일기를 작성해보세요!" />
      </Helmet>
      <div className="min-h-screen pt-20 text-lighttext dark:text-darkBrown transition-colors duration-300 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-6xl bg-white shadow-md rounded-xl flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-2/3 p-6 flex flex-col">
            {/* 에디터 카드 컨테이너 */}
            <div className="flex flex-col gap-6">
              {/* 툴바 */}
              <div className="flex justify-between items-center">
                <button
                  className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors"
                  onClick={handleGoBack}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  <button
                    className="w-10 h-10 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={!isEditing}
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 날짜와 상태 표시 */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold dark:text-darkBg">{formatDate()}</div>
                <div className="editor-status">작성 중...</div>
              </div>

              {/* 에디터 컨테이너 */}
              <div className="editor-container">
                <div ref={editorContainerRef} className="min-h-[400px]" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 p-5 flex flex-col border-t md:border-t-0 md:border-l border-lightYellow dark:border-darktext">
            <h3 className="text-lg font-medium mb-4">
              이모지는 하나만 골라주세요!
            </h3>
            <div className="text-sm text-gray-500 mb-4">
              현재 선택: <span className="font-medium">{getSelectedMoodText()}</span>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 dark:text-darkBg">오늘의 기분</h3>
              <div className="grid grid-cols-4 gap-3">
                {moodOptions.map((option) => (
                  <MoodButton
                    key={option.id}
                    mood={getSelectedMoodText()}
                    value={option.display_emotion} // 표시용 텍스트 사용
                    onClick={() => {
                      console.log(`Selected mood ID: ${option.id}, emotion: ${option.emotion}`);
                      handleMoodChange(String(option.id));
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 모달 컴포넌트 */}
        <Modal type="success" />
        <Modal type="warning" />
        <Modal type="confirm" />
      </div>
    </>
  );
};

export default DiaryEditor;