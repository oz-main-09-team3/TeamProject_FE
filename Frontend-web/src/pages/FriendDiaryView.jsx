import React, { useState, useEffect } from "react";
import testimage from "../assets/profile.png";
import useComments from "../hooks/useComments";
import { formatDate } from "../utils/dateUtils";
import Comment from "../components/diary/Comment";
import { ChevronLeft, Send } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const FriendDiaryView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //친구 아이디와 다이어리 아이디를 location.state로부터 받는 코드임
  const friendId = location.state?.friendId;
  const diaryId = location.state?.diaryId;

  const {
    fetchCommentData,
    comments,
    newComment,
    setNewComment,
    handleSubmitComment,
  } = useComments(friendId, diaryId); //친구 다이어리용 API 연동

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

  useEffect(() => {
    if (!friendId || !diaryId) {
      console.error("❌ 친구 ID 또는 다이어리 ID 없음");
      return;
    }
    console.log("댓글 불러오기 요청 시도");
    fetchCommentData()
      .then(() => console.log("댓글 불러오기 완료"))
      .catch((err) => console.error("❌ 댓글 불러오기 실패:", err));
  }, [fetchCommentData]);

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
            {/* 일기 내용 (테스트용) */}
            <div className="md:w-2/3 w-full flex flex-col">
              <div className="flex justify-center mb-8">
                <div className="w-28 h-28 rounded-full flex justify-center items-center overflow-hidden relative">
                  <img
                    src={testimage}
                    alt="현재 기분"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-2xl font-bold mb-4 dark:text-darkBg">
                {formatDate()}
              </div>

              <div className="w-full rounded-lg border border-lightGold dark:border-darkCopper shadow-sm p-5 dark:text-darkBg bg-white min-h-[320px]">
                <p>테스트</p>
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
                {comments.map((comment) => (
                  <Comment
                    key={comment.comment_id}
                    diaryId={diaryId}
                    comment={comment}
                    likedComments={likedComments}
                    changeLikeButtonColor={changeLikeButtonColor}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendDiaryView;