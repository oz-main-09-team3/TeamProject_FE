/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param {string} dateString - 포맷팅할 날짜 문자열
 * @returns {string} 포맷팅된 날짜 (ex: 2023년 5월 18일 목요일)
 */
export const formatDateKorean = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 * @param {Date|string} date - 변환할 날짜
 * @returns {string} YYYY-MM-DD 형식의 문자열
 */
export const formatDateYYYYMMDD = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 날짜가 오늘인지 확인
 * @param {Date|string} date - 확인할 날짜
 * @returns {boolean} 오늘 여부
 */
export const isToday = (date) => {
  const today = new Date();
  const d = date instanceof Date ? date : new Date(date);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * 전화번호를 010-xxxx-xxxx 형식으로 포맷팅
 * @param {string} phone - 전화번호
 * @returns {string} 포맷팅된 전화번호
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const onlyNums = phone.replace(/[^0-9]/g, '');
  if (onlyNums.length < 4) return onlyNums;
  if (onlyNums.length < 8) return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
  if (onlyNums.length < 11) return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7);
  return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7, 11);
};