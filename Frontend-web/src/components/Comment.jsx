import React from "react";
import { Heart, Trash2, Pencil } from "lucide-react";
import useUiStore from "../store/uiStore";

const SmallRoundButton = ({ icon: Icon, onClick, title, className = "", variant }) => {
  let base = "w-5 h-5 p-0.5 flex items-center justify-center rounded-full transition-colors bg-transparent";
  let iconColor = "text-lighttext dark:text-darkBg";
  if (variant === "danger") iconColor = "text-red-500";
  return (
    <button
      onClick={onClick}
      className={`${base} ${className}`}
      title={title}
      type="button"
    >
      <Icon className={`w-3 h-3 ${iconColor}`} />
    </button>
  );
};

const Comment = ({ comment, diaryId, friendId, likedComments, changeLikeButtonColor, onDeleteComment, onEditComment }) => {
  const { openModal } = useUiStore();
  const commentId = comment.id || comment.comment_id;

  function handleClickLikeButton() {
    changeLikeButtonColor(commentId);
  }

  function handleClickDeleteButton() {
    openModal('error', {
      title: '댓글 삭제',
      content: '댓글을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: () => onDeleteComment(commentId)
    });
  }

  function handleClickEditButton() {
    openModal('confirm', {
      title: '댓글 수정',
      content: '댓글을 수정하시겠습니까?',
      confirmText: '수정',
      cancelText: '취소',
      onConfirm: () => onEditComment(commentId, comment.content)
    });
  }

  return (
    <div className="w-full py-3 px-4 sm:py-4 sm:px-6 rounded-xl shadow-md border-2 border-lighttext/20 dark:border-darkBg/20 mb-2 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {comment.userProfile && (
            <img 
              src={comment.userProfile} 
              alt={comment.userNickname}
              className="w-7 h-7 rounded-full"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <span className="font-semibold text-sm text-lighttext dark:text-darkBg">
            {comment.userNickname || comment.user_id}
          </span>
          <span className="text-xs text-gray-500 dark:text-darkBg ml-1">
            @{comment.userName || comment.user_id}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-darkBg pr-4">
          {comment.created_at.split("T")[0]}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-base text-lighttext dark:text-darkBg break-all">
          {comment.content}
        </div>
        <div className="flex items-center gap-0 ml-2">
          <SmallRoundButton
            icon={Heart}
            onClick={handleClickLikeButton}
            title={likedComments[commentId] ? "좋아요 취소" : "좋아요"}
            className={
              (likedComments[commentId] ? "fill-red-500 text-red-500 border border-red-500 " : "") +
              "hover:bg-lighttext/10 dark:hover:bg-darkBg/20"
            }
          />
          <SmallRoundButton
            icon={Pencil}
            onClick={handleClickEditButton}
            title="수정"
            className="hover:bg-lighttext/10 dark:hover:bg-darkBg/20"
          />
          <SmallRoundButton
            icon={Trash2}
            onClick={handleClickDeleteButton}
            title="삭제"
            variant="danger"
            className="hover:bg-red-100 dark:hover:bg-red-900/30"
          />
        </div>
      </div>
    </div>
  );
};

export default Comment;