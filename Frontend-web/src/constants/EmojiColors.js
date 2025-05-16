/**
 * 감정 이모지별 색상 매핑
 * 각 이모지의 테두리 색상을 기준으로 설정
 */
export const EMOJI_COLORS = {
  // 1행
  1: '#FFB663', 
  2: '#FF80AE', 
  3: '#FF6161', 
  4: '#D9FF80', 
  5: '#568BFF', 
  6: '#57FFA3', 
  7: '#FF6CEB', 
  8: '#81F2FF', 
  9: '#FFFA6A', 
  10: '#FFD9ED', 
  11: '#F9E297', 
  12: '#B9FD99', 
  13: '#C8FFFC', 
  14: '#FFFFA2', 
  15: '#EDC0FF', 
  16: '#A9E8FF',
  17: '#E1FF8F', 
  18: '#ACCDFF', 
  19: '#FFCDA2', 
  20: '#D0D2EA', 
  21: '#B1CADF', 
  22: '#B3D9AE',
  23: '#DE7D95', 
  24: '#80C4B9',
  25: '#A8D4F0',  
  26: '#717DFF',
  27: '#C8635A',
  28: '#E08318',
};

/**
 * 감정 ID에 따른 색상 가져오기
 * @param {number|string} id - 감정 ID
 * @param {string} defaultColor - 기본 색상
 * @returns {string} 색상 코드
 */
export const getEmojiColorById = (id, defaultColor = '#CCCCCC') => {
  return EMOJI_COLORS[id] || defaultColor;
};

/**
 * 전체 이모지 색상 배열 가져오기
 * @returns {string[]} 색상 배열
 */
export const getAllEmojiColors = () => {
  return Object.values(EMOJI_COLORS);
};