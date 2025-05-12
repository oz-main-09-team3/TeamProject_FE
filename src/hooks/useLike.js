import { useState } from 'react';

/**
 * 좋아요 기능을 위한 커스텀 훅
 * @param {Array} items - 좋아요 상태를 가진 아이템 배열
 * @param {Function} setItems - 아이템 배열을 업데이트하는 함수
 * @returns {Object} handleLike, loadingId, animatingId를 포함한 객체
 */
export const useLike = (items, setItems) => {
  const [loadingId, setLoadingId] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);

  const handleLike = async (id, e) => {
    e?.stopPropagation();
    
    if (loadingId !== null) return;
    
    try {
      setLoadingId(id);
      setAnimatingId(id); // 애니메이션 시작
      
      const currentItem = items.find(item => item.id === id);
      const newLikedStatus = !currentItem.liked;
      
      // 좋아요 상태 변경 애니메이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setItems(prevList => 
        prevList.map(item => 
          item.id === id 
            ? { ...item, liked: newLikedStatus } 
            : item
        )
      );
      
      // 애니메이션 완료 후 상태 초기화
      setTimeout(() => {
        setAnimatingId(null);
      }, 300);

      console.log(`ID ${id}의 좋아요 상태가 ${newLikedStatus ? '추가' : '제거'}되었습니다.`);
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setLoadingId(null);
    }
  };

  return {
    handleLike,
    loadingId,
    animatingId
  };
}; 