import api from "./axios";

// 내 정보 조회
export const getMyInfo = () => api.get("/api/users/me/");

// 내 정보 수정
export const updateMyInfo = (data) => {
  const formData = new FormData();
  
  // 각 필드를 FormData에 추가
  if (data.nickname !== undefined) formData.append('nickname', data.nickname);
  if (data.phone_num !== undefined) formData.append('phone_num', data.phone_num);
  if (data.email !== undefined) formData.append('email', data.email);
  if (data.birthday !== undefined) formData.append('birthday', data.birthday);
  
  // profile이 base64 문자열인 경우 처리 (이미 EditUserInfo.jsx에서 처리하고 있지만 여기서도 안전하게 확인)
  if (data.profile) {
    // base64 이미지 데이터인 경우
    if (typeof data.profile === 'string' && data.profile.startsWith('data:')) {
      // base64 데이터를 Blob으로 변환할 필요가 있음
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
    // 이미 파일 객체인 경우
    else if (data.profile instanceof File || data.profile instanceof Blob) {
      formData.append('profile', data.profile);
    }
    // base64 문자열만 전달된 경우 (이미 EditUserInfo.jsx에서 처리함)
    else if (typeof data.profile === 'string') {
      formData.append('profile', data.profile);
    }
  }
  
  return api.patch("/api/users/me/update/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

// 회원 탈퇴
export const deleteAccount = () => api.delete("/api/users/me/");
