import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 스토어 및 API
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import { createLoginApi } from '../service/authApi';
import { COLORS } from '../constants/colors';

// 환경 변수
const { backendUrl, kakaoClientId, naverClientId, googleClientId, scheme } = Constants.expoConfig.extra;

// 웹 브라우저 결과 처리를 위한 설정
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  
  // 로딩 및 오류 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 스토어 상태 및 액션
  const { login, isAuthenticated } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUiStore();
  
  // 인증 세션 추적을 위한 참조
  const authSessionRef = useRef(null);

  // 이미 로그인된 경우 메인 화면으로 이동
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token && isAuthenticated) {
        navigation.replace('MainTabs');
      }
    };
    
    checkAuth();
  }, [isAuthenticated, navigation]);

  // 딥링크 처리 설정
  useEffect(() => {
    // 앱이 실행 중일 때 딥링크 처리
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // 앱이 처음 시작될 때 URL 확인
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // 클린업 함수
    return () => {
      subscription.remove();
      if (authSessionRef.current) {
        WebBrowser.dismissAuthSession(authSessionRef.current);
      }
    };
  }, []);

  // 딥링크 처리 함수
  const handleDeepLink = async ({ url }) => {
    if (!url) return;

    // 인증 코드 추출
    const parsedUrl = Linking.parse(url);
    
    // auth/callback/<provider> 경로인지 확인
    if (!parsedUrl.path || !parsedUrl.path.includes('auth/callback')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const authCode = parsedUrl.queryParams?.code;
      if (!authCode) {
        throw new Error('인증 코드가 없습니다.');
      }
      
      // 소셜 로그인 제공자 확인
      let provider = '';
      if (parsedUrl.path.includes('kakao')) {
        provider = 'kakao';
      } else if (parsedUrl.path.includes('naver')) {
        provider = 'naver';
      } else if (parsedUrl.path.includes('google')) {
        provider = 'google';
      } else {
        throw new Error('지원하지 않는 로그인 방식입니다.');
      }
      
      // 리다이렉트 URI 생성
      const redirectUri = Linking.createURL(`auth/callback/${provider}`);
      
      // 로그인 시도
      const success = await login(provider, { code: authCode, redirect_uri: redirectUri });
      
      if (success) {
        navigation.replace('MainTabs');
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('딥링크 처리 중 오류:', err);
      setError(err.message || '로그인 중 오류가 발생했습니다.');
      Alert.alert('로그인 오류', err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 리다이렉트 URI 생성
      const redirectUri = Linking.createURL('auth/callback/kakao');
      
      // 인증 URL 생성
      const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
      
      console.log('카카오 로그인 URL:', authUrl);
      console.log('리다이렉트 URI:', redirectUri);
      
      // 웹 브라우저로 인증 세션 열기
      authSessionRef.current = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri,
        { showInRecents: true }
      );
      
      console.log('인증 세션 결과:', authSessionRef.current);
      
      // WebBrowser에서 처리가 완료되면 딥링크 핸들러가 호출됨
      // 이후 처리는 handleDeepLink 함수에서 수행
    } catch (err) {
      console.error('카카오 로그인 중 오류:', err);
      setError(err.message || '카카오 로그인 중 오류가 발생했습니다.');
      Alert.alert('로그인 오류', err.message || '카카오 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 네이버 로그인 처리
  const handleNaverLogin = async () => {
    try {
      if (!naverClientId) {
        throw new Error('네이버 클라이언트 ID가 설정되지 않았습니다.');
      }
      
      setIsLoading(true);
      setError(null);
      
      // 리다이렉트 URI 생성
      const redirectUri = Linking.createURL('auth/callback/naver');
      
      // 랜덤 상태 문자열 생성 (CSRF 방지)
      const state = Math.random().toString(36).substring(2, 15);
      
      // 인증 URL 생성
      const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
      
      console.log('네이버 로그인 URL:', authUrl);
      console.log('리다이렉트 URI:', redirectUri);
      
      // 웹 브라우저로 인증 세션 열기
      authSessionRef.current = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri,
        { showInRecents: true }
      );
      
      console.log('인증 세션 결과:', authSessionRef.current);
      
      // WebBrowser에서 처리가 완료되면 딥링크 핸들러가 호출됨
    } catch (err) {
      console.error('네이버 로그인 중 오류:', err);
      setError(err.message || '네이버 로그인 중 오류가 발생했습니다.');
      Alert.alert('로그인 오류', err.message || '네이버 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 로그인 처리
  const handleGoogleLogin = async () => {
    try {
      if (!googleClientId) {
        throw new Error('구글 클라이언트 ID가 설정되지 않았습니다.');
      }
      
      setIsLoading(true);
      setError(null);
      
      // 리다이렉트 URI 생성
      const redirectUri = Linking.createURL('auth/callback/google');
      
      // 인증 URL 생성
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=profile email&access_type=offline&prompt=consent`;
      
      console.log('구글 로그인 URL:', authUrl);
      console.log('리다이렉트 URI:', redirectUri);
      
      // 웹 브라우저로 인증 세션 열기
      authSessionRef.current = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri,
        { showInRecents: true }
      );
      
      console.log('인증 세션 결과:', authSessionRef.current);
      
      // WebBrowser에서 처리가 완료되면 딥링크 핸들러가 호출됨
    } catch (err) {
      console.error('구글 로그인 중 오류:', err);
      setError(err.message || '구글 로그인 중 오류가 발생했습니다.');
      Alert.alert('로그인 오류', err.message || '구글 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={isDarkMode ? require('../../assets/PhoneD.png') : require('../../assets/PhoneL.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* 다크모드 토글 버튼 */}
      <TouchableOpacity
        style={styles.themeToggle}
        onPress={() => toggleDarkMode(!isDarkMode)}
      >
        <Ionicons
          name={isDarkMode ? 'sunny' : 'moon'}
          size={24}
          color={isDarkMode ? COLORS.yl100 : COLORS.darktext}
        />
      </TouchableOpacity>

      {/* 앱 로고 및 타이틀 */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/LogoL.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[
          styles.title,
          { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
        ]}>
          감정 일기
        </Text>
      </View>

      {/* 로그인 버튼 영역 */}
      <View style={styles.loginButtonsContainer}>
        <TouchableOpacity
          style={[styles.loginButton, styles.kakaoButton]}
          onPress={handleKakaoLogin}
          disabled={isLoading}
        >
          <Image
            source={require('../../assets/kakaotalk.png')}
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, styles.naverButton]}
          onPress={handleNaverLogin}
          disabled={isLoading || !naverClientId}
        >
          <Image
            source={require('../../assets/btnW_아이콘사각.png')}
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, styles.googleButton]}
          onPress={handleGoogleLogin}
          disabled={isLoading || !googleClientId}
        >
          <Image
            source={require('../../assets/google.png')}
            style={styles.socialIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 로딩 표시 */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? COLORS.darkOrange : COLORS.lightOrange} />
          <Text style={[
            styles.loadingText,
            { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
          ]}>
            로그인 처리 중...
          </Text>
        </View>
      )}

      {/* 오류 메시지 */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* 앱 버전 */}
      <Text style={[
        styles.versionText,
        { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }
      ]}>
        버전 {Constants.expoConfig.version}
      </Text>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  loginButtonsContainer: {
    position: 'absolute',
    bottom: height * 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loginButton: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  socialIcon: {
    width: '80%',
    height: '80%',
  },
  loadingContainer: {
    position: 'absolute',
    top: height * 0.7,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 40,
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 5,
  },
  errorText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  versionText: {
    position: 'absolute',
    bottom: 10,
    fontSize: 12,
  },
});

export default LoginScreen;