import React, { useState } from "react";
import { Heart, Trash2, Pencil, Check, X } from "lucide-react";
import useUiStore from "../store/uiStore";

// CloudFront URL 상수 정의
const CLOUDFRONT_URL = "https://dpjpkgz1vl8qy.cloudfront.net";
const S3_URL_PATTERN = /https:\/\/handsomepotato\.s3\.ap-northeast-2\.amazonaws\.com/;

// S3 URL을 CloudFront URL로 변환하는 함수
const convertToCloudFrontUrl = (url) => {
  if (!url) return '';
  return url.replace(S3_URL_PATTERN, CLOUDFRONT_URL);
};

const SmallRoundButton = ({ icon: Icon, onClick, title, className = "", variant }) => {
  let base = "w-5 h-5 p-0.5 flex items-center justify-center rounded-full transition-colors bg-transparent";
  let iconColor = "text-lighttext dark:text-darkBg";
  if (variant === "danger") iconColor = "text-red-500";
  return (
    <button
      onClick={onClick}
      className={`${base} ${className}`}
      title={title}
      type="button"
    >
      <Icon className={`w-3 h-3 ${iconColor}`} />
    </button>
  );
};

const Comment = ({ comment, diaryId, friendId, likedComments, changeLikeButtonColor, onDeleteComment, onEditComment }) => {
  const { openModal } = useUiStore();
  const commentId = comment.id || comment.comment_id;
  
  // 수정 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  // 수정 중인 댓글 내용
  const [editedContent, setEditedContent] = useState(comment.content);
  
  // 중첩된 user 객체에서 프로필 정보 추출
  const user = comment.user || {};
  
  // 프로필 이미지 URL 변환
  const profileUrl = user.profile ? convertToCloudFrontUrl(user.profile) : '';
  
  // 사용자 정보 추출
  const nickname = user.nickname || '사용자';
  const username = user.username || '';

  function handleClickLikeButton() {
    if (typeof changeLikeButtonColor === 'function') {
      changeLikeButtonColor(commentId);
    }
  }

  function handleClickDeleteButton() {
    openModal('error', {
      title: '댓글 삭제',
      content: '댓글을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: () => {
        if (typeof onDeleteComment === 'function') {
          onDeleteComment(commentId);
        }
      }
    });
  }

  function handleClickEditButton() {
    // 수정 모드 활성화
    setIsEditing(true);
    setEditedContent(comment.content);
  }

  function handleSaveEdit() {
    // 내용이 비어있는지 확인
    if (!editedContent.trim()) {
      openModal('error', {
        title: '입력 오류',
        content: '댓글 내용을 입력해주세요.',
        confirmText: '확인',
      });
      return;
    }

    // 수정된 내용이 없으면 취소
    if (editedContent === comment.content) {
      setIsEditing(false);
      return;
    }

    // 댓글 수정 실행
    if (typeof onEditComment === 'function') {
      onEditComment(commentId, editedContent);
    }
    
    // 수정 모드 종료
    setIsEditing(false);
  }

  function handleCancelEdit() {
    // 수정 취소하고 원래 내용으로 복원
    setIsEditing(false);
    setEditedContent(comment.content);
  }

  return (
    <div className="w-full pt-3 pr-2 pb-1.5 pl-4 rounded-xl shadow-md border-2 border-lighttext/20 dark:border-darkBg/20 mb-2 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          {profileUrl && (
            <img 
              src={profileUrl} 
              alt={nickname}
              className="w-8 h-7 rounded-full"
              onError={(e) => { 
                console.error('프로필 이미지 로드 실패:', profileUrl); 
                e.target.style.display = 'none'; 
              }}
            />
          )}
          <span className="font-semibold text-sm text-lighttext dark:text-darkBg">
            {nickname}
          </span>
          {username && (
            <span className="text-xs text-gray-500 dark:text-darkBg ml-1">
              @{username}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-darkBg pr-4">
          {comment.created_at && typeof comment.created_at === 'string' 
            ? comment.created_at.includes("T") 
              ? comment.created_at.split("T")[0]
              : comment.created_at
            : '날짜 없음'}
        </span>
      </div>
      <div className="flex items-center justify-between">
        {isEditing ? (
          // 수정 모드 UI
          <div className="flex-1 flex items-center pr-2">
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-1 p-1.5 border border-lighttext/30 dark:border-darkBg/30 rounded-md focus:outline-none focus:ring-1 focus:ring-lightGold dark:focus:ring-darkOrange text-lighttext dark:text-darkBg"
              autoFocus
            />
            <div className="flex items-center ml-2">
              <SmallRoundButton
                icon={Check}
                onClick={handleSaveEdit}
                title="저장"
                className="hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400"
              />
              <SmallRoundButton
                icon={X}
                onClick={handleCancelEdit}
                title="취소"
                variant="danger"
                className="hover:bg-red-100 dark:hover:bg-red-900/30"
              />
            </div>
          </div>
        ) : (
          // 일반 모드 UI
          <>
            <div className="text-base text-lighttext dark:text-darkBg break-all">
              {comment.content}
            </div>
            <div className="flex items-center gap-0 ml-2">
              <SmallRoundButton
                icon={Heart}
                onClick={handleClickLikeButton}
                title={(likedComments && likedComments[commentId]) ? "좋아요 취소" : "좋아요"}
                className={
                  ((likedComments && likedComments[commentId]) ? "fill-red-500 text-red-500 border border-red-500 " : "") +
                  "hover:bg-lighttext/10 dark:hover:bg-darkBg/20"
                }
              />
              <SmallRoundButton
                icon={Pencil}
                onClick={handleClickEditButton}
                title="수정"
                className="hover:bg-lighttext/10 dark:hover:bg-darkBg/20"
              />
              <SmallRoundButton
                icon={Trash2}
                onClick={handleClickDeleteButton}
                title="삭제"
                variant="danger"
                className="hover:bg-red-100 dark:hover:bg-red-900/30"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;