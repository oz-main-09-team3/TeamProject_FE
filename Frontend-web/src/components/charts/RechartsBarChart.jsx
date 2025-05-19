import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { EMOJI_COLORS } from '../../constants/EmojiColors';

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
  // 현재 월 가져오기 (0-11)
  const currentMonth = new Date().getMonth();
  
  // 데이터 변환 (Toast UI 차트 형식 → Recharts 형식)
  const transformData = (inputData) => {
    if (!inputData || !inputData.categories || !inputData.series || 
        !Array.isArray(inputData.categories) || !Array.isArray(inputData.series)) {
      return [];
    }
    
    const { categories, series } = inputData;
    
    return categories.map((category, index) => ({
      name: category,
      value: series[0].data[index],
      color: series[0].colors?.[index] || '#568BFF'
    }));
  };
  
  const chartData = transformData(data);
  
  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-yl100 dark:bg-darkBg shadow-lg rounded-md border border-lightGold dark:border-darkCopper">
          <p className="font-bold text-lighttext dark:text-darktext">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.payload.color }} className="text-lighttext dark:text-darktext">
              {`${entry.name}: ${entry.value}개`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 커스텀 범례 컴포넌트
  const CustomLegend = () => {
    const currentMonthColor = EMOJI_COLORS[currentMonth + 1] || '#A9E8FF';
    
    return (
      <div className="flex items-center justify-center gap-2 mt-4">
        <div 
          className="w-4 h-4 rounded-sm" 
          style={{ backgroundColor: currentMonthColor }}
        />
        <span className="text-lighttext dark:text-darktext">일기 작성 횟수</span>
      </div>
    );
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
          <Legend content={<CustomLegend />} />
          <Bar 
            dataKey="value" 
            name="일기 작성 횟수"
            fill={EMOJI_COLORS[currentMonth + 1] || '#A9E8FF'}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsBarChart;