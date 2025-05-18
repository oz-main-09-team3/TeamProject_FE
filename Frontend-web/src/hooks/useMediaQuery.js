import { useState, useEffect } from 'react';

/**
 * 미디어 쿼리 커스텀 훅
 * @param {string} query - 미디어 쿼리 문자열 (ex: '(max-width: 768px)')
 * @returns {boolean} 쿼리 매치 여부
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // 초기값 설정
    setMatches(mediaQuery.matches);
    
    // 리스너 함수
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    
    // 리스너 추가
    mediaQuery.addEventListener('change', handleChange);
    
    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);
  
  return matches;
};

export default useMediaQuery;