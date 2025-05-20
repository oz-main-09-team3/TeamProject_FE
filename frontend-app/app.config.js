import 'dotenv/config';

export default {
  name: "감정 일기 앱",
  slug: "emotion-diary-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#FFF6D8"
  },
  scheme: "emotiondiary", // Deep Linking을 위한 URL 스킴
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.emotiondiary",
    // 카메라 및 사진 라이브러리 접근 권한 설명
    infoPlist: {
      NSCameraUsageDescription: "프로필 사진을 촬영하기 위해 카메라 접근 권한이 필요합니다.",
      NSPhotoLibraryUsageDescription: "프로필 사진을 선택하기 위해 사진 라이브러리 접근 권한이 필요합니다."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFF6D8"
    },
    package: "com.yourcompany.emotiondiary",
    // 딥링크 설정
    intentFilters: [
      {
        action: "VIEW",
        data: [
          {
            scheme: "emotiondiary"
          }
        ],
        category: ["BROWSABLE", "DEFAULT"]
      }
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    // 이미지 피커 플러그인
    [
      "expo-image-picker",
      {
        photosPermission: "앱에서 사진을 사용하기 위해 사진 라이브러리 접근 권한이 필요합니다.",
        cameraPermission: "앱에서 사진을 촬영하기 위해 카메라 접근 권한이 필요합니다."
      }
    ]
  ],
  // 환경 변수 설정
  extra: {
    // 백엔드 URL (기본값 제공)
    backendUrl: process.env.BACKEND_URL || "https://handsomepotato.p-e.kr",
    
    // 소셜 로그인 클라이언트 ID
    kakaoClientId: process.env.KAKAO_CLIENT_ID || "96bcae55c155283d413ac407fd4df2ea",
    naverClientId: process.env.NAVER_CLIENT_ID || "",
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    
    // 개발 모드 여부
    isDevMode: process.env.NODE_ENV === "development"
  }
};