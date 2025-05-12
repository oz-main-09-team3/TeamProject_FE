import React, { useState, useEffect } from 'react';
import "@toast-ui/editor/dist/toastui-editor.css";
import MoodButton from "../components/diary/MoodButton";
import { useDiaryEditor } from "../hooks/useDiaryEditor";
import Modal from "../components/Modal";
import { ChevronLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDiary, updateDiary } from "../service/diaryApi";

/**
 * 일기 수정 페이지 컴포넌트
 * @returns {JSX.Element} 일기 수정 페이지
 */
const DiaryEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 일기 ID 가져오기
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [originalDiary, setOriginalDiary] = useState(null);
  
  const {
    mood,
    isEditing,
    isCancelModalOpen,
    isSaveModalOpen,
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
    setMood,
    editorInstance,
  } = useDiaryEditor('');

  // emotion_id를 mood string으로 변환하는 헬퍼 함수
  const getEmotionIdToMoodMap = () => ({
    1: '행복함',
    2: '슬픔', 
    3: '화남',
    // API 스펙에 따라 추가 매핑 필요
  });

  // mood string을 emotion_id로 변환하는 헬퍼 함수
  const getMoodToEmotionIdMap = () => {
    const map = {};
    const emotionToMood = getEmotionIdToMoodMap();
    Object.keys(emotionToMood).forEach(key => {
      map[emotionToMood[key]] = parseInt(key);
    });
    return map;
  };

  // 기존 일기 데이터 불러오기
  useEffect(() => {
    const loadDiary = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetchDiary(id);
        console.log('일기 불러오기 성공:', response.data);
        
        const diaryData = response.data;
        setOriginalDiary(diaryData);
        
        // 에디터에 기존 내용 설정 (에디터가 준비된 후에 설정됨)
        if (editorInstance && diaryData.content) {
          editorInstance.setHTML(diaryData.content);
        }
        
        // 기존 감정 설정
        if (diaryData.emotion_id) {
          const emotionToMoodMap = getEmotionIdToMoodMap();
          const mappedMood = emotionToMoodMap[diaryData.emotion_id];
          if (mappedMood) {
            setMood(mappedMood);
          }
        }
        
      } catch (error) {
        console.error('일기 불러오기 실패:', error);
        alert('일기를 불러오는데 실패했습니다.');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDiary();
  }, [id, navigate, setMood]);

  // 에디터가 준비되면 내용 설정
  useEffect(() => {
    if (editorInstance && originalDiary?.content && !isLoading) {
      editorInstance.setHTML(originalDiary.content);
    }
  }, [editorInstance, originalDiary, isLoading]);

  // 기분 옵션 배열
  const moodOptions = [
    { value: '짜릿해', label: '짜릿해' },
    { value: '즐거움', label: '즐거움' },
    { value: '사랑', label: '사랑' },
    { value: '기대감', label: '기대감' },
    { value: '자신감', label: '자신감' },
    { value: '기쁨', label: '기쁨' },
    { value: '행복함', label: '행복함' },
    { value: '뿌듯함', label: '뿌듯함' },
    { value: '츄릅', label: '츄릅' },
    { value: '쑥스러움', label: '쑥스러움' },
    { value: '인생..', label: '인생..' },
    { value: '꾸엑', label: '꾸엑' },
    { value: '지침', label: '지침' },
    { value: '놀람', label: '놀람' },
    { value: '니가?', label: '니가?' },
    { value: '현타', label: '현타' },
    { value: '그래요', label: '그래요' },
    { value: '당황', label: '당황' },
    { value: '소노', label: '소노' },
    { value: '슬픔', label: '슬픔' },
    { value: '억울함', label: '억울함' },
    { value: '불안함', label: '불안함' },
    { value: '어이없음', label: '어이없음' },
    { value: '울고싶음', label: '울고싶음' },
    { value: '우울함', label: '우울함' },
    { value: '안타까움', label: '안타까움' },
    { value: '화남', label: '화남' },
    { value: '열받음', label: '열받음' }
  ];

  // 모달 닫기 핸들러 (뒤로가기)
  const handleCancelModalCloseAndGoBack = () => {
    handleCancelModalClose();
    navigate(-1);
  };

  // 모달만 닫기
  const handleOnlyCloseModal = () => {
    handleCancelModalClose();
  };

  // 저장 확인 모달에서 '저장' 클릭 시 실행
  const handleConfirmSaveAndShowSaved = async () => {
    try {
      if (!editorInstance) {
        alert('에디터가 준비되지 않았습니다.');
        return;
      }

      const content = editorInstance.getHTML();
      const moodToEmotionMap = getMoodToEmotionIdMap();
      const emotionId = moodToEmotionMap[mood] || 0;

      const updateData = {
        content: content,
        emotion_id: emotionId,
      };

      console.log('수정 데이터:', updateData);
      await updateDiary(id, updateData);
      
      handleCancelSave(); // 저장 모달 닫기
      setIsSavedModalOpen(true);
    } catch (error) {
      console.error('일기 수정 실패:', error);
      alert('일기 수정에 실패했습니다.');
    }
  };

  // 저장 완료 모달 닫기
  const handleCloseSavedModal = () => {
    setIsSavedModalOpen(false);
    navigate(`/diary/${id}`); // 상세 페이지로 이동
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleConfirmEdit = () => {
    setIsEditModalOpen(false);
    navigate(`/diary/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-lighttext dark:text-darktext">
          일기를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 text-lighttext dark:text-darkBrown transition-colors duration-300 flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-2/3 p-6 flex flex-col">
          <div className="flex flex-col gap-6">
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
                  onClick={() => setIsSaveModalOpen(true)}
                  disabled={!isEditing}
                >
                  <Save className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-bold dark:text-darkBg">{formatDate()}</div>
              <div className="editor-status">수정 중...</div>
            </div>

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
            현재 선택: <span className="font-medium">{mood || '없음'}</span>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 dark:text-darkBg">오늘의 기분</h3>
            <div className="grid grid-cols-4 gap-3">
              {moodOptions.map((option) => (
                <MoodButton
                  key={option.value}
                  mood={mood}
                  value={option.value}
                  onClick={handleMoodChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={handleOnlyCloseModal}
        title="작성을 취소하시겠습니까?"
        content="작성 중인 내용이 저장되지 않습니다."
        confirmText="취소"
        cancelText="계속 작성"
        onConfirm={handleCancelModalCloseAndGoBack}
        onCancel={handleOnlyCloseModal}
        isDanger={true}
      />

      <Modal
        isOpen={isSaveModalOpen}
        onClose={handleCancelSave}
        title="저장하시겠습니까?"
        content="수정한 내용이 저장됩니다."
        confirmText="저장"
        cancelText="취소"
        onConfirm={handleConfirmSaveAndShowSaved}
        onCancel={handleCancelSave}
      />

      <Modal
        isOpen={isSavedModalOpen}
        onClose={handleCloseSavedModal}
        title="저장 완료"
        content="일기가 수정되었습니다."
        confirmText="확인"
        cancelText=""
        onConfirm={handleCloseSavedModal}
        onCancel={handleCloseSavedModal}
        type="success"
      />
    </div>
  );
};

export default DiaryEditPage;