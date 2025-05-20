import React, { useState, useEffect } from "react";
import { formatDate } from "../utils/dateUtils";
import Comment from "../components/Comment";
import { Send, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchFriendDiaryDetail } from "../service/friendDiaryApi";
import { addLike, removeLike } from "../service/likeApi";
import useComments from "../hooks/useComments"; // 커스텀 훅 import
import { useLike } from "../hooks/useLike";
import BackButton from "../components/BackButton"; // 추가된 import
import ActionButton from "../components/ActionButton";
import FormInput from "../components/FormInput";
import { getMyInfo } from "../service/userApi";
import useUiStore from "../store/uiStore";

const FriendDiaryView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useUiStore();

  // 친구 아이디와 다이어리 아이디를 location.state로부터 받는 코드임
  const friendId = location.state?.friendId;
  const diaryId = location.state?.diaryId;
  
  // 일기 상세 데이터 상태 추가
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // 이미지 URL 상태 추가
  const [likeCount, setLikeCount] = useState(0);
  
  // 좋아요 상태 관리
  const [likedComments, setLikedComments] = useState({});
  const [diaryItems, setDiaryItems] = useState([]);
  const { handleLike, loadingId, animatingId } = useLike(diaryItems, setDiaryItems);

  // useComments 훅 사용
  const {
    comments,
    loading: commentsLoading,
    newComment,
    setNewComment,
    setInitialComments,
    handleLikeComment,
    handleUpdateComment,
    handleDeleteComment,
    handleSubmitComment
  } = useComments(friendId, diaryId);

  const changeLikeButtonColor = (commentId) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    
    // 좋아요 토글 함수 호출
    handleLikeComment(commentId);
  };
  
  // 일기 좋아요 토글 함수
  const handleDiaryLike = async (e) => {
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
  
  // 이모지 이미지 URL을 완전한 URL로 변환
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // 이미 http나 https로 시작하는 절대 URL인 경우 그대로 반환
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // `/static/` 등으로 시작하는 상대 경로인 경우 백엔드 URL 추가
    // 환경 변수가 있다면 사용, 없다면 하드코딩된 URL 사용
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://handsomepotato.p-e.kr';
    return `${BACKEND_URL}${imageUrl}`;
  };
  
  // 일기 상세 데이터 가져오는 함수
  const fetchDiaryDetail = async () => {
    if (!friendId || !diaryId) {
      console.error("❌ 친구 ID 또는 다이어리 ID 없음");
      setError("친구 ID 또는 다이어리 ID가 없습니다.");
      setLoading(false);
      return;
    }
    
    try {
      console.log(`친구 ID ${friendId}의 다이어리 ID ${diaryId} 상세 정보 요청`);
      const response = await fetchFriendDiaryDetail(friendId, diaryId);
      console.log("다이어리 상세 정보 응답:", response);
      
      if (response && response.data) {
        setDiary(response.data);
        console.log("다이어리 상세 정보 로드 완료:", response.data);
        
        // 댓글 데이터를 커스텀 훅으로 전달
        if (response.data.comments && Array.isArray(response.data.comments)) {
          console.log("다이어리에서 댓글 데이터 추출:", response.data.comments);
          setInitialComments(response.data.comments);
        }
        
        // emotion 객체 확인 및 로깅
        if (response.data.emotion) {
          console.log("이모션 정보:", response.data.emotion);
          console.log("이모션 ID:", response.data.emotion.id);
          
          // image_url 확인
          if (response.data.emotion.image_url) {
            const fullUrl = getFullImageUrl(response.data.emotion.image_url);
            console.log("원본 이모지 이미지 URL:", response.data.emotion.image_url);
            console.log("변환된 이모지 이미지 URL:", fullUrl);
            setImageUrl(fullUrl); // 이미지 URL 상태 업데이트
          }
        }
      } else {
        setError("다이어리 정보를 가져올 수 없습니다.");
        console.error("❌ 다이어리 데이터 없음:", response);
      }
    } catch (err) {
      setError("다이어리 정보를 불러오는 중 오류가 발생했습니다.");
      console.error("❌ 다이어리 상세 정보 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (!friendId || !diaryId) {
      console.error("❌ 친구 ID 또는 다이어리 ID 없음");
      return;
    }
    
    // 일기 상세 정보 로드 (댓글 포함)
    fetchDiaryDetail();
  }, [friendId, diaryId]);

  // 일기 데이터 로드 시 좋아요 상태도 함께 설정
  useEffect(() => {
    if (diary) {
      setDiaryItems([{
        id: diaryId,
        liked: diary.liked || false
      }]);
      setLikeCount(diary.likeCount || 0);
    }
  }, [diary, diaryId]);

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">일기를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  // 기존 handleSubmitComment는 useComments에서 받아옴
  const handleSubmitCommentWithRefresh = async (e) => {
    e.preventDefault();

    try {
      await handleSubmitComment(e);
      await fetchDiaryDetail();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const checkAndUpdateComment = async (commentId, content) => {
  console.log("💬 댓글 수정 시작:", { 
    commentId, 
    content, 
    friendId, 
    diaryId,
    isFriendDiary: !!friendId
  });
  
  if (!friendId || !diaryId) {
    console.error("❌ 친구 ID 또는 다이어리 ID가 없습니다:", { friendId, diaryId });
    openModal('error', {
      title: '수정 실패',
      content: '친구 ID 또는 다이어리 ID를 찾을 수 없습니다.',
      confirmText: '확인'
    });
    return;
  }
  
  try {
    // 현재 로그인한 사용자의 정보를 가져옵니다
    console.log("사용자 정보 요청 중...");
    const myInfo = await getMyInfo();
    console.log("사용자 정보:", myInfo.data);
    const currentUserId = myInfo.data.id;
    console.log("현재 사용자 ID:", currentUserId);

    // 댓글 작성자 확인
    const comment = comments.find(c => c.id === commentId || c.comment_id === commentId);
    console.log("수정할 댓글 찾기:", { 
      찾는댓글ID: commentId, 
      찾은댓글: comment, 
      모든댓글수: comments.length
    });
    
    if (!comment) {
      console.error('❌ 댓글을 찾을 수 없습니다:', commentId);
      return;
    }

    // 댓글 작성자가 아닌 경우 수정 불가
    if (comment.user.id !== currentUserId) {
      console.error("❌ 권한 없음: 자신이 작성한 댓글만 수정할 수 있습니다.");
      openModal('error', {
        title: '권한 없음',
        content: '자신이 작성한 댓글만 수정할 수 있습니다.',
        confirmText: '확인'
      });
      return;
    }

    // 권한이 있는 경우 수정 진행 - useComments 훅의 handleUpdateComment 함수를 직접 호출
    // useComments 훅은 이미 friendId와 diaryId를 알고 있음
    console.log("✅ 권한 확인 완료, 댓글 수정 진행:", { commentId, content });
    await handleUpdateComment(commentId, content);
    console.log("✅ 댓글 수정 성공!");
    
    // 댓글 목록 새로고침
    console.log("댓글 목록 새로고침 시작");
    await fetchDiaryDetail();
    console.log("댓글 목록 새로고침 완료");
    
  } catch (error) {
    console.error('❌ 댓글 수정 중 오류:', error);
    console.error('❌ 오류 세부 정보:', error.response?.data || error.message);
    openModal('error', {
      title: '수정 실패',
      content: '댓글 수정에 실패했습니다: ' + (error.message || '알 수 없는 오류'),
      confirmText: '확인'
    });
  }
};

  return (
    <main style={{ fontFamily: "'GangwonEduSaeeum_OTFMediumA', sans-serif" }}>
      <div className="w-full max-w-4xl mx-auto shadow-xl p-6 font-sans rounded-2xl border-4 border-lightGold dark:border-darkOrange bg-yl100 dark:bg-darktext text-lighttext dark:text-darkbg transition-colors duration-300">
        <div className="flex flex-col gap-4">
          {/* 헤더 영역 */}
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
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* 일기 내용 */}
            <div className="md:w-1/2 w-full flex flex-col">
              <div className="flex justify-center mb-8">
                <div className="w-28 h-28 rounded-full flex justify-center items-center overflow-hidden relative bg-white">
                  {/* 이미지 URL 상태 변수 사용 */}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="일기 감정"
                      className="w-auto h-auto max-w-full max-h-full"
                      onError={(e) => {
                        console.error('이모지 이미지 로드 실패:', e.target.src);
                        e.target.style.display = 'none'; // 이미지 로드 실패 시 숨김
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="text-2xl font-bold mb-4 dark:text-darkBg font-['GangwonEduSaeeum_OTFMediumA']">
                {diary && diary.created_at 
                  ? formatDate(new Date(diary.created_at)) 
                  : formatDate()}
              </div>

              <div className="w-full rounded-lg border border-lightGold dark:border-darkCopper shadow-sm p-5 dark:text-darkBg bg-white min-h-[320px] font-['GangwonEduSaeeum_OTFMediumA'] flex flex-col justify-between">
                {/* 일기 내용 표시 */}
                <div className="mt-4 flex-1">
                  {diary && diary.content ? (
                    <p>{diary.content}</p>
                  ) : (
                    <p>내용이 없습니다.</p>
                  )}
                </div>
                {/* 작성자 정보: 박스 내부 하단 */}
                {diary && (
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
                )}
              </div>
            </div>

            {/* 댓글 영역 */}
            <div className="md:w-1/2 w-full flex flex-col gap-2 border-t md:border-t-0 md:border-l dark:text- border-lightGold dark:border-darkCopper md:pt-0 md:pl-5 bg-yl100 dark:bg-darktext">
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
              <form onSubmit={handleSubmitCommentWithRefresh} className="p-2 flex items-center gap-2">
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
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comment
                      key={comment.id || comment.comment_id}
                      diaryId={diaryId}
                      friendId={friendId}
                      comment={comment}
                      likedComments={likedComments}
                      changeLikeButtonColor={changeLikeButtonColor}
                      onUpdateComment={handleUpdateComment}
                      onDeleteComment={(commentId) => handleDeleteComment(commentId, diaryId, friendId)}
                      onEditComment={checkAndUpdateComment}
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
    </main>
  );
};

export default FriendDiaryView;