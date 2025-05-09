import { useEffect, useRef } from 'react';

/**
 * 차트 초기화와 관리를 위한 커스텀 훅
 * @param {Object} ChartClass - Toast UI Chart 클래스 (예: ColumnChart, NestedPieChart)
 * @param {Object} data - 차트에 표시할 데이터
 * @param {Function} getOptions - 차트 옵션을 생성하는 함수
 * @returns {Object} chartRef - 차트를 렌더링할 DOM 요소에 대한 ref
 */
export const useChart = (ChartClass, data, getOptions) => {
  // 차트 DOM 요소에 대한 ref
  const chartRef = useRef(null);
  // 차트 인스턴스를 저장할 ref
  const chartInstance = useRef(null);

  useEffect(() => {
    // DOM 요소가 없으면 초기화하지 않음
    if (!chartRef.current) return;

    try {
      // 현재 컨테이너 너비에 맞는 옵션 생성
      const options = getOptions(chartRef.current.clientWidth);
      
      // 차트 인스턴스 생성
      chartInstance.current = new ChartClass({
        el: chartRef.current,
        data,
        options,
      });

      // 창 크기 변경 시 차트 크기 조정
      const handleResize = () => {
        if (chartInstance.current && chartRef.current) {
          chartInstance.current.resize({
            width: chartRef.current.clientWidth,
            height: 400,
          });
        }
      };

      // 리사이즈 이벤트 리스너 등록
      window.addEventListener('resize', handleResize);

      // 클린업 함수
      return () => {
        // 이벤트 리스너 제거
        window.removeEventListener('resize', handleResize);
        // 차트 인스턴스 정리
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    } catch (error) {
      console.error('차트 초기화 오류:', error);
      console.error('오류 세부 정보:', error.stack);
    }
  }, [ChartClass, data, getOptions]);

  return chartRef;
}; 