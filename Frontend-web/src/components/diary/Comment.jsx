import React from "react";
import { Heart } from "lucide-react";
import useComments from "../../hooks/useComments";

const Comment = ({
  comment,
  diaryId,
  likedComments,
  changeLikeButtonColor,
}) => {
  const { handleLikeComment, handleDeleteComment } = useComments();
  function handleClickLikeButton(commentId) {
    //ui 업데이트 -> 페이지에서만 관리
    changeLikeButtonColor(commentId);
    //좋아요 등록 (api 호출) -> hook에서 관리
    handleLikeComment(commentId);
  }
  return (
    <div key={comment.comment_id} className="mb-4">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-gray-700">
              {comment.user_id}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-800">
              {comment.created_at.split("T")[0]}
            </span>
          </div>
          <p className="text-sm mb-2 text-gray-700 dark:text-gray-700">
            {comment.content}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleClickLikeButton(comment.comment_id, diaryId)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkOrange/80 transition-colors"
              title={
                likedComments[comment.comment_id] ? "좋아요 취소" : "좋아요"
              }
            >
              <Heart
                className={`w-4 h-4 ${
                  likedComments[comment.comment_id]
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500 dark:text-gray-800"
                }`}
              />
            </button>
            <button
              onClick={() => handleDeleteComment(comment.comment_id, diaryId)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkOrange/80 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;

