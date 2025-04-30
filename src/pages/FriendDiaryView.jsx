import React, { useState, useEffect } from "react";
import testimage from "../assets/profile.png";

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
    <div className="max-w-6xl mx-auto pt-20 px-4 pb-20 font-sans bg-yl100 dark:bg-darktext text-lighttext dark:text-darktext transition-colors duration-300">
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
            <div className="w-28 h-28 rounded-full border-2 border-lightGold dark:border-darkOrange flex justify-center items-center overflow-hidden relative">
              <div className="absolute inset-0 rounded-full border-4 border-lightGold dark:border-darkOrange"></div>
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

          <div className="w-full rounded-lg border border-lightGold dark:border-darkCopper shadow-sm p-5 bg-white dark:bg-[#3b2b22]  min-h-[320px]">
            <p>테스트</p>
          </div>
        </div>

        <div className="md:w-1/3 w-full flex flex-col gap-4 border-t md:border-t-0 md:border-l dark:text- border-lightGold dark:border-darkCopper pt-6 md:pt-0 md:pl-5 bg-yl100 dark:bg-darktext">
          <h3 className="text-lg font-medium dark:text-darkBg">댓글</h3>
          <div className="overflow-y-auto flex-grow">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="mb-6 border border-gray-100 dark:border-darkCopper rounded-lg p-3 bg-lightBg dark:bg-darkBg"
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
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
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
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendDiaryView;
