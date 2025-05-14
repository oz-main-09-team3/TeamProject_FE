import React, { useState, useEffect, useRef } from 'react';
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from '@toast-ui/editor';
import MoodButton from "../components/diary/MoodButton";
import Modal from "../components/Modal";
import { ChevronLeft, Save } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchEmotions, updateDiary } from "../service/diaryApi";
import { Helmet } from 'react-helmet-async';
import { EMOJI_TEXT_MAP, getDefaultEmojis } from '../constants/Emoji';

/**
 * 일기 수정 페이지 컴포넌트
 * @returns {JSX.Element} 일기 수정 페이지
 */
const DiaryEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Refs
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  
  // 상태 관리 - mood를 문자열로 관리 (DiaryEditor와 동일)
  const [mood, setMood] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [moodOptions, setMoodOptions] = useState([]);
  const [isLoadingMoods, setIsLoadingMoods] = useState(true);
  const [moodError, setMoodError] = useState(null);
  
  // location.state에서 초기 내용 가져오기
  const diary = location.state?.diary;
  const initialContent = diary?.content || '';
  // emotion은 객체이므로 id를 추출하고 문자열로 변환
  const initialMood = diary?.emotion?.id ? String(diary.emotion.id) : '';

  // 날짜 포맷
  const formatDate = () => {
    return new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 에디터 초기화 - useDiaryEditor의 방식 사용
  useEffect(() => {
    if (!editorContainerRef.current) return;

    // 기존 에디터가 있으면 제거
    if (editorRef.current) {
      try {
        editorRef.current.destroy();
      } catch (error) {
        console.error('Error destroying editor:', error);
      }
    }

    try {
      editorRef.current = new Editor({
        el: editorContainerRef.current,
        height: '400px',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        initialValue: initialContent,
        placeholder: '내용을 수정해주세요...',
        viewer: false,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
          ['code', 'codeblock']
        ]
      });

      // 에디터 변경 시 편집 중 상태로 변경
      editorRef.current.on('change', () => {
        setIsEditing(true);
      });

    } catch (error) {
      console.error('Error initializing editor:', error);
    }

    // cleanup 함수
    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
      }
    };
  }, [initialContent]); // initialContent가 변경될 때만 재초기화

  // 초기 mood 설정
  useEffect(() => {
    console.log('=== Initial mood setup ===');
    console.log('Full diary data:', diary);
    console.log('Diary emotion:', diary?.emotion);
    console.log('Initial mood value:', initialMood, '(type:', typeof initialMood, ')');
    
    if (initialMood) {
      setMood(initialMood);
      console.log('Initial mood set to:', initialMood);
    }
  }, [initialMood]);

  // 이모지 목록을 API에서 가져오기
  useEffect(() => {
    const fetchMoodOptions = async () => {
      try {
        setIsLoadingMoods(true);
        const response = await fetchEmotions();
        
        // API 응답이 있는지 확인
        if (response && response.data) {
          // API 응답에 텍스트 추가하여 사용
          const transformedData = response.data.map(item => ({
            ...item,
            emotion: EMOJI_TEXT_MAP[Number(item.id)] || `감정${item.id}`
          }));
          setMoodOptions(transformedData);
        } else {
          throw new Error('유효하지 않은 응답');
        }
        setMoodError(null);
      } catch (error) {
        console.error('이모지 목록을 불러오는데 실패했습니다:', error);
        setMoodError('이모지 목록을 불러오는데 실패했습니다.');
        
        // 에러 발생 시 기본 이모지 목록 사용
        setMoodOptions(getDefaultEmojis());
      } finally {
        setIsLoadingMoods(false);
      }
    };

    fetchMoodOptions();
  }, []);

  // 감정 변경 핸들러
  const handleMoodChange = (newMood) => {
    console.log('=== handleMoodChange called ===');
    console.log('Previous mood:', mood, '(type:', typeof mood, ')');
    console.log('New mood value:', newMood, '(type:', typeof newMood, ')');
    setMood(newMood);
    setIsEditing(true);
    console.log('Mood updated, isEditing set to true');
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    if (isEditing) {
      setIsCancelModalOpen(true);
    } else {
      navigate(-1);
    }
  };

  // 수정 저장 함수
  const handleUpdateDiary = async () => {
    console.log('=== handleUpdateDiary called ===');
    console.log('Current editorRef:', editorRef.current);
    console.log('Current mood value:', mood, '(type:', typeof mood, ')');
    
    if (!editorRef.current) {
      console.error('Editor not ready');
      alert('에디터가 준비되지 않았습니다.');
      return false;
    }
    
    try {
      const content = editorRef.current.getMarkdown();
      console.log('Editor content retrieved:', content.substring(0, 50) + '...');
      
      if (!mood) {
        console.log('No mood selected, showing alert');
        alert('기분을 선택해주세요.');
        return false;
      }
      
      console.log('Converting mood to number:', mood, '->', Number(mood));
      
      const diaryData = {
        emotion_id: Number(mood),
        content: content,
      };
      
      console.log('=== Data to be sent ===');
      console.log('diaryData:', JSON.stringify(diaryData, null, 2));
      console.log('emotion_id type:', typeof diaryData.emotion_id);
      console.log('Calling updateDiary with ID:', id);
      
      const response = await updateDiary(id, diaryData);
      console.log('=== Update response ===');
      console.log('Response:', response);
      
      return true; 
    } catch (error) {
      console.error('=== Update error ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.response?.data?.message);
      
      alert(error.response?.data?.message || '일기 수정에 실패했습니다.');
      return false; 
    }
  };

  // 모달 핸들러들
  const handleCancelModalCloseAndGoBack = () => {
    setIsCancelModalOpen(false);
    navigate(-1);
  };

  const handleOnlyCloseModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleConfirmSaveAndShowSaved = async () => {
    const saveSuccess = await handleUpdateDiary();
    if (saveSuccess) {
      setIsSaveModalOpen(false);
      setIsSavedModalOpen(true);
    }
  };

  const handleCloseSavedModal = () => {
    setIsSavedModalOpen(false);
    navigate('/main', { state: { refresh: true } });  // MainPage로 이동하며 새로고침 요청
  };

  // mood 상태 변경 감지
  useEffect(() => {
    console.log('=== Mood state changed ===');
    console.log('Current mood value:', mood, '(type:', typeof mood, ')');
    console.log('Selected mood text:', getSelectedMoodText());
    
    // 강제 리렌더링 테스트
    if (mood) {
      const selectedOption = moodOptions.find(opt => String(opt.id) === mood);
      console.log('Selected option found:', selectedOption);
    }
  }, [mood, moodOptions]);

  // 선택된 mood의 텍스트 찾기
  const getSelectedMoodText = () => {
    if (!mood) return '없음';
    // mood는 문자열이므로 Number로 변환하여 매핑
    return EMOJI_TEXT_MAP[Number(mood)] || '없음';
  };

  return (
   <>
      <Helmet>
        <title>일기 수정 - 멋쟁이 감자</title>
        <meta name="description" content="감자의 일기를 수정해보세요!" />
      </Helmet>
      
      <div className="min-h-screen pt-20 text-lighttext dark:text-darkBrown transition-colors duration-300 flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-6xl bg-white shadow-md rounded-xl flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-2/3 p-6 flex flex-col">
            {/* 에디터 카드 컨테이너 - DiaryEditor와 동일한 구조 사용 */}
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
                    onClick={() => setIsSaveModalOpen(true)}
                    disabled={!isEditing || !mood}
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 날짜와 상태 표시 */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold dark:text-darkBg">{formatDate()}</div>
                <div className="edit-diary-status">수정 중...</div>
              </div>

              {/* 에디터 컨테이너 - CSS 충돌 방지를 위해 고유한 클래스명 사용 */}
              <div className="edit-diary-container">
                <div ref={editorContainerRef} className="edit-diary-wrapper min-h-[400px]" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 p-5 flex flex-col border-t md:border-t-0 md:border-l border-lightYellow dark:border-darktext">
            <h3 className="text-lg font-medium mb-4">
              이모지는 하나만 골라주세요!
            </h3>
            <div className="text-sm text-gray-500 mb-4">
              현재 선택: <span className="font-medium text-base">{getSelectedMoodText()}</span>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 dark:text-darkBg">오늘의 기분</h3>
              <div className="grid grid-cols-4 gap-3" key={`mood-grid-${mood}`}>
                {moodOptions.map((option) => (
                  <MoodButton
                    key={`${option.id}-${mood}`}
                    mood={getSelectedMoodText()}
                    value={option.emotion}
                    onClick={() => handleMoodChange(String(option.id))}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 모달들 */}
        <Modal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          title="수정하시겠습니까?"
          content="수정한 내용이 저장됩니다."
          confirmText="저장"
          cancelText="취소"
          onConfirm={handleConfirmSaveAndShowSaved}
          onCancel={() => setIsSaveModalOpen(false)}
        />

        <Modal
          isOpen={isCancelModalOpen}
          onClose={handleOnlyCloseModal}
          title="수정을 취소하시겠습니까?"
          content="수정 중인 내용이 저장되지 않습니다."
          confirmText="나가기"
          cancelText="계속 수정"
          onConfirm={handleCancelModalCloseAndGoBack}
          onCancel={handleOnlyCloseModal}
          isDanger={true}
        />

        <Modal
          isOpen={isSavedModalOpen}
          onClose={handleCloseSavedModal}
          title="수정 완료"
          content="수정되었습니다."
          confirmText="확인"
          cancelText=""
          onConfirm={handleCloseSavedModal}
          onCancel={handleCloseSavedModal}
          type="success"
        />
      </div>
    </>
  );
};

export default DiaryEditPage;