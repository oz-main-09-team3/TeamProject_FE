/**
 * 텍스트를 길이에 맞게 자르고 말줄임표 추가
 * @param {string} text - 원본 텍스트
 * @param {number} maxLength - 최대 길이
 * @returns {string} 자른 텍스트
 */
export const truncateText = (text, maxLength = 40) => {
  if (!text) return '';
  
  // 첫 번째 줄만 추출
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

/**
 * 문자열이 유효한 이메일인지 확인
 * @param {string} email - 이메일 문자열
 * @returns {boolean} 유효성 여부
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * 문자열이 유효한 전화번호인지 확인
 * @param {string} phone - 전화번호 문자열
 * @returns {boolean} 유효성 여부
 */
export const isValidPhoneNumber = (phone) => {
  if (!phone) return false;
  
  // 숫자만 추출
  const numbers = phone.replace(/[^0-9]/g, '');
  
  // 한국 전화번호 형식 (010-xxxx-xxxx)
  const phoneRegex = /^01([0|1|6|7|8|9])(\d{3,4})(\d{4})$/;
  return phoneRegex.test(numbers);
};

/**
 * 텍스트의 길이 제한 확인 (글자 수)
 * @param {string} text - 확인할 텍스트
 * @param {number} maxLength - 최대 길이
 * @returns {boolean} 유효성 여부
 */
export const isValidLength = (text, maxLength) => {
  if (!text) return true;
  return text.length <= maxLength;
};

/**
 * 이름에 특수문자가 포함되어 있는지 확인
 * @param {string} name - 확인할 이름
 * @returns {boolean} 유효성 여부
 */
export const isValidName = (name) => {
  if (!name) return false;
  
  // 특수문자 확인 정규식
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return !specialCharRegex.test(name);
};