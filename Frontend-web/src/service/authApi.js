import api from "./axiosInstance.js";

// 구글 소셜 로그인 (인가 코드로 JWT 발급)
export const loginGoogle = ({ code, redirect_uri }) =>
  api.post("/api/auth/login/google/", { code, redirect_uri });

// 카카오 소셜 로그인 (인가 코드로 JWT 발급)
export const loginKakao = ({ code, redirect_uri }) =>
  api.post("/api/auth/login/kakao/", { code, redirect_uri });

// 소셜 로그아웃
export const logout = () => api.post("/api/auth/logout/");
