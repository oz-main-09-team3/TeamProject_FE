import { useState, useEffect, useCallback } from "react";
import {
  fetchFriendComments,
  createFriendComment,
  deleteFriendComment,
  updateFriendComment,
} from "../service/friendCommentApi";

/**
 * 댓글 관리를 위한 커스텀 훅 (친구 다이어리용)
 * @param {number} friendId - 친구 유저 ID
 * @param {number|string} diaryId - 해당 다이어리 ID
 * @returns 댓글 관련 상태와 함수들
 */
const useComments = (friendId, diaryId) => {
  const [comments, setComments] = useState([]); // 전체 댓글 목록
  const [newComment, setNewComment] = useState(""); // 새로 입력 중인 댓글 내용

  // 댓글 조회
  const fetchCommentData = useCallback(async () => {
    // <댓글 조회>
    //1. 댓글 조회 api 호출해서 응답 확인 (콘솔로)
    //2. 필요한 부분만 setComments에 넣는다.
    //* response의 구조를 꼭 확인하고, 형식에 맞춰서 (배열)~ 넣어주기
    if (!friendId || !diaryId) return;
    try {
      console.log("댓글 조회 시도:", { friendId, diaryId });
      const response = await fetchFriendComments(friendId, diaryId);
      console.log("댓글 조회 성공:", response.data);
      setComments(response.data);
    } catch (err) {
      console.error("❌ 댓글 조회 실패:", err);
    }
  }, [friendId, diaryId]);

  //사용자가 댓글을 등록했을 때 실행되는 함수
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    //<댓글 등록>
    //1. 댓글 등록 api 함수 payload에 {content: newComment} 넣어줌 (명세서랑 api 함수 확인)
    //2. 등록을 했으니 다시 comments를 불러와야함 (= fetchComments 호출)
    //원래는 어떤 페이지에 댓글을 작성했는지에 따라 각각 다른 api를 호출하도록 분기 처리를 해주어야 하는데,
    //지금 useComments를 사용하고 있는 다른 페이지가 없으므로 일단 그냥 작성함.
    //리팩토링할 땐 handleSubmitComment의 매개변수로 현재 페이지가 어디인지 받아와서 그거 따라 각각 다른 api 호출하도록 수정하세요.
    //hook을 사용하는 이유 !!!!!!!!!! 한 페이지에서만 사용할 거면 굳이 hook 쓸 필요 없음
    try {
      console.log("댓글 등록 시도:", newComment);
      await createFriendComment(friendId, diaryId, { content: newComment });
      console.log("댓글 등록 완료");
      setNewComment("");
      await fetchCommentData(); // 댓글 다시 불러오기
    } catch (err) {
      console.error("❌ 댓글 등록 실패:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    //<댓글 삭제>
    //1. 댓글 삭제 api 호출
    try {
      console.log("댓글 삭제 시도:", commentId);
      await deleteFriendComment(friendId, diaryId, commentId);
      console.log("댓글 삭제 성공");
      await fetchCommentData();
    } catch (err) {
      console.error("❌ 댓글 삭제 실패:", err);
    }
  };

  const handleLikeComment = (commentId) => {
    //<댓글 좋아요>
    //1. 좋아요 api 호출 (아직 없음)
    console.log("❤️ 좋아요 클릭 (아직 API 없음):", commentId);
  };

  useEffect(() => {
    fetchCommentData();
  }, [fetchCommentData]);

  return {
    comments,
    newComment,
    setNewComment,
    handleLikeComment,
    handleDeleteComment,
    handleSubmitComment,
    fetchCommentData,
    setComments,
  };
};

export default useComments;
