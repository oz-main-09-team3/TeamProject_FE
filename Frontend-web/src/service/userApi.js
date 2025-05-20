import api from "./axios";

// 내 정보 조회
export const getMyInfo = () => api.get("/api/users/me/");

export const updateMyInfo = (data) => {
  const formData = new FormData();
  
  // 기본 사용자 정보 추가
  if (data.nickname) formData.append('nickname', data.nickname);
  if (data.phone_num) formData.append('phone_num', data.phone_num);
  if (data.email) formData.append('email', data.email);
  if (data.birthday) formData.append('birthday', data.birthday);
  if (data.profile) {
    formData.append('profile', data.profile);
  }
  console.log(formData.profile);
  // API 요청
  return api.patch("/api/users/me/update/", formData, {
    headers: {
      'Content-Type': null
    }
  });
};

// 회원 탈퇴
export const deleteAccount = () => api.delete("/api/users/me/");