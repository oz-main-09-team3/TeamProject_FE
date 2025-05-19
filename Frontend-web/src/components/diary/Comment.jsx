import React from "react";
import { Heart } from "lucide-react";
// useComments 훅 import 제거 - 더 이상 여기서는 필요하지 않음

const Comment = ({ comment, diaryId, friendId, likedComments, changeLikeButtonColor, onDeleteComment }) => {
  // useComments 훅 호출 제거

  function handleClickLikeButton(commentId) {
    changeLikeButtonColor(commentId);
  }

  function handleClickDeleteButton(commentId) {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      onDeleteComment(commentId); // 부모 컴포넌트에서 전달받은 함수 사용
    }
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
              onClick={() => handleClickLikeButton(comment.comment_id)}
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
              onClick={() => handleClickDeleteButton(comment.comment_id)}
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