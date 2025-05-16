import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Recharts 라이브러리를 사용한 파이 차트 컴포넌트
 * @param {Object} props
 * @param {Array} props.data - 차트에 표시할 데이터
 * @param {string} [props.title="감정 분포"] - 차트 제목
 * @param {number} [props.height=400] - 차트 높이
 * @param {boolean} [props.isLoading=false] - 로딩 상태
 * @param {string} [props.error] - 에러 메시지
 * @returns {JSX.Element} 파이 차트 컴포넌트
 */
const RechartsPieChart = ({ 
  data,
  title = "감정 분포", 
  height = 400,
  isLoading = false,
  error = null
}) => {
  // 데이터 변환 (Toast UI 차트 형식 → Recharts 형식)
  const transformData = (inputData) => {
    if (!inputData || !inputData.series || !Array.isArray(inputData.series)) {
      return [];
    }
    
    return inputData.series.map(item => ({
      name: item.name,
      value: item.data
    }));
  };
  
  const chartData = transformData(data);
  
  // 차트 색상 배열
  const COLORS = ['#4B9CD3', '#7B68EE', '#20B2AA', '#FF7F50', '#9370DB', '#FFA07A', '#3CB371', '#6A5ACD', '#FF6347'];
  
  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-yl100 dark:bg-darkBg shadow-lg rounded-md border border-lightGold dark:border-darkCopper">
          <p className="font-bold text-lighttext dark:text-darktext">{payload[0].name}</p>
          <p className="text-lighttext dark:text-darktext">{`${payload[0].value}개`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center text-red-500" style={{ height: `${height}px` }}>
        <p>차트를 불러오는 중 오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center text-lighttext/70" style={{ height: `${height}px` }}>
        <p>표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* {title && (
        <h3 className="text-center font-medium mb-4">{title}</h3>
      )} */}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={height / 3}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsPieChart;