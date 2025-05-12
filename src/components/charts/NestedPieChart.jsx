import React, { memo } from 'react';
import { NestedPieChart as ToastNestedPieChart } from '@toast-ui/chart';
import { useChart } from '../../hooks/useChart';
import { getNestedPieOptions } from './chartOptions';
import { nestedPieData } from './chartData';

/**
 * 중첩 파이 차트 컴포넌트
 * @param {Object} props
 * @param {Object} props.data - 차트에 표시할 데이터 (계층 구조를 가진 데이터)
 * @param {string} [props.title="브라우저 사용량"] - 차트 제목
 * @param {number} [props.height=400] - 차트 높이
 * @param {boolean} [props.isLoading=false] - 로딩 상태
 * @param {string} [props.error] - 에러 메시지
 * @returns {JSX.Element} 중첩 파이 차트 컴포넌트
 */
const NestedPieChart = memo(({ 
  data, 
  title = "브라우저 사용량", 
  height = 400,
  isLoading = false,
  error
}) => {
  // useChart 훅을 사용하여 차트 초기화 및 관리
  const chartRef = useChart(ToastNestedPieChart, data, (width) => 
    getNestedPieOptions(width, title, height)
  );

  if (isLoading) {
    return (
      <div 
        className="w-full h-[400px] flex items-center justify-center"
        role="status"
        aria-label="차트 로딩 중"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="w-full h-[400px] flex items-center justify-center text-red-500"
        role="alert"
        aria-label="차트 에러"
      >
        <p>차트를 불러오는 중 오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  return (
    <div 
      ref={chartRef}
      className="w-full"
      role="img"
      aria-label={`${title} 차트`}
      tabIndex="0"
    />
  );
});

NestedPieChart.displayName = 'NestedPieChart';

export default NestedPieChart; 