import api from "./axios";

// 내 정보 조회
export const getMyInfo = () => api.get("/api/users/me/");

// 내 정보 수정
export const updateMyInfo = (data) => api.patch("/api/users/me/update/", data);

// 회원 탈퇴
export const deleteAccount = () => api.delete("/api/users/me/");
