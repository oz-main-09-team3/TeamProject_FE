export const EMOJI_TEXT_MAP = {
  1: '짜릿해',
  2: '즐거움',
  3: '사랑',
  4: '기대감',
  5: '자신감',
  6: '기쁨',
  7: '행복함',
  8: '뿌듯함',
  9: '쥬릅',
  10: '쑥스러움',
  11: '인생..',
  12: '꾸엑',
  13: '지침',
  14: '놀람',
  15: '니가?',
  16: '현타',
  17: '그래요',
  18: '당황',
  19: '소노',
  20: '슬픔',
  21: '억울함',
  22: '불안함',
  23: '어이없음',
  24: '울고싶음',
  25: '우울함',
  26: '안타까움',
  27: '화남',
  28: '열받음'
};

export const getEmojiText = (id) => {
  return EMOJI_TEXT_MAP[id] || `감정${id}`;
};

export const getDefaultEmojis = () => {
  return Object.entries(EMOJI_TEXT_MAP).map(([id, emotion]) => ({
    id: parseInt(id),
    emotion,
    image_url: `/static/emotions/${id}.png`
  }));
};