import { useState, useMemo } from 'react';

/**
 * 검색 기능을 위한 커스텀 훅
 * @param {Array} items - 검색할 아이템 배열
 * @returns {Object} searchTerm, setSearchTerm, filteredItems를 포함한 객체
 * 
 * TODO: 검색 로직 개선 (예: 대소문자 구분 옵션, 부분 일치/전체 일치 옵션 등)
 */
export const useSearch = (items) => {
  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어에 따른 필터링된 아이템 계산 (메모이제이션 적용)
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
}; 