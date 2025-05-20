import React, { useRef, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { EMOJI_COLORS } from '../../constants/EmojiColors'; 
import { EMOJI_TEXT_MAP } from '../../constants/Emoji'; 

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
  const legendRef = useRef(null);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

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
        <div className="p-2 bg-yl100 dark:bg-darkBg shadow-lg rounded-md border border-lightGold dark:border-darkCopper">
          <p className="font-bold text-lighttext dark:text-darktext" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-lighttext dark:text-darktext">
            {`${payload[0].value}개`}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].pageX - legendRef.current.offsetLeft);
    setScrollLeft(legendRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!startX) return;
    e.preventDefault();
    const x = e.touches[0].pageX - legendRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    legendRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setStartX(null);
  };

  const checkScrollArrows = () => {
    if (legendRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = legendRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    // 초기 로드 시와 데이터 변경 시 스크롤 상태 체크
    checkScrollArrows();
    
    // ResizeObserver를 사용하여 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      checkScrollArrows();
    });

    if (legendRef.current) {
      resizeObserver.observe(legendRef.current);
    }

    return () => {
      if (legendRef.current) {
        resizeObserver.disconnect();
      }
    };
  }, [chartData]);

  const scrollLegend = (direction) => {
    if (legendRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      const currentScroll = legendRef.current.scrollLeft;
      
      legendRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });

      // 스크롤 후 화살표 상태 업데이트
      setTimeout(checkScrollArrows, 300);
    }
  };

  const handleScroll = () => {
    checkScrollArrows();
  };

  const CustomLegend = () => (
    <div className="relative w-full">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-yl100/80 dark:bg-darkBg/80 hover:bg-yl100 dark:hover:bg-darkBg p-2 rounded-r-md shadow-md"
          onClick={() => scrollLegend('right')}
        >
          <svg className="w-6 h-6 text-lighttext dark:text-darktext" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-yl100/80 dark:bg-darkBg/80 hover:bg-yl100 dark:hover:bg-darkBg p-2 rounded-l-md shadow-md"
          onClick={() => scrollLegend('left')}
        >
          <svg className="w-6 h-6 text-lighttext dark:text-darktext" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div
        ref={legendRef}
        className="flex flex-nowrap items-center justify-start gap-3 px-12"
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          zIndex: 20,
          position: 'relative',
          width: '100%',
          paddingTop: '8px',
          paddingBottom: '8px'
        }}
        onScroll={handleScroll}
      >
        <div className="flex items-center gap-2 mb-1 mr-4 flex-shrink-0">
          <span className="text-lighttext dark:text-darktext font-bold" style={{ fontSize: 14 }}>
            전체: {totalCount}개
          </span>
        </div>
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1 flex-shrink-0">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-lighttext dark:text-darktext" style={{ fontSize: 14 }}>
              {entry.name} ({entry.value}개)
            </span>
          </div>
        ))}
        <style>{`
          .flex-nowrap::-webkit-scrollbar {
            display: none;
          }
        `}</style>
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
      <div className="w-full flex items-center justify-center text-lighttext/70 p-2" style={{ height: `${height}px` }}>
        <p>표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className="w-full relative flex flex-col items-center"
      style={{ height, minHeight: height, maxHeight: height, overflow: 'hidden' }}
    >
      {/* 차트 영역 (상단 고정, 남은 공간 모두 차지) */}
      <div style={{ width: '100%', height: height * 0.8, minHeight: height * 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="100%"
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
      {/* 범례 영역 (하단 고정, 가로 스크롤) */}
      <div
        className="w-full"
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          background: 'rgba(30, 20, 10, 0.95)',
          padding: '2px 0',
          zIndex: 10,
        }}
      >
        <CustomLegend />
      </div>
    </div>
  );
};

export default RechartsPieChart;