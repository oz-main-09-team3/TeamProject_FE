import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Pencil, Trash2, Heart, Send } from "lucide-react";
import MarkdownRenderer from "../components/MarkdownRenderer";
import useDiaryStore from "../store/diaryStore";
import useUiStore from "../store/uiStore";
import { getEmojiSrc } from "../utils/emojiUtils";
import BackButton from "../components/BackButton";
import ActionButton from "../components/ActionButton";
import FormInput from "../components/FormInput";
import Comment from "../components/Comment";
import useComments from "../hooks/useComments";
import { useLike } from "../hooks/useLike";
import { addLike, removeLike } from "../service/likeApi";

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
    deleteDiary
  } = useDiaryStore();
  
  const { openModal } = useUiStore();

  const diaryId = currentDiary?.diary_id || currentDiary?.id;
  
  // 좋아요 상태 관리
  const [diaryItems, setDiaryItems] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const { handleLike, loadingId, animatingId } = useLike(diaryItems, setDiaryItems);

  // useComments 훅 사용
  const {
    comments,
    newComment,
    setNewComment,
    handleSubmitComment,
    handleDeleteComment,
    loading: commentsLoading,
    setInitialComments,
    handleUpdateComment,
  } = useComments(undefined, diaryId);

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

        // 댓글 데이터 설정
        if (diaryData.comments && Array.isArray(diaryData.comments)) {
          console.log('Setting initial comments:', diaryData.comments);
          setInitialComments(diaryData.comments);
        }

        // 좋아요 상태 설정
        setDiaryItems([{
          id: diaryId,
          liked: diaryData.liked || false
        }]);
        setLikeCount(diaryData.likeCount || 0);
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
  }, [id, location.state, fetchDiary, navigate, openModal, setInitialComments]);

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

  // 일기 좋아요 토글 함수
  const handleDiaryLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!diaryId) return;
    
    try {
      if (diaryItems.find(item => item.id === diaryId)?.liked) {
        await removeLike(diaryId);
        setLikeCount(prev => prev - 1);
      } else {
        await addLike(diaryId);
        setLikeCount(prev => prev + 1);
      }
      
      // useLike 훅의 handleLike 호출
      handleLike(diaryId, e);
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
    }
  };

  // 댓글 수정 핸들러
  const handleEditComment = async (commentId, content) => {
    try {
      await handleUpdateComment(commentId, content);
      // 댓글 수정 후 일기 데이터 다시 로드
      const diaryData = await fetchDiary(diaryId);
      if (diaryData.comments && Array.isArray(diaryData.comments)) {
        setInitialComments(diaryData.comments);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      openModal('error', {
        title: '수정 실패',
        content: '댓글 수정에 실패했습니다.',
        confirmText: '확인'
      });
    }
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
      <div className="w-full max-w-6xl mx-auto shadow-xl p-6 font-sans rounded-2xl border-4 border-lightGold dark:border-darkOrange bg-yl100 dark:bg-darktext text-lighttext dark:text-darkbg transition-colors duration-300">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <BackButton to={-1} />
              <div className="flex gap-2">
                <ActionButton
                  icon={Heart}
                  onClick={handleDiaryLike}
                  title={diaryItems.find(item => item.id === diaryId)?.liked ? "좋아요 취소" : "좋아요"}
                  className={`${loadingId === diaryId ? 'opacity-50' : ''} ${
                    diaryItems.find(item => item.id === diaryId)?.liked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <ActionButton
                  icon={Pencil}
                  onClick={handleEdit}
                  title="수정"
                />
                <ActionButton
                  icon={Trash2}
                  onClick={handleDelete}
                  title="삭제"
                  variant="danger"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="md:w-2/3 w-full flex flex-col">
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

                <div className="w-full rounded-lg border border-lightGold dark:border-darkCopper shadow-sm p-5 dark:text-darkBg bg-white min-h-[320px] diary-content flex flex-col justify-between">
                  <div className="mt-4 flex-1">
                    {currentDiary.content ? (
                      <MarkdownRenderer 
                        content={currentDiary.content} 
                        className="text-gray-700 dark:text-gray-300 markdown-renderer"
                      />
                    ) : (
                      <p>내용이 없습니다.</p>
                    )}
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
                  </div>
                  {/* 작성자 정보: 항상 박스 하단에 */}
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
                </div>
              </div>

              {/* 댓글 영역 */}
              <div className="md:w-1/3 w-full flex flex-col gap-2 border-t md:border-t-0 md:border-l dark:text- border-lightGold dark:border-darkCopper md:pt-0 md:pl-5 bg-yl100 dark:bg-darktext">
                {/* 좋아요 수 표시 */}
                {likeCount > 0 && (
                  <div className="mt-2 p-2 flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    <span className="text-lighttext dark:text-darkBg">
                      {likeCount}명이 좋아합니다
                    </span>
                  </div>
                )}

                {/* 댓글 입력 - 인풋 오른쪽 바깥에 원형 버튼, 호버 시만 배경 */}
                <form onSubmit={handleSubmitComment} className="p-2 flex items-center gap-2">
                  <input
                    type="text"
                    name="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    readOnly={commentsLoading}
                    className="form-input w-full p-1.5 focus:p-2 transition-all duration-200 h-8 text-lighttext dark:text-darkBg placeholder:text-gray-500 dark:placeholder:text-gray-500"
                  />
                  <button
                    type="submit"
                    className={`w-8 h-8 p-0 flex-shrink-0 flex items-center justify-center rounded-full bg-transparent hover:bg-lightGold dark:hover:bg-darkOrange transition-colors ${
                      commentsLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="댓글 작성"
                    disabled={commentsLoading}
                    tabIndex={-1}
                  >
                    <Send className="w-4 h-4 text-lighttext dark:text-darkBg" />
                  </button>
                </form>

                {/* 댓글 목록 */}
                <div className="overflow-y-auto flex-grow">
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <Comment
                        key={comment.id || comment.comment_id}
                        diaryId={diaryId}
                        comment={comment}
                        likedComments={{}}
                        changeLikeButtonColor={() => {}}
                        onDeleteComment={handleDeleteComment}
                        onEditComment={handleEditComment}
                      />
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      아직 댓글이 없습니다.
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