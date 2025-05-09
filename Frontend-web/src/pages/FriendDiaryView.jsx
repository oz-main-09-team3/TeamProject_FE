import React from "react";
import testimage from "../assets/profile.png";
import useComments from "../hooks/useComments";
import useReplies from "../hooks/useReplies";
import { formatDate } from "../utils/dateUtils";
import DiaryHeader from "../components/diary/DiaryHeader";
import Comment from "../components/diary/Comment";
import Reply from "../components/diary/Reply";

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
    toggleReplies
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

  const handleGoBack = () => {
    console.log("뒤로가기");
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
    />
  );

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full mx-auto shadow-xl p-10 font-sans rounded-2xl border-4 border-lightGold dark:border-darkOrange bg-yl100 dark:bg-darktext text-lighttext dark:text-darktext transition-colors duration-300">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="md:w-2/3 w-full flex flex-col">
            <DiaryHeader onGoBack={handleGoBack} />

            <div className="flex justify-center mb-8">
              <div className="w-28 h-28 rounded-full flex justify-center items-center overflow-hidden relative">
                <div className="absolute inset-0 rounded-full "></div>
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
            <div className="overflow-y-auto flex-grow">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  replyingTo={replyingTo}
                  replyingToReply={replyingToReply}
                  newReply={newReply}
                  setNewReply={setNewReply}
                  handleReplyClick={handleReplyClick}
                  handleReplyToReplyClick={handleReplyToReplyClick}
                  handleSubmitReply={(e) => handleSubmitReply(e, comment.id, comments, setComments, showReplies, setShowReplies)}
                  showReplies={showReplies}
                  toggleReplies={toggleReplies}
                  renderReply={renderReply}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendDiaryView;