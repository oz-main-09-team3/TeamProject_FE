import { useState, useEffect } from 'react';

/**
 * 로컬 스토리지와 연동되는 상태 관리 훅
 * @param {string} key - 로컬 스토리지 키
 * @param {any} initialValue - 초기값
 * @returns {Array} [storedValue, setValue] - 저장된 값과 값 설정 함수
 */
const useLocalStorage = (key, initialValue) => {
  // 초기 상태는 로컬 스토리지에서 가져오거나 초기값 사용
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // storedValue가 변경될 때마다 로컬 스토리지 업데이트
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;