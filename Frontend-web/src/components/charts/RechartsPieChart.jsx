import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { EMOJI_COLORS } from '../../constants/EmojiColors'; 
import { EMOJI_TEXT_MAP } from '../../constants/Emoji'; 

/**
 * Recharts 라이브러리를 사용한 파이 차트 컴포넌트 (접을 수 있는 범례)
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
  // 범례 표시 여부 상태
  const [showLegend, setShowLegend] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // 데이터 변환 함수
  const transformData = (inputData) => {
    if (!inputData || !inputData.series || !Array.isArray(inputData.series)) {
      return [];
    }
    
    return inputData.series.map(item => ({
      name: item.name,
      value: item.data,
      color: item.color
    }));
  };
  
  const chartData = transformData(data);

  useEffect(() => {
    // 전체 갯수 계산
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    setTotalCount(total);
  }, [chartData]);
  
  const findEmojiIdByName = (name) => {
    for (const [id, text] of Object.entries(EMOJI_TEXT_MAP)) {
      if (text === name) {
        return parseInt(id);
      }
    }
    return null;
  };
  
  const getEmotionColorByName = (name) => {
    const emojiId = findEmojiIdByName(name);
    if (emojiId && EMOJI_COLORS[emojiId]) {
      return EMOJI_COLORS[emojiId];
    }
    
    return '#CCCCCC';
  };
  
  const DEFAULT_COLORS = Object.values(EMOJI_COLORS).slice(0, 10);
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-darkBg shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-800 dark:text-white" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {`${payload[0].value}개`}
          </p>
        </div>
      );
    }
    return null;
  };

  // 범례 토글 함수
  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  // 접을 수 있는 범례 컴포넌트
  const CollapsibleLegend = () => (
    <div className={`w-full bg-white/95 dark:bg-darkBg/95 transition-all duration-300 ease-in-out shadow-md`}
         style={{
           position: 'absolute',
           left: 0,
           bottom: 0,
           zIndex: 10,
           height: showLegend ? '200px' : '40px', // 펼쳤을 때와 접었을 때의 높이
           overflow: 'hidden'
         }}>
      {/* 토글 버튼 - 상단에 고정 */}
      <div className="w-full sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={toggleLegend}
          className="w-full py-2 px-4 flex items-center justify-between"
          aria-expanded={showLegend}
          aria-controls="legend-content"
        >
          <span className="text-gray-800 dark:text-white font-medium">
            {showLegend ? '범례 접기' : '범례 보기'} (총 {totalCount}개)
          </span>
          <svg 
            className={`w-5 h-5 text-gray-600 dark:text-gray-300 transform transition-transform duration-300 ${showLegend ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 범례 내용 - 스크롤 가능하지만 스크롤바 숨김 */}
      <div 
        id="legend-content"
        className={`p-3 ${showLegend ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{ 
          height: 'calc(100% - 40px)', 
          overflowY: 'auto',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        <div className="grid grid-cols-1 gap-2">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-800 dark:text-white text-sm">
                {entry.name} ({entry.value}개)
              </span>
            </div>
          ))}
        </div>
        
        {/* WebKit 브라우저용 스크롤바 숨김 스타일 */}
        <style>
          {`
            #legend-content::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center text-red-500 p-2" style={{ height: `${height}px` }}>
        <p>차트를 불러오는 중 오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center text-gray-500 p-2" style={{ height: `${height}px` }}>
        <p>표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  // 차트가 차지할 높이 계산 (범례가 펼쳐진 경우 차트 높이 조정)
  const chartHeight = height - 40; // 버튼 높이만큼만 빼기 (범례는 항상 아래쪽 오버레이로 표시)

  return (
    <div
      className="w-full relative"
      style={{ height, minHeight: height, maxHeight: height, overflow: 'hidden' }}
    >
      {/* 차트 영역 */}
      <div 
        className="w-full"
        style={{ 
          height: showLegend ? chartHeight - 160 : chartHeight, // 범례가 펼쳐질 때 차트 영역 축소
          transition: 'height 0.3s ease-in-out',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* 접을 수 있는 범례 영역 */}
      <CollapsibleLegend />
    </div>
  );
};

export default RechartsPieChart;