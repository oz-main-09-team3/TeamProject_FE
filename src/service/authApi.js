import api from "./axiosInstance";

// 구글 소셜 로그인 (access_token 받아서 JWT 발급)
export const loginGoogle = ({ access_token }) =>
  api.post("/api/auth/login/google/", { access_token });

// 카카오 소셜 로그인 (access_token 받아서 JWT 발급)
export const loginKakao = ({ access_token }) =>
  api.post("/api/auth/login/kakao/", { access_token });

// 소셜 로그아웃
export const logout = () => api.post("/api/auth/logout/");
