import api from "./axios";

// 내 정보 조회
export const getMyInfo = () => api.get("/api/users/me/");

export const updateMyInfo = (data) => {
  const formData = new FormData();
  
  // 백엔드 API 요구사항에 맞는 키 이름으로 직접 폼데이터 구성
  if (data.nickname !== undefined) formData.append('nickname', data.nickname);
  if (data.phone_num !== undefined) formData.append('phone_num', data.phone_num);
  if (data.email !== undefined) formData.append('email', data.email);
  if (data.birthday !== undefined) formData.append('birthday', data.birthday);
  
  // 이전 키 이름도 처리 (하위 호환성 유지)
  if (data.username !== undefined && data.nickname === undefined) formData.append('nickname', data.username);
  if (data.phone_number !== undefined && data.phone_num === undefined) formData.append('phone_num', data.phone_number);
  if (data.birth_date !== undefined && data.birthday === undefined) formData.append('birthday', data.birth_date);
  
  // 프로필 이미지 처리
  if (data.profile) {
    // 이미 profile 키로 전달된 경우
    if (typeof data.profile === 'string' && data.profile.includes('base64')) {
      const byteString = atob(data.profile.split(',')[1]);
      const mimeString = data.profile.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      formData.append('profile', blob, 'profile.jpg');
    }
    else if (data.profile instanceof File || data.profile instanceof Blob) {
      formData.append('profile', data.profile);
    }
  } else if (data.profile_image) {
    // profile_image 키로 전달된 경우
    if (typeof data.profile_image === 'string' && data.profile_image.includes('base64')) {
      const byteString = atob(data.profile_image.split(',')[1]);
      const mimeString = data.profile_image.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      formData.append('profile', blob, 'profile.jpg');
    }
    else if (data.profile_image instanceof File || data.profile_image instanceof Blob) {
      formData.append('profile', data.profile_image);
    }
  }
  
  // FormData 내용 디버깅
  console.log("FormData 내용:");
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof Blob ? 'Blob data' : pair[1]));
  }
  
  return api.patch("/api/users/me/update/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

// 회원 탈퇴
export const deleteAccount = () => api.delete("/api/users/me/");
