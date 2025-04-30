import React, { useState } from "react";
import testimage from "../assets/profile.png";
import returnIcon from "../assets/keyboard_return.png";
import likeIcon from "../assets/like_button.png";

const FriendDiaryView = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      profileImg: null,
      text: "멋져용 멋져용.",
      userNickname: "띠리링톡톰",
      timestamp: "5분 전",
    },
    {
      id: 2,
      profileImg: null,
      text: "헉 뭐 와!",
      userNickname: "김콩팥",
      timestamp: "10분 전",
    },
    {
      id: 3,
      profileImg: null,
      text: "맞돌림지마!",
      userNickname: "김콩팥",
      timestamp: "15분 전",
    },
    {
      id: 4,
      profileImg: null,
      text: "멋져용 멋져용.",
      userNickname: "띠리링톡톰",
      timestamp: "20분 전",
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const moodImageSrc = testimage;

  const formatDate = () => {
    const today = new Date();
    return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  };

  const handleGoBack = () => {
    console.log("뒤로가기");
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const newCommentObj = {
      id: comments.length + 1,
      profileImg: null,
      text: newComment,
      userNickname: "나",
      timestamp: "방금 전",
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen section-container">
      <div className="w-full max-w-6xl mx-auto shadow-xl p-10 font-sans rounded-2xl border-4 border-lightGold dark:border-darkOrange bg-yl100 dark:bg-darktext text-lighttext dark:text-darktext transition-colors duration-300">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="md:w-2/3 w-full flex flex-col">
            <div className="mb-8 flex justify-between items-center">
              <button className="back-button" onClick={handleGoBack}>
                ←
              </button>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500" aria-label="edit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500" aria-label="delete">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="emoji-select-wrapper">
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

            <div className="card-base min-h-[320px] border-lightGold dark:border-darkCopper">
              <p>테스트</p>
            </div>
          </div>

          <div className="md:w-1/3 w-full flex flex-col gap-4 border-t md:border-t-0 md:border-l border-lightGold dark:border-darkCopper pt-6 md:pt-0 md:pl-5 bg-yl100 dark:bg-darktext">
            <h3 className="text-lg font-medium dark:text-darkBg">댓글</h3>
            <div className="overflow-y-auto flex-grow">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="card-base mb-1 border border-gray-100 dark:border-darkCopper bg-lightBg dark:bg-darkBg"
                >
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
                          <button className="text-gray-400 hover:text-gray-600">
                            <img
                              src={returnIcon}
                              alt="댓글"
                              className="w-4 h-4"
                            />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <img
                              src={likeIcon}
                              alt="좋아요"
                              className="w-4 h-4"
                            />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            ⋯
                          </button>
                        </div>
                      </div>
                      <p className="text-sm mb-1">{comment.text}</p>
                      <span className="text-xs text-gray-400">
                        {comment.timestamp}
                      </span>
                    </div>
                  </div>
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
