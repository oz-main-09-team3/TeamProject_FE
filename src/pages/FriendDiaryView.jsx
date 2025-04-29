import React, { useState, useEffect } from 'react';
import testimage from '../assets/profile.png';

const FriendDiaryView = () => {
  const [comments, setComments] = useState([
    { 
      id: 1, 
      profileImg: null, 
      text: "멋져용 멋져용.", 
      userNickname: "띠리링톡톰",
      timestamp: "5분 전"
    },
    { 
      id: 2, 
      profileImg: null, 
      text: "헉 뭐 와!", 
      userNickname: "김콩팥",
      timestamp: "10분 전" 
    },
    { 
      id: 3, 
      profileImg: null, 
      text: "맞돌림지마!", 
      userNickname: "김콩팥",
      timestamp: "15분 전" 
    },
    { 
      id: 4, 
      profileImg: null, 
      text: "멋져용 멋져용.", 
      userNickname: "띠리링톡톰",
      timestamp: "20분 전" 
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const moodImageSrc = testimage;

  const formatDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const handleGoBack = () => {
    console.log('뒤로가기');
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    
    const newCommentObj = {
      id: comments.length + 1,
      profileImg: null,
      text: newComment,
      userNickname: "나",
      timestamp: "방금 전"
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };

  return (
    <div className="flex max-w-6xl mx-auto h-screen bg-white font-sans">
      <div className="flex-grow p-5 flex flex-col">
        <div className="mb-8 flex justify-between items-center">
          <button 
            className="p-3 bg-gray-200 rounded-full text-lg w-10 h-10 flex items-center justify-center" 
            onClick={handleGoBack}
          >
            ←
          </button>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button className="p-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex mb-8 justify-center">
          <div className="w-28 h-28 rounded-full border-2 border-amber-700 flex justify-center items-center overflow-hidden relative">
            <div className="absolute inset-0 rounded-full border-4 border-amber-700"></div>
            <img 
              src={moodImageSrc} 
              alt="현재 기분" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="text-2xl font-bold mb-4">
          {formatDate()}
        </div>
        
        <div className="w-full rounded-lg border border-gray-200 shadow-sm mb-4 p-5 min-h-[320px]">
          <p>테스트</p>
        </div>
      </div>
      
      <div className="w-1/3 p-5 flex flex-col border-l border-gray-200">
        <h3 className="text-lg font-medium mb-4">댓글</h3>
        
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm"
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
        
        <div className="overflow-y-auto flex-grow">
          {comments.map((comment) => (
            <div key={comment.id} className="mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {comment.profileImg ? (
                    <img src={comment.profileImg} alt="프로필" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{comment.userNickname}</span>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm mb-1">{comment.text}</p>
                  <span className="text-xs text-gray-400">{comment.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendDiaryView;