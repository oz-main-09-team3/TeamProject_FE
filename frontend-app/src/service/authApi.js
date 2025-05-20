import api from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// 환경 변수
const { backendUrl } = Constants.expoConfig.extra;

/**
 * 소셜 로그인 API 호출
 * @param {string} provider - 소셜 로그인 제공자 (kakao, naver, google)
 * @param {Object} authData - 인증 데이터
 * @param {string} authData.code - 인증 코드
 * @param {string} authData.redirect_uri - 리다이렉트 URI
 * @returns {Promise} 로그인 결과
 */
export const createLoginApi = async (provider, authData) => {
  try {
    let endpoint = '';
    
    // 제공자에 따른 엔드포인트 선택
    switch (provider) {
      case 'kakao':
        endpoint = '/api/auth/login/kakao/';
        break;
      case 'naver':
        endpoint = '/api/auth/login/naver/';
        break;
      case 'google':
        endpoint = '/api/auth/login/google/';
        break;
      default:
        throw new Error('지원하지 않는 로그인 방식입니다.');
    }
    
    // API 요청
    const response = await api.post(endpoint, authData);
    
    // 응답에 토큰이 있는지 확인
    if (response.data?.token) {
      // 토큰 저장
      await AsyncStorage.setItem('token', response.data.token);
      
      // 리프레시 토큰이 있다면 저장
      if (response.data.refresh_token) {
        await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
      }
      
      return response;
    } else {
      throw new Error('토큰을 받지 못했습니다.');
    }
  } catch (error) {
    console.error(`${provider} 로그인 API 호출 중 오류:`, error);
    
    // 에러 상세 정보 로깅
    if (error.response) {
      console.error('에러 응답:', error.response.data);
      console.error('에러 상태:', error.response.status);
    } else if (error.request) {
      console.error('요청 오류:', error.request);
    }
    
    throw error;
  }
};

/**
 * 로그아웃 API 호출
 * @returns {Promise} 로그아웃 결과
 */
export const logoutApi = async () => {
  try {
    // 로그아웃 API 호출
    const response = await api.post('/api/auth/logout/');
    
    // 로컬 스토리지의 토큰 제거
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refresh_token');
    
    return response;
  } catch (error) {
    console.error('로그아웃 API 호출 중 오류:', error);
    
    // API 호출이 실패해도 로컬 토큰은 제거
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refresh_token');
    
    throw error;
  }
};

/**
 * 토큰 검증 API 호출
 * @returns {Promise} 토큰 검증 결과
 */
export const validateTokenApi = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('토큰이 없습니다.');
    }
    
    // 토큰 검증 API 호출
    return await api.post('/api/auth/validate-token/', { token });
  } catch (error) {
    console.error('토큰 검증 API 호출 중 오류:', error);
    throw error;
  }
};

/**
 * 토큰 갱신 API 호출
 * @returns {Promise} 토큰 갱신 결과
 */
export const refreshTokenApi = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }
    
    // 토큰 갱신 API 호출
    const response = await api.post('/api/auth/refresh-token/', { refresh_token: refreshToken });
    
    // 새 토큰 저장
    if (response.data?.token) {
      await AsyncStorage.setItem('token', response.data.token);
      
      // 새 리프레시 토큰이 있다면 저장
      if (response.data.refresh_token) {
        await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
      }
      
      return response;
    } else {
      throw new Error('새 토큰을 받지 못했습니다.');
    }
  } catch (error) {
    console.error('토큰 갱신 API 호출 중 오류:', error);
    throw error;
  }
};