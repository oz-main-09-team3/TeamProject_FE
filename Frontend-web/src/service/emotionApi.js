import api from "./axios";

// 감정 목록 조회
export const fetchEmotions = () => api.get("/api/emotions/");

// 감정 변화 트렌드 그래프 데이터 조회
export const fetchEmotionTrend = ({ from, to }) =>
  api.get("/api/emotions/trend/", {
    params: { from, to },
  });

// 감정별 사용량 카운트 그래프 데이터 조회
export const fetchEmotionCount = ({ from, to }) =>
  api.get("/api/emotions/count/", {
    params: { from, to },
  });
