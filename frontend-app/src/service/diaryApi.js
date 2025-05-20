import api from './axios';

// 일기 목록 조회 API
export const fetchDiariesApi = async () => {
  return api.get('/api/diary/');
};

// 일기 상세 조회 API
export const fetchDiaryApi = async (diaryId) => {
  return api.get(`/api/diary/${diaryId}/`);
};

// 일기 작성 API
export const createDiaryApi = async (diaryData) => {
  // FormData로 변환 (이미지 업로드 지원)
  const formData = new FormData();
  
  // 기본 필드 추가
  formData.append('emotion_id', diaryData.emotion_id);
  formData.append('content', diaryData.content);
  formData.append('visibility', diaryData.visibility);
  
  // 이미지가 있는 경우 추가
  if (diaryData.images && diaryData.images.length > 0) {
    diaryData.images.forEach((image, index) => {
      formData.append(`images[${index}]`, {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.name || `image_${index}.jpg`
      });
    });
  }
  
  return api.post('/api/diary/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 일기 수정 API
export const updateDiaryApi = async (diaryId, diaryData) => {
  // FormData로 변환 (이미지 업로드 지원)
  const formData = new FormData();
  
  // 수정할 필드만 추가
  if (diaryData.emotion_id !== undefined) {
    formData.append('emotion_id', diaryData.emotion_id);
  }
  
  if (diaryData.content !== undefined) {
    formData.append('content', diaryData.content);
  }
  
  if (diaryData.visibility !== undefined) {
    formData.append('visibility', diaryData.visibility);
  }
  
  // 이미지가 있는 경우 추가
  if (diaryData.images && diaryData.images.length > 0) {
    diaryData.images.forEach((image, index) => {
      formData.append(`images[${index}]`, {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.name || `image_${index}.jpg`
      });
    });
  }
  
  return api.patch(`/api/diary/${diaryId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 일기 삭제 API
export const deleteDiaryApi = async (diaryId) => {
  return api.delete(`/api/diary/${diaryId}/`);
};

// 이모션 목록 조회 API
export const fetchEmotionsApi = async () => {
  return api.get('/api/emotions/');
};

// 캘린더용 일기 데이터 조회 API
export const fetchCalendarApi = async () => {
  return api.get('/api/diary/calendar/');
};

// 차트용 감정 통계 조회 API
export const fetchEmotionStatsApi = async (period = 'month') => {
  return api.get('/api/emotions/stats/', { 
    params: { period } 
  });
};