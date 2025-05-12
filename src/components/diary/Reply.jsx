import React from 'react';
import keyboardReturn from "../../assets/keyboard_return.png";
import likeButton from "../../assets/like_button.png";
import sendIcon from "../../assets/Send.png";
import testimage from "../../assets/profile.png";
import { getReplyParentUserNickname } from '../../utils/replyUtils';

/**
 * 답글 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @returns {JSX.Element} 답글 컴포넌트
 */
const Reply = ({
  reply,
  commentId,
  level = 0,
  replyingTo,
  replyingToReply,
  newReply,
  setNewReply,
  handleReplyToReplyClick,
  handleSubmitReply,
  comments
}) => {
  const isReplying = replyingTo === commentId && replyingToReply === reply.id;
  const parentUserNickname = reply.parentId ? 
    getReplyParentUserNickname(reply, comments.find(c => c.id === commentId)?.replies || []) : null;

  return (
    <div className="mb-3">
      <div className={`flex items-start gap-2 mb-2 ${level > 0 ? 'pl-' + (level * 8) : ''}`}>
        <div className="min-w-8 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={reply.profileImg || testimage}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-sm">{reply.userNickname}</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
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
          
          <div className="text-sm mb-2 text-lighttext dark:text-darkBg">
            {parentUserNickname && (
              <span className="font-medium text-blue-500 mr-1">
                @{parentUserNickname}
              </span>
            )}
            {reply.text}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{reply.timestamp}</span>
            <div className="flex items-center gap-3">
              {!isReplying && (
                <button 
                  className="flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => handleReplyToReplyClick(commentId, reply.id)}
                >
                  <img src={keyboardReturn} alt="답글" className="w-5 h-5" />
                </button>
              )}
              <button className="flex items-center text-gray-400 hover:text-gray-600">
                <img src={likeButton} alt="좋아요" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isReplying && (
        <div className={`pl-${8 + level * 8} mt-2 mb-3`}>
          <form onSubmit={(e) => handleSubmitReply(e, commentId)} className="flex items-center gap-2">
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
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm text-lighttext dark:text-darkbg"
              placeholder={`${reply.userNickname}님에게 답글 작성...`}
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
    </div>
  );
};

export default Reply;