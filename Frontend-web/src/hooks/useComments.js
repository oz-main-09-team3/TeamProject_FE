import { useState, useEffect } from "react";

/**
 * 댓글 관리를 위한 커스텀 훅
 * @returns {Object} 댓글 관련 상태와 함수들
 */
const useComments = () => {
  const [comments, setComments] = useState([
    {
      comment_id: 156,
      user_id: 1234,
      content: "멋져용 멋져용.",
      created_at: "2025-05-16T10:54",
      updated_at: "333",
    },
    {
      comment_id: 144,
      user_id: 14444,
      content: "와와",
      created_at: "2025-05-17T10:54",
      updated_at: "5분 전",
    },
    {
      comment_id: 1233,
      user_id: 125566,
      content: "굳 굳.",
      created_at: "2025-05-18T10:54",
      updated_at: "5분 전",
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const fetchCommentData = async () => {
    // <댓글 조회>
    //1. 댓글 조회 api 호출해서 응답 확인 (콘솔로)
    //2. 필요한 부분만 setComment에 넣는다.
    //*response의 구조를 꼭 확인하고, 형식에 맞춰서 (배열)~ 넣어주기
  };

  //사용자가 댓글을 등록했을 때 실행되는 함수
  const handleSubmitComment = (e, diaryId) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    //<댓글 등록>
    //1. 댓글 등록 api 함수 payload 에 {content: newComment} 넣어줌 (명세서랑 api 함수 확인)
    //2. 등록을 했으니 다시 comments를 불러와야함. (= fetchComments 호출 )
    //원래는 어떤 페이지에 댓글을 작성했는지에 따라 각각 다른 api 를 호출하도록 분기 처리를 해주어야하는데, 지금 useComment를 사용하고 있는 다른 페이지가 없으므로 일단 그냥 작성..
    //리팩토링할때 handleSubmitComment의 매개변수로 현재 페이지가 어디인지 받아와서 그거따라 각각 다른 api 호출하도록 수정하세요.
    //hook을 사용하는 이유 !!!!!!!!!! 한페이지에서만 사용할거면 굳이 hook 쓸 필요 없음

    setNewComment("");
  };

  const handleDeleteComment = (commentId, diaryId) => {
    //<댓글 삭제>
    //1. 댓글 삭제 api 호출
  };
  const handleLikeComment = (commentId, diaryId) => {
    //<댓글 좋아요>
    //1. 좋아요 api 호출
  };

  return {
    comments,
    newComment,
    setNewComment,
    handleLikeComment,
    handleDeleteComment,
    handleSubmitComment,
  };
};

export default useComments;
