/**
 * 컬럼 차트 데이터
 * 월별 데이터 시리즈를 포함하는 객체
 */
export const columnData = {
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  series: [
    { name: "데이터 1", data: [40, 30, 45, 35, 25, 40] },
    { name: "데이터 2", data: [70, 60, 75, 65, 55, 70] },
  ],
};

/**
 * 중첩 파이 차트 데이터
 * 브라우저 사용량과 그 하위 버전 정보를 포함하는 계층 구조 데이터
 */
export const nestedPieData = {
  series: [
    {
      name: "Browser",
      data: [
        { name: "Chrome", data: 50 },
        { name: "Safari", data: 20 },
        { name: "Firefox", data: 15 },
        { name: "Edge", data: 10 },
        { name: "Others", data: 5 },
      ],
      children: {
        Chrome: [
          { name: "Chrome > 100", data: 25 },
          { name: "Chrome 80~100", data: 15 },
          { name: "Chrome 60~80", data: 10 },
        ],
        Safari: [
          { name: "Safari > 14", data: 12 },
          { name: "Safari 12~14", data: 8 },
        ],
        Firefox: [
          { name: "Firefox > 90", data: 10 },
          { name: "Firefox 80~90", data: 5 },
        ],
        Edge: [
          { name: "Edge > 100", data: 8 },
          { name: "Edge 80~100", data: 2 },
        ],
      },
    },
  ],
}; 