import api from './axios';

// 내 정보 조회
export const getMyInfoApi = async () => {
  return api.get('/api/users/me/');
};

// 내 정보 수정
export const updateMyInfoApi = async (userData) => {
  // FormData로 변환 (프로필 이미지 업로드 지원)
  const formData = new FormData();
  
  // 텍스트 데이터 추가
  if (userData.nickname) formData.append('nickname', userData.nickname);
  if (userData.phone_num) formData.append('phone_num', userData.phone_num);
  if (userData.email) formData.append('email', userData.email);
  if (userData.birthday) formData.append('birthday', userData.birthday);
  
  // 이미지 데이터 추가
  if (userData.profile && typeof userData.profile === 'object') {
    formData.append('profile', {
      uri: userData.profile.uri,
      type: userData.profile.type || 'image/jpeg',
      name: userData.profile.name || 'profile.jpg'
    });
  }
  
  return api.patch('/api/users/me/update/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 회원 탈퇴
export const deleteAccountApi = async () => {
  return api.delete('/api/users/me/');
};

// 알림 설정 조회
export const getNotificationSettingsApi = async () => {
  return api.get('/api/users/me/notifications/');
};

// 알림 설정 업데이트
export const updateNotificationSettingsApi = async (settings) => {
  return api.patch('/api/users/me/notifications/', settings);
};