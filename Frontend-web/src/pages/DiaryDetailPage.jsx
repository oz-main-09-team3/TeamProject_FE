import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import { ChevronLeft, Pencil, Trash2, Heart } from "lucide-react";
import { fetchDiary, deleteDiary } from "../service/diaryApi";
import MarkdownRenderer from "../components/MarkdownRenderer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DiaryDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [diary, setDiary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDiaryDetail = async (diaryId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchDiary(diaryId);
      
      console.log("Diary detail response:", response);
      
      const diaryData = response.data || response;
      
      const formattedDiary = {
        diary_id: diaryData.diary_id,
        id: diaryData.diary_id,
        content: diaryData.content || "",
        date: new Date(diaryData.created_at).toLocaleDateString('ko-KR'),
        emotionId: diaryData.emotion?.emotion_id || 1,
        emotionText: diaryData.emotion?.emotion || "",
        emotionEmoji: diaryData.emotion?.emoji || "",
        emotionUrl: diaryData.emotion?.image_url || "",
        userId: diaryData.user?.user_id,
        userName: diaryData.user?.username,
        userNickname: diaryData.user?.nickname,
        userProfile: diaryData.user?.profile,
        liked: false, 
        likeCount: diaryData.like_count || 0,
        visibility: diaryData.visibility,
        images: diaryData.images || [],
        comments: diaryData.comments || [],
        createdAt: diaryData.created_at,
        updatedAt: diaryData.updated_at
      };
      
      console.log("Formatted diary:", formattedDiary);
      setDiary(formattedDiary);
    } catch (err) {
      console.error('일기 상세 조회 실패:', err);
      setError('일기를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDiaryDetail(id);
    } else if (location.state?.diary) {
      const passedDiary = location.state.diary;
      setDiary({
        ...passedDiary,
        diary_id: passedDiary.id || passedDiary.diary_id,
        content: passedDiary.body || passedDiary.content,
        date: passedDiary.createdAt ? new Date(passedDiary.createdAt).toLocaleDateString('ko-KR') : new Date().toLocaleDateString('ko-KR'),
        emotionId: passedDiary.emotionId,
        emotionUrl: passedDiary.emotionUrl,
      });
      setIsLoading(false);
    } else {
      navigate('/main');
    }
  }, [id, location.state, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleConfirmEdit = () => {
    setIsEditModalOpen(false);
    const diaryId = diary.diary_id || diary.id;
    navigate(`/diary/edit/${diaryId}`, { 
      state: { diary: diary } 
    });
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const diaryId = diary.diary_id || diary.id;
      await deleteDiary(diaryId);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error('일기 삭제 실패:', err);
      alert("삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/main');
  };

  const getEmojiSrc = (diary) => {
    console.log('getEmojiSrc called with:', {
      emotionId: diary.emotionId,
      emotionUrl: diary.emotionId.image_url
    });
    
    // emotionImageUrl이 있으면 우선 사용
    if (diary.emotionId.image_url) {
      // 상대 경로인 경우 BACKEND_URL과 결합
      const imageUrl = `${BACKEND_URL}${diary.emotionId.image_url}`;
      console.log('Using emotionImageUrl:', imageUrl);
      return imageUrl;
    }
    
    // emotionId로 경로 생성
    const numericId = Number(diary.emotionId);
    if (!isNaN(numericId) && numericId > 0) {
      const emojiPath = `${BACKEND_URL}/static/emotions/${numericId}.png`;
      console.log('Generated path from emotionId:', emojiPath);
      return emojiPath;
    }
    
    // 기본 이미지
    const defaultPath = `${BACKEND_URL}/static/emotions/1.png`;
    console.log('Using default path:', defaultPath);
    return defaultPath;
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

  if (!diary) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-gray-500">
          일기를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const handleDiaryLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 좋아요 기능 구현 예정
  };

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
                title={diary.liked ? "좋아요 취소" : "좋아요"}
              >
                <Heart
                  className={`w-5 h-5 ${
                    diary.liked
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
                onClick={() => setIsModalOpen(true)}
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
                    src={getEmojiSrc(diary)}
                    alt="현재 기분"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Emoji image failed to load:', e.target.src);
                      e.target.src = `${BACKEND_URL}/static/emotions/1.png`;
                    }}
                    onLoad={(e) => {
                      console.log('Emoji image loaded successfully:', e.target.src);
                    }}
                  />
                </div>
              </div>

              <div className="text-2xl font-bold mb-4 dark:text-darkBg">
                {diary.date}
              </div>

              <div className="w-full rounded-lg border border-lightGold dark:border-darkCopper shadow-sm p-5 dark:text-darkBg bg-white min-h-[320px]">
                <div className="mt-4">
                  <MarkdownRenderer 
                    content={diary.content} 
                    className="text-gray-700 dark:text-gray-300"
                  />
                  
                  {/* 이미지 표시 */}
                  {diary.images && diary.images.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {diary.images.map((image) => (
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
                      {diary.userProfile && (
                        <img 
                          src={diary.userProfile} 
                          alt={diary.userNickname} 
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium">{diary.userNickname}</div>
                        <div className="text-sm text-gray-500">@{diary.userName}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 좋아요 수 표시 */}
                  {diary.likeCount > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span>{diary.likeCount}명이 좋아합니다</span>
                    </div>
                  )}
                  
                  {/* 댓글 표시 (선택사항) */}
                  {diary.comments && diary.comments.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium mb-3">댓글 {diary.comments.length}개</h3>
                      {diary.comments.map((comment) => (
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="일기를 삭제하시겠습니까?"
        content="삭제된 일기는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        isDanger={true}
        loading={isDeleting}
      />
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        title="삭제 완료"
        content="일기가 삭제되었습니다."
        confirmText="확인"
        onConfirm={handleCloseSuccessModal}
        type="success"
      />
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        title="수정하시겠습니까?"
        content="일기를 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
      />
    </div>
  );
};

export default DiaryDetailPage;