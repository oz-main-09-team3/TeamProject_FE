import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import testimage from "../assets/profile.png";
import { ChevronLeft, Pencil, Trash2, Heart, Reply as ReplyIcon, Send, X } from "lucide-react";
import useComments from "../hooks/useComments";
import useReplies from "../hooks/useReplies";
import { useLike } from "../hooks/useLike";

const DiaryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [diary, setDiary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

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

  // 일기 좋아요 훅
  const { handleLike: handleDiaryLike, loadingId: diaryLoadingId } = useLike(
    diary ? [diary] : [],
    (newItems) => setDiary(newItems[0])
  );

  // 댓글 좋아요 훅
  const { handleLike: handleCommentLike, loadingId: commentLoadingId } = useLike(
    comments,
    setComments
  );

  useEffect(() => {
    // TODO: API 연동 후 실제 데이터 fetch로 교체
    if (location.state?.diary) {
      setDiary(location.state.diary);
    } else {
      // 테스트용 더미 데이터
      setDiary({
        id: 1,
        title: "테스트 일기",
        content: "이것은 나의 일기 상세페이지 테스트용 일기입니다.",
        date: new Date().toLocaleDateString(),
        liked: false
      });
    }
  }, [id, navigate, location]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleConfirmEdit = () => {
    setIsEditModalOpen(false);
    navigate(`/diary/edit/${id}`);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // TODO: API 연동 후 실제 삭제 로직으로 교체
      await new Promise(resolve => setTimeout(resolve, 500)); // 임시 딜레이
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err) {
      alert("삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate(-1);
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
    <div key={reply.id} className="ml-6 mt-2">
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-full overflow-hidden">
          <img src={reply.profileImg || testimage} alt="프로필" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-gray-700">{reply.userNickname}</span>
            <span className="text-xs text-gray-500">{reply.timestamp}</span>
          </div>
          <p className="text-sm mb-2 text-gray-700">{reply.text}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => handleCommentLike(reply.id, e)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title={reply.liked ? "좋아요 취소" : "좋아요"}
              disabled={commentLoadingId === reply.id}
            >
              <Heart
                className={`w-4 h-4 ${
                  reply.liked ? "fill-red-500 text-red-500" : "text-gray-500"
                }`}
              />
            </button>
            {level < 2 && (
              <button
                onClick={() => handleReplyToReplyClick(reply.id, commentId)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                title="답글쓰기"
              >
                <ReplyIcon className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 대댓글 입력 폼 */}
      {replyingToReply === reply.id && (
        <div className="ml-6 mt-2">
          <form
            onSubmit={(e) => handleReplySubmit(e, commentId)}
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
              <button
                type="button"
                onClick={handleCancelReply}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkOrange/80 transition-colors"
                title="취소"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-800" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 대댓글 표시 */}
      {reply.replies && reply.replies.length > 0 && (
        <div className="ml-6 mt-2 space-y-2">
          {reply.replies.map((nestedReply) => renderReply(nestedReply, commentId, level + 1))}
        </div>
      )}
    </div>
  );

  if (!diary) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

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
                onClick={(e) => handleDiaryLike(diary.id, e)}
                className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors"
                title={diary.liked ? "좋아요 취소" : "좋아요"}
                disabled={diaryLoadingId === diary.id}
              >
                <Heart
                  className={`w-5 h-5 ${
                    diary.liked ? "fill-red-500 text-red-500" : "text-gray-500 dark:text-gray-800"
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
                {diary.date}
              </div>

              <div className="w-full rounded-lg border border-lightGold dark:border-darkCopper shadow-sm p-5 dark:text-darkBg bg-white min-h-[320px]">
                <div className="mt-4">
                  <div className="font-bold text-xl mb-4">{diary.title}</div>
                  <div className="text-gray-700 dark:text-gray-300">{diary.content}</div>
                </div>
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
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src={comment.profileImg || testimage} alt="프로필" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-700">{comment.userNickname}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm mb-2 text-gray-700">{comment.text}</p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => handleCommentLike(comment.id, e)}
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkOrange/80 transition-colors"
                            title={comment.liked ? "좋아요 취소" : "좋아요"}
                            disabled={commentLoadingId === comment.id}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                comment.liked ? "fill-red-500 text-red-500" : "text-gray-500 dark:text-gray-800"
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
                            <button
                              type="button"
                              onClick={handleCancelReply}
                              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkOrange/80 transition-colors"
                              title="취소"
                            >
                              <X className="w-4 h-4 text-gray-500 dark:text-gray-800" />
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

      {/* 삭제 확인 모달 */}
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