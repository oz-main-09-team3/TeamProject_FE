import { useState, useEffect } from 'react';

/**
 * 댓글 관리를 위한 커스텀 훅
 * @returns {Object} 댓글 관련 상태와 함수들
 */
const useComments = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      profileImg: null,
      text: "멋져용 멋져용.",
      userNickname: "띠리링톡톰",
      timestamp: "5분 전",
      liked: false,
      replies: [
        {
          id: 101,
          profileImg: null,
          text: "엉 '아, 맞다'",
          userNickname: "엄머터틀",
          timestamp: "3분 전",
          parentId: null,
          liked: false
        },
        {
          id: 102,
          profileImg: null,
          text: "엉'힝계구리'",
          userNickname: "엄머터틀",
          timestamp: "2분 전",
          parentId: 101,
          liked: false
        }
      ]
    },
    {
      id: 2,
      profileImg: null,
      text: "헉 뭐 와!",
      userNickname: "김콩팥",
      timestamp: "10분 전",
      liked: false,
      replies: []
    },
    {
      id: 3,
      profileImg: null,
      text: "맞돌림지마!",
      userNickname: "김콩팥",
      timestamp: "15분 전",
      liked: false,
      replies: []
    },
    {
      id: 4,
      profileImg: null,
      text: "멋져용 멋져용.",
      userNickname: "띠리링톡톰",
      timestamp: "20분 전",
      liked: false,
      replies: []
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [showReplies, setShowReplies] = useState({});

  useEffect(() => {
    const initialShowRepliesState = {};
    comments.forEach(comment => {
      initialShowRepliesState[comment.id] = false;
    });
    setShowReplies(initialShowRepliesState);
  }, []);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const newCommentObj = {
      id: Date.now(),
      profileImg: null,
      text: newComment,
      userNickname: "나",
      timestamp: "방금 전",
      liked: false,
      replies: []
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return {
    comments,
    newComment,
    showReplies,
    setNewComment,
    handleSubmitComment,
    toggleReplies
  };
};

export default useComments; 