/**
 * 현재 날짜를 YYYY.MM.DD 형식으로 포맷팅
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}; 