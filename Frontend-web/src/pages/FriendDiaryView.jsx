import React, { useState, useEffect } from "react";
import useComments from "../hooks/useComments";
import { formatDate } from "../utils/dateUtils";
import Comment from "../components/diary/Comment";
import { ChevronLeft, Send } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchFriendDiaryDetail } from "../service/friendDiaryApi";

const FriendDiaryView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 친구 아이디와 다이어리 아이디를 location.state로부터 받는 코드임
  const friendId = location.state?.friendId;
  const diaryId = location.state?.diaryId;
  
  // 일기 상세 데이터 상태 추가
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // 이미지 URL 상태 추가

  const {
    fetchCommentData,
    comments,
    newComment,
    setNewComment,
    handleSubmitComment,
  } = useComments(friendId, diaryId); // 친구 다이어리용 API 연동

  const [likedComments, setLikedComments] = useState({});

  const handleGoBack = () => {
    navigate(-1);
  };

  const changeLikeButtonColor = (commentId) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
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
    
    // 일기 상세 정보 로드
    fetchDiaryDetail();
    
    // 댓글 정보 로드
    console.log("댓글 불러오기 요청 시도");
    fetchCommentData()
      .then(() => console.log("댓글 불러오기 완료"))
      .catch((err) => console.error("❌ 댓글 불러오기 실패:", err));
  }, [fetchCommentData, friendId, diaryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("댓글 등록 시도:", newComment);
    try {
      await handleSubmitComment(e);
      console.log("댓글 등록 완료");
    } catch (err) {
      console.error("❌ 댓글 등록 실패:", err);
    }
  };

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

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-6xl mx-auto shadow-xl p-10 font-sans rounded-2xl border-4 border-lightGold dark:border-darkOrange bg-yl100 dark:bg-darktext text-lighttext dark:text-darkbg transition-colors duration-300">
        <div className="flex flex-col gap-6">
          {/* ← 뒤로가기 버튼 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleGoBack}
                className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            {/* 일기 내용 */}
            <div className="md:w-2/3 w-full flex flex-col">
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

              <div className="text-2xl font-bold mb-4 dark:text-darkBg">
                {diary && diary.created_at 
                  ? formatDate(new Date(diary.created_at)) 
                  : formatDate()}
              </div>

              <div className="w-full rounded-lg border border-lightGold dark:border-darkCopper shadow-sm p-5 dark:text-darkBg bg-white min-h-[320px]">
                {/* 일기 내용 표시 */}
                {diary && diary.content ? (
                  <p>{diary.content}</p>
                ) : (
                  <p>내용이 없습니다.</p>
                )}
              </div>
            </div>

            {/* 댓글 영역 */}
            <div className="md:w-1/3 w-full flex flex-col gap-4 border-t md:border-t-0 md:border-l dark:text- border-lightGold dark:border-darkCopper pt-6 md:pt-0 md:pl-5 bg-yl100 dark:bg-darktext">
              <h3 className="text-lg font-medium dark:text-darkBg">댓글</h3>

              {/* 댓글 입력 */}
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 px-4 py-2 rounded-full bg-white text-lighttext dark:text-darkbg focus:outline-none focus:ring-2 focus:ring-lightGold dark:focus:ring-darkOrange border border-white"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-darkOrange/80 transition-colors"
                    title="댓글 작성"
                  >
                    <Send className="w-4 h-4 text-gray-500 dark:text-gray-800" />
                  </button>
                </div>
              </form>

              {/* 댓글 목록 */}
              <div className="overflow-y-auto flex-grow">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comment
                      key={comment.comment_id}
                      diaryId={diaryId}
                      comment={comment}
                      likedComments={likedComments}
                      changeLikeButtonColor={changeLikeButtonColor}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    아직 댓글이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendDiaryView;