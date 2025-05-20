import React, { useState, useEffect, useRef } from 'react';
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from '@toast-ui/editor';
import MoodButton from "../components/diary/MoodButton";
import Modal from "../components/Modal";
import { ChevronLeft, Save } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchEmotions } from "../service/diaryApi";
import { Helmet } from 'react-helmet-async';
import { EMOJI_TEXT_MAP, getDefaultEmojis } from '../constants/Emoji';
import useUiStore from '../store/uiStore';
import useDiaryStore from '../store/diaryStore';
import { getEmojiSrc } from "../utils/emojiUtils";
import BackButton from "../components/BackButton";
import ActionButton from "../components/ActionButton";

/**
 * 일기 수정 페이지 컴포넌트
 * @returns {JSX.Element} 일기 수정 페이지
 */
const DiaryEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: urlId } = useParams();
  
  // Zustand 스토어
  const { openModal } = useUiStore();
  const { fetchDiary, updateDiary, currentDiary, isLoading: diaryLoading } = useDiaryStore();
  
  // Refs
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  
  // 상태 관리
  const [mood, setMood] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [moodOptions, setMoodOptions] = useState([]);
  const [isLoadingMoods, setIsLoadingMoods] = useState(true);
  const [moodError, setMoodError] = useState(null);
  const [diaryId, setDiaryId] = useState(null);
  const [editorValue, setEditorValue] = useState('');
  const [date, setDate] = useState('');

  // ID 설정 및 유효성 검사
  useEffect(() => {
    const stateId = location.state?.diary?.id || location.state?.diary?.diary_id;
    const finalId = urlId || stateId;

    console.log('=== ID Debug ===');
    console.log('URL ID:', urlId);
    console.log('State ID:', stateId);
    console.log('Final ID:', finalId);
    console.log('Location State:', location.state);

    if (!finalId) {
      console.error('No valid diary ID found');
      openModal('error', {
        title: '오류',
        content: '일기 정보를 찾을 수 없습니다.',
        confirmText: '확인',
        onConfirm: () => navigate('/main')
      });
      return;
    }

    setDiaryId(finalId);

    // URL이 undefined를 포함하고 있으면 올바른 URL로 리다이렉트
    if (window.location.pathname.includes('undefined')) {
      navigate(`/diary/edit/${finalId}`, { 
        replace: true,
        state: location.state // 기존 state 유지
      });
    }
  }, [urlId, location.state, navigate, openModal]);

  // 일기 데이터 가져오기
  useEffect(() => {
    const loadDiary = async () => {
      if (!diaryId) return;

      try {
        console.log('Fetching diary with ID:', diaryId);
        const diaryData = await fetchDiary(diaryId);
        console.log('Fetched diary data:', diaryData);
        
        if (!diaryData) {
          throw new Error('일기를 찾을 수 없습니다.');
        }

        // 일기 데이터가 있으면 mood 설정
        if (diaryData.emotionId) {
          console.log('Setting mood to:', diaryData.emotionId);
          setMood(String(diaryData.emotionId));
        }

        setEditorValue(diaryData.content || '');
        setDate(formatDate(diaryData.date));
      } catch (error) {
        console.error('Error loading diary:', error);
        openModal('error', {
          title: '오류',
          content: error.message || '일기를 불러오는데 실패했습니다.',
          confirmText: '확인',
          onConfirm: () => navigate('/main')
        });
      }
    };

    loadDiary();
  }, [diaryId, fetchDiary, navigate, openModal]);

  // 에디터 초기화
  useEffect(() => {
    let editor = null;

    const initializeEditor = () => {
      if (!editorContainerRef.current || !currentDiary) return;

      console.log('Initializing editor with content:', currentDiary.content);

      try {
        // 기존 에디터가 있으면 제거
        if (editorRef.current) {
          try {
            editorRef.current.destroy();
            editorRef.current = null;
          } catch (error) {
            console.error('Error destroying editor:', error);
          }
        }

        // 새 에디터 인스턴스 생성
        editor = new Editor({
          el: editorContainerRef.current,
          height: '400px',
          initialEditType: 'wysiwyg',
          previewStyle: 'vertical',
          initialValue: currentDiary.content || '',
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
        editor.on('change', () => {
          setIsEditing(true);
        });

        editorRef.current = editor;
      } catch (error) {
        console.error('Error initializing editor:', error);
      }
    };

    // 에디터 초기화 실행
    initializeEditor();

    // cleanup 함수
    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
      }
    };
  }, [currentDiary]);

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
      openModal('warning', {
        title: '수정을 취소하시겠습니까?',
        content: '수정 중인 내용이 저장되지 않습니다.',
        confirmText: '나가기',
        cancelText: '계속 수정',
        onConfirm: () => navigate(-1),
      });
    } else {
      navigate(-1);
    }
  };

  // 수정 저장 함수
  const handleUpdateDiary = async () => {
    console.log('=== handleUpdateDiary called ===');
    
    if (!editorRef.current) {
      console.error('Editor not ready');
      openModal('error', {
        title: '오류',
        content: '에디터가 준비되지 않았습니다.',
        confirmText: '확인'
      });
      return false;
    }

    if (!diaryId) {
      console.error('Diary ID not found');
      openModal('error', {
        title: '오류',
        content: '일기 정보를 찾을 수 없습니다.',
        confirmText: '확인'
      });
      return false;
    }
    
    try {
      const content = editorRef.current.getMarkdown();
      console.log('Editor content retrieved:', content.substring(0, 50) + '...');
      
      if (!mood) {
        console.log('No mood selected');
        openModal('error', {
          title: '오류',
          content: '기분을 선택해주세요.',
          confirmText: '확인'
        });
        return false;
      }
      
      const diaryData = {
        emotion_id: Number(mood),
        content: content,
        date: date
      };
      
      console.log('=== Data to be sent ===');
      console.log('diaryData:', JSON.stringify(diaryData, null, 2));
      console.log('Calling updateDiary with ID:', diaryId);
      
      const response = await updateDiary(diaryId, diaryData);
      console.log('=== Update response ===');
      console.log('Response:', response);
      
      return true; 
    } catch (error) {
      console.error('=== Update error ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.response?.data?.message);
      
      openModal('error', {
        title: '오류',
        content: error.response?.data?.message || '일기 수정에 실패했습니다.',
        confirmText: '확인'
      });
      return false; 
    }
  };

  // 저장 버튼 클릭 핸들러
  const handleSaveClick = () => {
    openModal('confirm', {
      title: '수정하시겠습니까?',
      content: '수정한 내용이 저장됩니다.',
      confirmText: '저장',
      cancelText: '취소',
      onConfirm: handleConfirmSaveAndShowSaved,
    });
  };

  // 저장 확인 후 성공 모달 표시
  const handleConfirmSaveAndShowSaved = async () => {
    const saveSuccess = await handleUpdateDiary();
    if (saveSuccess) {
      openModal('success', {
        title: '수정 완료',
        content: '수정되었습니다.',
        confirmText: '확인',
        onConfirm: () => navigate('/main', { state: { refresh: true } }),
      });
    }
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

  // 날짜 포맷팅 함수 추가
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // 이미 포맷팅된 날짜인 경우 (YYYY. MM. DD. 형식)
    if (dateString.includes('.')) {
      return dateString;
    }
    
    // ISO 문자열이나 Date 객체인 경우
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}.`;
  };

  return (
   <>
      <Helmet>
        <title>일기 수정 - 멋쟁이 감자</title>
        <meta name="description" content="감자의 일기를 수정해보세요!" />
      </Helmet>
      
      <main className="text-lighttext dark:text-darkBrown transition-colors duration-300">
        <div className="w-full max-w-4xl mx-auto shadow-xl p-4 font-sans rounded-2xl border-4 border-lightGold dark:border-darkOrange bg-white text-lighttext dark:text-darkbg transition-colors duration-300 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-3/5 p-4 flex flex-col">
            {/* 에디터 카드 컨테이너 */}
            <div className="flex flex-col gap-2">
              {/* 툴바 */}
              <div className="flex justify-between items-center">
                <BackButton to={-1} />
                <div className="flex gap-2">
                  <ActionButton
                    icon={Save}
                    onClick={handleSaveClick}
                    title="저장"
                    variant="default"
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isEditing || !mood}
                  />
                </div>
              </div>
              {/* 날짜와 상태 표시 */}
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold dark:text-darkBg">{date}</div>
                <div className="edit-diary-status">수정 중...</div>
              </div>
              {/* 에디터 컨테이너 - CSS 충돌 방지를 위해 고유한 클래스명 사용 */}
              <div className="edit-diary-container">
                <div ref={editorContainerRef} className="min-h-[400px]" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/5 p-2 flex flex-col border-t md:border-t-0 md:border-l border-lightYellow dark:border-darktext">
            <h3 className="text-lg font-medium">
              이모지는 하나만 골라주세요!
            </h3>
            <div className="text-sm text-gray-500">
              현재 선택: <span className="font-medium">{getSelectedMoodText()}</span>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium dark:text-darkBg">오늘의 기분</h3>
              <div className="grid grid-cols-4 gap-2" key={`mood-grid-${mood}`}> 
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
      </main>

      {/* 모달 컴포넌트 */}
      <Modal type="success" />
      <Modal type="warning" />
      <Modal type="confirm" />
    </>
  );
};

export default DiaryEditPage;