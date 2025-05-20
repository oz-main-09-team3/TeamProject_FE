import { useState, useEffect, useCallback } from "react";
import {
  createFriendComment,
  updateFriendComment,
  deleteFriendComment,
} from "../service/friendCommentApi";

// 일반 다이어리 댓글 API 추가
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "../service/commentApi";

/**
 * 댓글 관리를 위한 커스텀 훅 (친구 다이어리 & 일반 다이어리 모두 지원)
 * @param {number|string} friendId - 친구 유저 ID (친구 다이어리일 경우에만 필요)
 * @param {number|string} diaryId - 해당 다이어리 ID
 * @returns 댓글 관련 상태와 함수들
 */
const useComments = (friendId, diaryId) => {
  const [comments, setComments] = useState([]); // 전체 댓글 목록
  const [newComment, setNewComment] = useState(""); // 새로 입력 중인 댓글 내용
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 오류 상태 추가

  // 친구 다이어리인지 여부 확인 (friendId가 있으면 친구 다이어리)
  const isFriendDiary = Boolean(friendId);

  // 댓글 목록 설정 (다이어리 상세 정보에서 받아온 댓글 목록 설정용)
  const setInitialComments = useCallback((commentsData) => {
    if (Array.isArray(commentsData)) {
      setComments(commentsData);
      console.log("초기 댓글 목록 설정:", commentsData);
    }
  }, []);

  // 다이어리 ID 유효성 검사
  const validateDiaryId = () => {
    if (!diaryId) {
      console.error("다이어리 ID가 없습니다.");
      setError("댓글 작업을 수행할 수 없습니다: 다이어리 ID가 없습니다.");
      return false;
    }
    return true;
  };

  // 친구 다이어리 ID 유효성 검사
  const validateFriendDiaryIds = () => {
    if (!friendId) {
      console.error("친구 ID가 없습니다.");
      setError("댓글 작업을 수행할 수 없습니다: 친구 ID가 없습니다.");
      return false;
    }
    if (!diaryId) {
      console.error("다이어리 ID가 없습니다.");
      setError("댓글 작업을 수행할 수 없습니다: 다이어리 ID가 없습니다.");
      return false;
    }
    return true;
  };

  // 댓글 목록 불러오기 (일반 다이어리용)
  const loadComments = useCallback(async () => {
    if (!validateDiaryId()) return;
    if (isFriendDiary) return; // 친구 다이어리는 별도로 처리

      if (loading) {
    console.log("이미 로딩 중이므로 중복 호출 방지");
    return;
  }
    setLoading(true);
    setError(null);

    try {
      console.log("댓글 목록 로드 시도:", { diaryId });
      const response = await fetchComments(diaryId);
      console.log("댓글 목록 로드 완료:", response.data);
      setComments(response.data);
    } catch (err) {
      console.error("❌ 댓글 목록 로드 실패:", err);
      setError("댓글 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [diaryId, isFriendDiary]);

  // 컴포넌트 마운트 시 댓글 목록 로드 (일반 다이어리만)
  useEffect(() => {
    if (!isFriendDiary && diaryId) {
      loadComments();
    }
  }, [diaryId, isFriendDiary, loadComments]);

  // 댓글 등록
const handleSubmitComment = async (e) => {
  if (e) e.preventDefault();
  if (newComment.trim() === "") return;

  // 다이어리 ID가 있는지 확인
  if (!diaryId) {
    console.error("댓글 등록 실패: 다이어리 ID가 없습니다.", { diaryId });
    setError("댓글을 등록할 수 없습니다.");
    return;
  }

  setLoading(true);
  setError(null);
  try {
    console.log("댓글 등록 시도:", { diaryId, content: newComment });
    
    let response;
    // 친구 다이어리와 일반 다이어리 API 구분
    if (isFriendDiary) {
      // 친구 다이어리 댓글 API 사용
      const { createFriendComment } = await import("../service/friendCommentApi");
      response = await createFriendComment(friendId, diaryId, { content: newComment });
    } else {
      // 일반 다이어리 댓글 API 사용
      response = await createComment(diaryId, { content: newComment });
    }
    
    console.log("댓글 등록 완료:", response.data);
    
    // 새 댓글 데이터 보정 (created_at이 없을 경우 현재 시간 추가)
    const commentData = {
      ...response.data,
      created_at: response.data.created_at || new Date().toISOString()
    };
    
    // 새 댓글을 목록에 추가
    setComments(prevComments => [...prevComments, commentData]);
    setNewComment("");
    
    // 일반 다이어리인 경우 댓글 목록 다시 로드 (타이머 사용)
    if (!isFriendDiary) {
      setTimeout(() => {
        loadComments();
      }, 300);
    }
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
    if (!commentId) {
      console.error("댓글 ID가 없습니다.");
      setError("댓글을 수정할 수 없습니다: 댓글 ID가 없습니다.");
      return;
    }

    // API에 따른 유효성 검사
    if (isFriendDiary) {
      if (!validateFriendDiaryIds()) return;
    } else {
      if (!validateDiaryId()) return;
    }

    setLoading(true);
    setError(null);
    try {
      let response;

      if (isFriendDiary) {
        // 친구 다이어리 댓글 API 사용
        console.log("친구 다이어리 댓글 수정 시도:", { friendId, diaryId, commentId, content });
        response = await updateFriendComment(friendId, diaryId, commentId, { content });
      } else {
        // 일반 다이어리 댓글 API 사용
        console.log("일반 다이어리 댓글 수정 시도:", { diaryId, commentId, content });
        response = await updateComment(diaryId, commentId, { content });
      }

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
    if (!commentId) {
      console.error("댓글 ID가 없습니다.");
      setError("댓글을 삭제할 수 없습니다: 댓글 ID가 없습니다.");
      return;
    }

    // API에 따른 유효성 검사
    if (isFriendDiary) {
      if (!validateFriendDiaryIds()) return;
    } else {
      if (!validateDiaryId()) return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isFriendDiary) {
        // 친구 다이어리 댓글 API 사용
        console.log("친구 다이어리 댓글 삭제 시도:", { friendId, diaryId, commentId });
        await deleteFriendComment(friendId, diaryId, commentId);
      } else {
        // 일반 다이어리 댓글 API 사용
        console.log("일반 다이어리 댓글 삭제 시도:", { diaryId, commentId });
        await deleteComment(diaryId, commentId);
      }
      
      console.log("댓글 삭제 성공");
      
      // 삭제 성공 시 상태 업데이트
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
    loadComments,
  };
};

export default useComments;