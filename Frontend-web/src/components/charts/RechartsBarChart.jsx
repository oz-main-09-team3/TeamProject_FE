import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Recharts 라이브러리를 사용한 컬럼 차트 컴포넌트
 * @param {Object} props
 * @param {Array} props.data - 차트에 표시할 데이터
 * @param {string} [props.title="월별 일기 작성 횟수"] - 차트 제목
 * @param {number} [props.height=400] - 차트 높이
 * @param {boolean} [props.isLoading=false] - 로딩 상태
 * @param {string} [props.error] - 에러 메시지
 * @returns {JSX.Element} 컬럼 차트 컴포넌트
 */
const RechartsBarChart = ({ 
  data,
  title = "월별 일기 작성 횟수", 
  height = 400,
  isLoading = false,
  error = null
}) => {
  // 데이터 변환 (Toast UI 차트 형식 → Recharts 형식)
  const transformData = (inputData) => {
    if (!inputData || !inputData.categories || !inputData.series || 
        !Array.isArray(inputData.categories) || !Array.isArray(inputData.series)) {
      return [];
    }
    
    const { categories, series } = inputData;
    
    // categories와 series 데이터를 결합하여 Recharts 형식으로 변환
    return categories.map((category, index) => {
      const dataItem = { name: category };
      
      // 각 시리즈의 데이터 추가
      series.forEach(seriesItem => {
        dataItem[seriesItem.name] = seriesItem.data[index];
      });
      
      return dataItem;
    });
  };
  
  const chartData = transformData(data);
  
  // 차트 색상
  const BAR_COLORS = ['#4B9CD3', '#7B68EE', '#20B2AA', '#FF7F50', '#9370DB'];
  
  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-yl100 dark:bg-darkBg shadow-lg rounded-md border border-lightGold dark:border-darkCopper">
          <p className="font-bold text-lighttext dark:text-darktext">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-lighttext dark:text-darktext">
              {`${entry.name}: ${entry.value}개`}
            </p>
          ))}
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

  // 데이터에서 시리즈 키 추출 (name 제외)
  const seriesKeys = Object.keys(chartData[0] || {}).filter(key => key !== 'name');

  return (
    <div className="w-full">
      {/* {title && (
        <h3 className="text-center font-medium mb-4">{title}</h3>
      )} */}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#666' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#666' }}
            label={{ value: '일기 수', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          
          {seriesKeys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={BAR_COLORS[index % BAR_COLORS.length]} 
              name={key}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsBarChart;