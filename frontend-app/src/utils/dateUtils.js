/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 * @param {Date|string} dateString - 변환할 날짜
 * @returns {string} YYYY-MM-DD 형식의 문자열
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param {string} dateString - 포맷팅할 날짜 문자열
 * @returns {string} 포맷팅된 날짜 (ex: 2023년 5월 18일 목요일)
 */
export const formatDateKorean = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[date.getDay()];
  
  return `${year}년 ${month}월 ${day}일 ${weekDay}요일`;
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 * @param {Date|string} date - 변환할 날짜
 * @returns {string} YYYY-MM-DD 형식의 문자열
 */
export const formatDateYYYYMMDD = (date) => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    return '';
  }
  
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
  if (!date) return false;
  
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

/**
 * 두 날짜 사이의 일 수 계산
 * @param {Date|string} start - 시작 날짜
 * @param {Date|string} end - 종료 날짜
 * @returns {number} 일 수 차이
 */
export const getDaysBetween = (start, end) => {
  if (!start || !end) return 0;
  
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);
  
  // 시간, 분, 초, 밀리초 제거
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * 날짜를 'YYYY년 MM월' 형식으로 포맷팅 (월별 표시용)
 * @param {Date|string} date - 변환할 날짜
 * @returns {string} 'YYYY년 MM월' 형식의 문자열
 */
export const formatYearMonth = (date) => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    return '';
  }
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  
  return `${year}년 ${month}월`;
};