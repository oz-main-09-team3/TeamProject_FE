import { useState, useEffect, useCallback } from "react";
import {
  createFriendComment,
  updateFriendComment,
  deleteFriendComment,
} from "../service/friendCommentApi";

/**
 * 댓글 관리를 위한 커스텀 훅 (친구 다이어리용)
 * @param {number|string} friendId - 친구 유저 ID
 * @param {number|string} diaryId - 해당 다이어리 ID
 * @returns 댓글 관련 상태와 함수들
 */
const useComments = (friendId, diaryId) => {
  const [comments, setComments] = useState([]); // 전체 댓글 목록
  const [newComment, setNewComment] = useState(""); // 새로 입력 중인 댓글 내용
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 오류 상태 추가

  // 댓글 목록 설정 (FriendDiaryView에서 다이어리 상세 정보에서 받아온 댓글 목록 설정용)
  const setInitialComments = useCallback((commentsData) => {
    if (Array.isArray(commentsData)) {
      setComments(commentsData);
      console.log("초기 댓글 목록 설정:", commentsData);
    }
  }, []);

  // 댓글 등록
  const handleSubmitComment = async (e) => {
    if (e) e.preventDefault();
    if (newComment.trim() === "") return;

    // 친구 ID와 다이어리 ID가 있는지 확인
    if (!friendId || !diaryId) {
      console.error("댓글 등록 실패: 친구 ID 또는 다이어리 ID가 없습니다.", { friendId, diaryId });
      setError("댓글을 등록할 수 없습니다.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("댓글 등록 시도:", { friendId, diaryId, content: newComment });
      const response = await createFriendComment(friendId, diaryId, { content: newComment });
      console.log("댓글 등록 완료:", response.data);
      
      // 새 댓글을 목록에 추가
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment("");
    } catch (err) {
      console.error("❌ 댓글 등록 실패:", err);
      setError("댓글 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 댓글 수정
  const handleUpdateComment = async (commentId, content) => {
    if (content.trim() === "") return;

    // 친구 ID와 다이어리 ID가 있는지 확인
    if (!friendId || !diaryId || !commentId) {
      console.error("댓글 수정 실패: 필수 매개변수가 없습니다.", { friendId, diaryId, commentId });
      setError("댓글을 수정할 수 없습니다.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("댓글 수정 시도:", { commentId, content, friendId, diaryId });
      const response = await updateFriendComment(friendId, diaryId, commentId, { content });
      console.log("댓글 수정 완료:", response.data);
      
      // 기존 댓글 목록에서 수정된 댓글 업데이트
      setComments(prevComments => 
        prevComments.map(comment => {
          // ID 비교 로직
          const currentCommentId = comment.id || comment.comment_id;
          return currentCommentId == commentId ? response.data : comment;
        })
      );
    } catch (err) {
      console.error("❌ 댓글 수정 실패:", err);
      setError("댓글 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    // 친구 ID와 다이어리 ID가 있는지 확인
    if (!friendId || !diaryId || !commentId) {
      console.error("댓글 삭제 실패: 필수 매개변수가 없습니다.", { friendId, diaryId, commentId });
      setError("댓글을 삭제할 수 없습니다.");
      return;
    }

    // 이 시점에서 매개변수 값 확인
    console.log("삭제 실행:", {
      friendId: friendId,
      diaryId: diaryId,
      commentId: commentId,
      url: `/api/frienddiary/${friendId}/diary/${diaryId}/comments/${commentId}/`
    });

    setLoading(true);
    setError(null);
    try {
      // API 호출 전 확인
      console.log(`댓글 삭제 API 호출 직전: /api/frienddiary/${friendId}/diary/${diaryId}/comments/${commentId}/`);
      
      // API 호출 (Promise 방식으로 변경)
      await deleteFriendComment(friendId, diaryId, commentId)
        .then(response => {
          console.log("댓글 삭제 API 응답:", response);
          return response;
        });
      
      console.log("댓글 삭제 성공");
      
      // 삭제 성공 시 상태 업데이트 (== 사용으로 타입 강제 변환 허용)
      setComments(prevComments => {
        const beforeCount = prevComments.length;
        const filtered = prevComments.filter(comment => {
          const currentId = comment.id || comment.comment_id;
          const shouldKeep = currentId != commentId; // 느슨한 비교(!=)로 문자열/숫자 타입 차이 허용
          console.log(`댓글 ID ${currentId}와 삭제할 ID ${commentId} 비교 결과: ${shouldKeep ? '유지' : '삭제'}`);
          return shouldKeep;
        });
        console.log(`댓글 ${beforeCount}개 중 ${beforeCount - filtered.length}개 삭제됨`);
        return filtered;
      });
    } catch (err) {
      console.error("❌ 댓글 삭제 실패:", err);
      setError(`댓글 삭제에 실패했습니다: ${err.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 토글 (API 없음)
  const handleLikeComment = (commentId) => {
    console.log("❤️ 좋아요 클릭 (아직 API 없음):", commentId);
  };

  return {
    comments,
    loading,
    newComment,
    error,
    setNewComment,
    setInitialComments,
    handleLikeComment,
    handleUpdateComment,
    handleDeleteComment,
    handleSubmitComment,
    setComments,
  };
};

export default useComments;