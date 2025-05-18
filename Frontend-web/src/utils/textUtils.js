/**
 * 텍스트를 길이에 맞게 자르고 말줄임표 추가
 * @param {string} text - 원본 텍스트
 * @param {number} maxLength - 최대 길이
 * @returns {string} 자른 텍스트
 */
export const truncateText = (text, maxLength = 40) => {
  if (!text) return '';
  
  const firstLine = text.split('\n')[0].trim();
  
  if (firstLine.length <= maxLength) return firstLine;
  return firstLine.substring(0, maxLength) + '...';
};

/**
 * HTML 태그 제거
 * @param {string} html - HTML 문자열
 * @returns {string} HTML 태그가 제거된 문자열
 */
export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

/**
 * 마크다운을 일반 텍스트로 변환
 * @param {string} markdown - 마크다운 문자열
 * @returns {string} 변환된 일반 텍스트
 */
export const markdownToPlainText = (markdown) => {
  if (!markdown) return '';
  
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 처리
    .replace(/\*(.*?)\*/g, '$1')     // 이탤릭 처리
    .replace(/`([^`]+)`/g, '$1')     // 인라인 코드 처리
    .replace(/^#+\s+(.*)/gm, '$1')   // 헤더 처리
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // 링크 처리
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '[이미지]') // 이미지 처리
    .replace(/^- (.*)/gm, '• $1')    // 리스트 처리
    .replace(/^(\d+)\. (.*)/gm, '$1. $2') // 번호 리스트 처리
    .replace(/```[\s\S]*?```/g, '[코드 블록]'); // 코드 블록 처리
};