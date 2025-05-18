import { EMOJI_TEXT_MAP } from '../constants/Emoji';
import { EMOJI_COLORS } from '../constants/EmojiColors';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * 일기 객체에서 이모지 이미지 URL을 추출
 * @param {Object} diary - 일기 객체
 * @returns {string} 이모지 이미지 URL
 */
export const getEmojiSrc = (diary) => {
  if (!diary) return `${BACKEND_URL}/static/emotions/1.png`;
  
  // emotionUrl이 있는 경우 우선 사용
  if (diary.emotionUrl) {
    return diary.emotionUrl.startsWith('http') 
      ? diary.emotionUrl 
      : `${BACKEND_URL}${diary.emotionUrl}`;
  }
  
  // emotionId에서 추출
  let emotionId = diary.emotionId;
  if (emotionId && typeof emotionId === "object") {
    emotionId = emotionId.id;
  }
  
  if (emotionId && !isNaN(emotionId)) {
    return `${BACKEND_URL}/static/emotions/${emotionId}.png`;
  }
  
  // 기본값 반환
  return `${BACKEND_URL}/static/emotions/1.png`;
};

/**
 * 감정 ID에 해당하는 텍스트 반환
 * @param {number|string} id - 감정 ID
 * @returns {string} 감정 텍스트
 */
export const getEmojiText = (id) => {
  return EMOJI_TEXT_MAP[id] || `감정${id}`;
};

/**
 * 감정 ID에 해당하는 색상 반환
 * @param {number|string} id - 감정 ID
 * @param {string} defaultColor - 기본 색상
 * @returns {string} 색상 코드
 */
export const getEmojiColor = (id, defaultColor = '#CCCCCC') => {
  return EMOJI_COLORS[id] || defaultColor;
};

/**
 * 감정 이름으로 ID 찾기
 * @param {string} name - 감정 이름
 * @returns {number|null} 감정 ID
 */
export const findEmojiIdByName = (name) => {
  for (const [id, text] of Object.entries(EMOJI_TEXT_MAP)) {
    if (text === name) {
      return parseInt(id);
    }
  }
  return null;
};