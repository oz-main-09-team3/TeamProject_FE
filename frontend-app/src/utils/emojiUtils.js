import { EMOJI_TEXT_MAP } from '../constants/Emoji';
import { EMOJI_COLORS } from '../constants/colors';

// API URL (환경 변수로 관리하는 것이 좋음)
const BACKEND_URL = 'https://your-backend-url.com';

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
  
  // emotionId가 객체인 경우 id 추출
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

/**
 * 이미지 URL을 CloudFront URL로 변환
 * @param {string} imageUrl - 원본 이미지 URL
 * @param {string} cloudFrontUrl - CloudFront 도메인
 * @returns {string} 변환된 URL
 */
export const convertToCloudFrontUrl = (imageUrl, cloudFrontUrl = 'https://dpjpkgz1vl8qy.cloudfront.net') => {
  if (!imageUrl) return '';
  
  // 이미 CloudFront URL인 경우
  if (imageUrl.includes(cloudFrontUrl)) return imageUrl;
  
  // S3 URL 패턴 확인 (예: https://bucket-name.s3.region.amazonaws.com)
  const s3Pattern = /https:\/\/.*\.s3\..*\.amazonaws\.com/;
  
  if (imageUrl.match(s3Pattern)) {
    // S3 URL에서 경로만 추출
    const pathMatch = imageUrl.match(/amazonaws\.com(\/.*)/);
    if (pathMatch && pathMatch[1]) {
      return `${cloudFrontUrl}${pathMatch[1]}`;
    }
  }
  
  // 상대 경로인 경우
  if (imageUrl.startsWith('/')) {
    return `${cloudFrontUrl}${imageUrl}`;
  }
  
  // 그 외의 경우 원본 반환
  return imageUrl;
};