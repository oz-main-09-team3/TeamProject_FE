/**
 * 차트 테마 설정
 */
const themes = {
  light: {
    chart: {
      background: {
        color: '#ffffff',
      },
    },
    title: {
      color: '#333333',
    },
    legend: {
      label: {
        color: '#333333',
      },
    },
  },
  dark: {
    chart: {
      background: {
        color: '#1a1a1a',
      },
    },
    title: {
      color: '#ffffff',
    },
    legend: {
      label: {
        color: '#ffffff',
      },
    },
  },
};

/**
 * 컬럼 차트 옵션 생성 함수
 * @param {number} width - 차트 컨테이너의 너비
 * @param {string} [title="월별 데이터"] - 차트 제목
 * @param {number} [height=400] - 차트 높이
 * @returns {Object} 컬럼 차트 옵션 객체
 */
export const getColumnOptions = (width, title = "월별 데이터", height = 400) => ({
  chart: {
    width,
    height,
    title,
  },
  series: { 
    dataLabels: { visible: true },
    colors: ['#4B9CD3', '#7B68EE'],
  },
  legend: { 
    visible: true,
  },
  title: {
    color: '#333333',
  },
});

/**
 * 중첩 파이 차트 옵션 생성 함수
 * @param {number} width - 차트 컨테이너의 너비
 * @param {string} [title="브라우저 사용량"] - 차트 제목
 * @param {number} [height=400] - 차트 높이
 * @returns {Object} 중첩 파이 차트 옵션 객체
 */
export const getNestedPieOptions = (width, title = "브라우저 사용량", height = 400) => ({
  chart: {
    width,
    height,
    title,
  },
  series: { 
    dataLabels: { visible: true },
    colors: ['#4B9CD3', '#7B68EE', '#20B2AA', '#FF7F50', '#9370DB'],
  },
  tooltip: { grouped: true },
  legend: { 
    visible: true,
  },
  title: {
    color: '#333333',
  },
}); 