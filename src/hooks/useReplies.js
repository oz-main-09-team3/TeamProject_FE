import { useState } from 'react';

/**
 * 답글 관리를 위한 커스텀 훅
 * @returns {Object} 답글 관련 상태와 함수들
 */
const useReplies = () => {
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToReply, setReplyingToReply] = useState(null);

  const handleReplyClick = (commentId) => {
    if (replyingToReply) {
      setReplyingToReply(null);
    }
    
    if (replyingTo === commentId && !replyingToReply) {
      setReplyingTo(null);
    } else {
      setReplyingTo(commentId);
      setNewReply('');
    }
  };
  
  const handleReplyToReplyClick = (commentId, replyId) => {
    if (replyingTo && !replyingToReply) {
      setReplyingTo(null);
    }
    
    if (replyingTo === commentId && replyingToReply === replyId) {
      setReplyingToReply(null);
    } else {
      setReplyingTo(commentId);
      setReplyingToReply(replyId);
      setNewReply('');
    }
  };

  const handleSubmitReply = (e, commentId, comments, setComments, showReplies, setShowReplies) => {
    e.preventDefault();
    if (newReply.trim() === '') return;
    
    const newReplyObj = {
      id: Date.now(),
      profileImg: null,
      text: newReply,
      userNickname: "나",
      timestamp: "방금 전",
      parentId: replyingToReply 
    };
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReplyObj]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setNewReply('');
    setReplyingTo(null);
    setReplyingToReply(null);
    
    setShowReplies(prev => ({
      ...prev,
      [commentId]: true
    }));
  };

  return {
    newReply,
    replyingTo,
    replyingToReply,
    setNewReply,
    handleReplyClick,
    handleReplyToReplyClick,
    handleSubmitReply
  };
};

export default useReplies; 