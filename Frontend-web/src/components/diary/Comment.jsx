import React from 'react';
import keyboardReturn from "../../assets/keyboard_return.png";
import likeButton from "../../assets/like_button.png";
import sendIcon from "../../assets/Send.png";
import { getReplyParentUserNickname, organizeReplies } from '../../utils/replyUtils';

/**
 * 댓글 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @returns {JSX.Element} 댓글 컴포넌트
 */
const Comment = ({
  comment,
  replyingTo,
  replyingToReply,
  newReply,
  setNewReply,
  handleReplyClick,
  handleReplyToReplyClick,
  handleSubmitReply,
  showReplies,
  toggleReplies,
  renderReply
}) => {
  return (
    <div className="mb-4 border border-gray-100 dark:border-darkCopper rounded-lg p-3 bg-lightBg dark:bg-darkBg">
      <div className="pb-3">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {comment.profileImg ? (
              <img
                src={comment.profileImg}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm">
                {comment.userNickname}
              </span>
              <div className="flex gap-2">
                {replyingTo !== comment.id && (
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleReplyClick(comment.id)}
                  >
                    <img src={keyboardReturn} alt="답글" className="w-5 h-5" />
                  </button>
                )}
                <button className="text-gray-400 hover:text-gray-600">
                  <img src={likeButton} alt="좋아요" className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm mb-1">{comment.text}</p>
            <span className="text-xs text-gray-400">
              {comment.timestamp}
            </span>
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <button 
            className="text-gray-500 hover:text-gray-700 text-sm pl-10 mt-2"
            onClick={() => toggleReplies(comment.id)}
          >
            {showReplies[comment.id] 
              ? "답글 숨기기" 
              : `답글 ${comment.replies.length}개 보기`}
          </button>
        )}
      </div>

      {replyingTo === comment.id && !replyingToReply && (
        <div className="pl-10 mb-3 border-t border-gray-100 pt-3">
          <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="flex items-center gap-2">
            <div className="min-w-8 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm"
              placeholder={`${comment.userNickname}님에게 답글 작성...`}
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
            />
            <button 
              type="submit" 
              className="min-w-8 w-8 h-8 flex items-center justify-center flex-shrink-0"
            >
              <img src={sendIcon} alt="답글 달기" className="w-6 h-6" />
            </button>
          </form>
        </div>
      )}

      {showReplies[comment.id] && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 pl-8 border-t border-gray-100 pt-3">
          {organizeReplies(comment.replies).map(reply => 
            renderReply(reply, comment.id)
          )}
        </div>
      )}
    </div>
  );
};

export default Comment; 