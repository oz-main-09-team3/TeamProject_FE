import React, { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ChevronLeft, Pencil, Trash2, Heart } from "lucide-react";
import MarkdownRenderer from "../components/MarkdownRenderer";
import useDiaryStore from "../store/diaryStore";
import useUiStore from "../store/uiStore";
import { getEmojiSrc } from "../utils/emojiUtils";

const DiaryDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // Zustand 스토어 사용
  const { 
    currentDiary, 
    isLoading, 
    error, 
    fetchDiary, 
    deleteDiary, 
    toggleLike 
  } = useDiaryStore();
  
  const { openModal } = useUiStore();

  // 일기 데이터 불러오기
  useEffect(() => {
    const loadDiaryData = async () => {
      try {
        const diaryId = id || location.state?.diary?.id || location.state?.diary?.diary_id;
        console.log('=== Loading Diary Data ===');
        console.log('URL ID:', id);
        console.log('State Diary:', location.state?.diary);
        console.log('Diary ID to fetch:', diaryId);

        if (!diaryId) {
          console.error('No diary ID found');
          openModal('error', {
            title: '오류',
            content: '일기 정보를 찾을 수 없습니다.',
            confirmText: '확인',
            onConfirm: () => navigate('/main')
          });
          return;
        }

        const diaryData = await fetchDiary(diaryId);
        console.log('Fetched diary data:', diaryData);
        
        // ID가 없는 경우 location.state의 ID를 사용
        if (!diaryData.id && !diaryData.diary_id) {
          diaryData.id = diaryId;
          diaryData.diary_id = diaryId;
        }
      } catch (error) {
        console.error('Error loading diary:', error);
        openModal('error', {
          title: '오류',
          content: '일기를 불러오는데 실패했습니다.',
          confirmText: '확인',
          onConfirm: () => navigate('/main')
        });
      }
    };
    
    loadDiaryData();
  }, [id, location.state, fetchDiary, navigate, openModal]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    console.log('=== Edit Button Clicked ===');
    console.log('Current Diary:', currentDiary);
    console.log('Location State:', location.state);
    
    // location.state에서 ID 가져오기
    const stateId = location.state?.diary?.id;
    console.log('State ID:', stateId);
    
    if (!currentDiary && !stateId) {
      console.error('No diary data available');
      openModal('error', {
        title: '오류',
        content: '일기 정보를 찾을 수 없습니다.',
        confirmText: '확인'
      });
      return;
    }

    // ID 추출 로직 개선
    const diaryId = stateId || id || currentDiary?.id || currentDiary?.diary_id;
    console.log('=== Diary ID Debug ===');
    console.log('URL ID:', id);
    console.log('State ID:', stateId);
    console.log('Current Diary ID:', currentDiary?.id);
    console.log('Current Diary diary_id:', currentDiary?.diary_id);
    console.log('Final ID:', diaryId);
    
    if (!diaryId) {
      console.error('No diary ID found in object:', currentDiary);
      openModal('error', {
        title: '오류',
        content: '일기 정보를 찾을 수 없습니다.',
        confirmText: '확인'
      });
      return;
    }

    openModal('confirm', {
      title: '수정하시겠습니까?',
      content: '일기를 수정하시겠습니까?',
      onConfirm: () => {
        console.log('Navigating to edit page with ID:', diaryId);
        // URL에 ID를 포함하고, state에도 diary 정보를 전달
        navigate(`/diary/edit/${diaryId}`, { 
          state: { 
            diary: {
              id: diaryId,
              diary_id: diaryId,
              content: currentDiary?.content || '',
              emotionId: currentDiary?.emotionId || currentDiary?.emotion_id || 1,
              date: currentDiary?.date || '',
              ...currentDiary
            }
          },
          replace: true
        });
      }
    });
  };

  const handleDelete = () => {
    if (!currentDiary) return;
    
    openModal('error', {
      title: '일기를 삭제하시겠습니까?',
      content: '삭제된 일기는 복구할 수 없습니다.',
      onConfirm: async () => {
        try {
          const diaryId = currentDiary.diary_id || currentDiary.id;
          await deleteDiary(diaryId);
          
          openModal('success', {
            title: '삭제 완료',
            content: '일기가 삭제되었습니다.',
            onConfirm: () => navigate('/main')
          });
        } catch (err) {
          openModal('error', {
            title: '삭제 실패',
            content: '일기 삭제에 실패했습니다: ' + err.message,
            onConfirm: () => null
          });
        }
      }
    });
  };

  // 좋아요 핸들러
  const handleDiaryLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentDiary) return;
    
    const diaryId = currentDiary.diary_id || currentDiary.id;
    toggleLike(diaryId);
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

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!currentDiary) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-gray-500">
          일기를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-6xl mx-auto shadow-xl p-10 font-sans rounded-2xl border-4 border-lightGold dark:border-darkOrange bg-yl100 dark:bg-darktext text-lighttext dark:text-darkbg transition-colors duration-300">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleGoBack}
                className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDiaryLike}
                className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors"
                title={currentDiary.liked ? "좋아요 취소" : "좋아요"}
              >
                <Heart
                  className={`w-5 h-5 ${
                    currentDiary.liked
                      ? "fill-red-500 text-red-500"
                      : "text-lighttext dark:text-darktext"
                  }`}
                />
              </button>
              <button
                onClick={handleEdit}
                className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors"
                title="수정"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors"
                title="삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="w-full flex flex-col">
              <div className="flex justify-center mb-8">
                <div className="w-28 h-28 rounded-full flex justify-center items-center overflow-hidden relative">
                  <div className="absolute inset-0 rounded-full"></div>
                  <img
                    src={getEmojiSrc(currentDiary)}
                    alt="현재 기분"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Emoji image failed to load:', e.target.src);
                      e.target.src = `${import.meta.env.VITE_BACKEND_URL}/static/emotions/1.png`;
                    }}
                  />
                </div>
              </div>

              <div className="text-2xl font-bold mb-4 dark:text-darkBg">
                {currentDiary.date}
              </div>

              <div className="w-full rounded-lg border border-lightGold dark:border-darkCopper shadow-sm p-5 dark:text-darkBg bg-white min-h-[320px]">
                <div className="mt-4">
                  <MarkdownRenderer 
                    content={currentDiary.content} 
                    className="text-gray-700 dark:text-gray-300"
                  />
                  
                  {/* 이미지 표시 */}
                  {currentDiary.images && currentDiary.images.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {currentDiary.images.map((image) => (
                        <img 
                          key={image.diary_image_id}
                          src={image.image_url} 
                          alt="일기 이미지" 
                          className="max-w-full h-auto rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* 작성자 정보 */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {currentDiary.userProfile && (
                        <img 
                          src={currentDiary.userProfile} 
                          alt={currentDiary.userNickname} 
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium">{currentDiary.userNickname}</div>
                        <div className="text-sm text-gray-500">@{currentDiary.userName}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 좋아요 수 표시 */}
                  {currentDiary.likeCount > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <Heart className={`w-4 h-4 ${currentDiary.liked ? "fill-red-500 text-red-500" : ""}`} />
                      <span>{currentDiary.likeCount}명이 좋아합니다</span>
                    </div>
                  )}
                  
                  {/* 댓글 표시 */}
                  {currentDiary.comments && currentDiary.comments.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium mb-3">댓글 {currentDiary.comments.length}개</h3>
                      {currentDiary.comments.map((comment) => (
                        <div key={comment.comment_id} className="mb-3">
                          <div className="text-sm font-medium">사용자 {comment.user_id}</div>
                          <div className="text-gray-700">{comment.content}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(comment.created_at).toLocaleString('ko-KR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryDetailPage;