import React, { useState, useEffect } from "react";
import testimage from "../assets/profile.png";
import keyboardReturn from "../assets/keyboard_return.png";
import likeButton from "../assets/like_button.png";
import sendIcon from "../assets/Send.png";

const FriendDiaryView = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      profileImg: null,
      text: "멋져용 멋져용.",
      userNickname: "띠리링톡톰",
      timestamp: "5분 전",
      replies: [
        {
          id: 101,
          profileImg: null,
          text: "엉 '아, 맞다'",
          userNickname: "엄머터틀",
          timestamp: "3분 전",
          parentId: null
        },
        {
          id: 102,
          profileImg: null,
          text: "엉'힝계구리'",
          userNickname: "엄머터틀",
          timestamp: "2분 전",
          parentId: 101 
        }
      ]
    },
    {
      id: 2,
      profileImg: null,
      text: "헉 뭐 와!",
      userNickname: "김콩팥",
      timestamp: "10분 전",
      replies: []
    },
    {
      id: 3,
      profileImg: null,
      text: "맞돌림지마!",
      userNickname: "김콩팥",
      timestamp: "15분 전",
      replies: []
    },
    {
      id: 4,
      profileImg: null,
      text: "멋져용 멋져용.",
      userNickname: "띠리링톡톰",
      timestamp: "20분 전",
      replies: []
    },
  ]);
  
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); 
  const [replyingToReply, setReplyingToReply] = useState(null); 
  const [showReplies, setShowReplies] = useState({}); 
  const moodImageSrc = testimage;
  
  useEffect(() => {
    const initialShowRepliesState = {};
    comments.forEach(comment => {
      initialShowRepliesState[comment.id] = false;
    });
    setShowReplies(initialShowRepliesState);
  }, []);

  const formatDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const handleGoBack = () => {
    console.log("뒤로가기");
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const newCommentObj = {
      id: Date.now(),
      profileImg: null,
      text: newComment,
      userNickname: "나",
      timestamp: "방금 전",
      replies: []
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleReplyClick = (commentId) => {
    if (replyingToReply) {
      setReplyingToReply(null);
    }
    
    if (replyingTo === commentId && !replyingToReply) {
      setReplyingTo(null);
    } else {
      setReplyingTo(commentId);
      setNewReply('');
      
      if (!showReplies[commentId] && comments.find(c => c.id === commentId)?.replies.length > 0) {
        setShowReplies(prev => ({
          ...prev,
          [commentId]: true
        }));
      }
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
  
  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };
  
  const getReplyParentUserNickname = (reply, replies) => {
    if (!reply.parentId) return null;
    const parentReply = replies.find(r => r.id === reply.parentId);
    return parentReply ? parentReply.userNickname : null;
  };

  const handleSubmitReply = (e, commentId) => {
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

  const organizeReplies = (replies) => {
    if (!replies || replies.length === 0) return [];
    
    const topLevelReplies = replies.filter(reply => !reply.parentId);
    
    const nestedReplies = topLevelReplies.map(reply => {
      return {
        ...reply,
        children: buildReplyTree(reply.id, replies)
      };
    });
    
    return nestedReplies;
  };
  
  const buildReplyTree = (parentId, allReplies) => {
    if (!allReplies || allReplies.length === 0) return [];
    
    const childReplies = allReplies.filter(reply => reply.parentId === parentId);
    
    return childReplies.map(reply => {
      return {
        ...reply,
        children: buildReplyTree(reply.id, allReplies)
      };
    });
  };

  const renderReply = (reply, commentId, level = 0) => {
    const isReplying = replyingTo === commentId && replyingToReply === reply.id;
    const parentUserNickname = reply.parentId ? 
      getReplyParentUserNickname(reply, comments.find(c => c.id === commentId)?.replies || []) : null;
    
    return (
      <div key={reply.id} className="mb-3">
        <div className={`flex items-start gap-2 mb-2 ${level > 0 ? 'pl-' + (level * 8) : ''}`}>
          <div className="min-w-8 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {reply.profileImg ? (
              <img src={reply.profileImg} alt="프로필" className="w-full h-full object-cover" />
            ) : (
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
            )}
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
            
            <div className="text-sm mb-2">
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
                className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm"
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
        
        {reply.children && reply.children.map(childReply => 
          renderReply(childReply, commentId, level + 1)
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full mx-auto shadow-xl p-10 font-sans rounded-2xl border-4 border-lightGold dark:border-darkOrange bg-yl100 dark:bg-darktext text-lighttext dark:text-darktext transition-colors duration-300">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="md:w-2/3 w-full flex flex-col">
            <div className="mb-8 flex justify-between items-center">
              <button
                className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full text-lg w-10 h-10 flex items-center justify-center"
                onClick={handleGoBack}
              >
                ←
              </button>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="p-2 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="w-28 h-28 rounded-full flex justify-center items-center overflow-hidden relative">
                <div className="absolute inset-0 rounded-full "></div>
                <img
                  src={moodImageSrc}
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
                <div
                  key={comment.id}
                  className="mb-4 border border-gray-100 dark:border-darkCopper rounded-lg p-3 bg-lightBg dark:bg-darkBg"
                >
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendDiaryView;