/**
 * 답글의 부모 사용자 닉네임을 찾는 함수
 * @param {Object} reply - 답글 객체
 * @param {Array} replies - 답글 배열
 * @returns {string|null} 부모 사용자 닉네임 또는 null
 */
export const getReplyParentUserNickname = (reply, replies) => {
  if (!reply.parentId) return null;
  const parentReply = replies.find(r => r.id === reply.parentId);
  return parentReply ? parentReply.userNickname : null;
};

/**
 * 답글 트리를 구성하는 함수
 * @param {Array} replies - 답글 배열
 * @returns {Array} 트리 구조로 구성된 답글 배열
 */
export const organizeReplies = (replies) => {
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

/**
 * 답글 트리를 재귀적으로 구성하는 함수
 * @param {number} parentId - 부모 답글 ID
 * @param {Array} allReplies - 모든 답글 배열
 * @returns {Array} 자식 답글 배열
 */
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