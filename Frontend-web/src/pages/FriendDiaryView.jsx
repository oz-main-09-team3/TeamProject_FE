import React, { useState } from "react";
import testimage from "../assets/profile.png";
import useComments from "../hooks/useComments";
import useReplies from "../hooks/useReplies";
import { formatDate } from "../utils/dateUtils";
import Comment from "../components/diary/Comment";
import Reply from "../components/diary/Reply";
import Modal from "../components/Modal";
import { ChevronLeft, Heart, Reply as ReplyIcon, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * 친구 일기 보기 페이지 컴포넌트
 * @returns {JSX.Element} 친구 일기 보기 페이지
 */
const FriendDiaryView = () => {
  const {
    comments,
    newComment,
    showReplies,
    setNewComment,
    handleSubmitComment,
    toggleReplies,
    setComments
  } = useComments();

  const {
    newReply,
    replyingTo,
    replyingToReply,
    setNewReply,
    handleReplyClick,
    handleReplyToReplyClick,
    handleSubmitReply
  } = useReplies();

  const [likedComments, setLikedComments] = useState({});
  const [isReplying, setIsReplying] = useState(false);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLikeComment = (commentId) => {
    setLikedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      handleSubmitComment(e);
      setNewComment("");
    }
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    if (newReply.trim()) {
      handleSubmitReply(e, commentId, comments, setComments, showReplies, setShowReplies);
      setNewReply("");
      setIsReplying(false);
      handleReplyClick(null);
    }
  };

  const handleReplyButtonClick = (commentId) => {
    setIsReplying(true);
    handleReplyClick(commentId);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setNewReply("");
    handleReplyClick(null);
  };

  const renderReply = (reply, commentId, level = 0) => (
    <Reply
      key={reply.id}
      reply={reply}
      commentId={commentId}
      level={level}
      replyingTo={replyingTo}
      replyingToReply={replyingToReply}
      newReply={newReply}
      setNewReply={setNewReply}
      handleReplyToReplyClick={handleReplyToReplyClick}
      handleSubmitReply={(e) => handleSubmitReply(e, commentId, comments, setComments, showReplies, setShowReplies)}
      comments={comments}
    >
      <img src={reply.profileImg || testimage} alt="프로필" className="w-full h-full object-cover" />
    </Reply>
  );

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
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="md:w-2/3 w-full flex flex-col">
              <div className="flex justify-center mb-8">
                <div className="w-28 h-28 rounded-full flex justify-center items-center overflow-hidden relative">
                  <div className="absolute inset-0 rounded-full"></div>
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

            <div className="md:w-1/3 w-full flex flex-col gap-4 border-t md:border-t-0 md:border-l dark:text- border-lightGold dark:border-darkCopper pt-6 md:pt-0 md:pl-5 bg-yl100 dark:bg-darktext">
              <h3 className="text-lg font-medium dark:text-darkBg">댓글</h3>
              
              {/* 댓글 입력 폼 - 답글 작성 중이 아닐 때만 표시 */}
              {!isReplying && (
                <form onSubmit={handleCommentSubmit} className="mb-4">
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
              )}

              <div className="overflow-y-auto flex-grow">
                {comments.map((comment) => (
                  <div key={comment.id} className="mb-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-700">{comment.userNickname}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-800">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm mb-2 text-gray-700 dark:text-gray-700">{comment.text}</p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkOrange/80 transition-colors"
                            title={likedComments[comment.id] ? "좋아요 취소" : "좋아요"}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                likedComments[comment.id] ? "fill-red-500 text-red-500" : "text-gray-500 dark:text-gray-800"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => handleReplyButtonClick(comment.id)}
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkOrange/80 transition-colors"
                            title="답글쓰기"
                          >
                            <ReplyIcon className="w-4 h-4 text-gray-500 dark:text-gray-800" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 답글 입력 폼 - 해당 댓글에 대한 답글 작성 중일 때만 표시 */}
                    {replyingTo === comment.id && (
                      <div className="ml-6 mt-2">
                        <form
                          onSubmit={(e) => handleReplySubmit(e, comment.id)}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="답글을 입력하세요..."
                            className="flex-1 px-3 py-1 text-sm rounded-full bg-white text-lighttext dark:text-darkbg focus:outline-none focus:ring-2 focus:ring-lightGold dark:focus:ring-darkOrange border border-white"
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="p-1.5 rounded-full hover:bg-lightGold dark:hover:bg-darkOrange/80 transition-colors"
                              title="답글 작성"
                            >
                              <Send className="w-4 h-4 text-gray-500 dark:text-gray-800" />
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {showReplies[comment.id] && comment.replies && (
                      <div className="ml-6 mt-2 space-y-2">
                        {comment.replies.map((reply) => renderReply(reply, comment.id))}
                      </div>
                    )}
                  </div>
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