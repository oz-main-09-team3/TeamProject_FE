import React from 'react';
import { 
  FaUser, 
  FaQrcode, 
  FaChartPie, 
  FaSignOutAlt 
} from "react-icons/fa";

const MENU_ITEMS = [
  {
    id: 'info',
    headerText: "회원 정보",
    bodyText: "내 정보를 확인하고 수정해요",
    rightIcon: <FaUser className="w-5 h-5" />,
    path: "/mypage/info"
  },
  {
    id: 'qrcode',
    headerText: "친구 초대 (QR 코드)",
    bodyText: "QR 코드를 통해 친구를 초대해요",
    rightIcon: <FaQrcode className="w-5 h-5" />,
    path: "/mypage/qrcode"
  },
  {
    id: 'chart',
    headerText: "감정 통계표",
    bodyText: "나의 감정 기록을 한눈에 보기",
    rightIcon: <FaChartPie className="w-5 h-5" />,
    path: "/mypage/chart"
  },
  {
    id: 'withdraw',
    headerText: "회원 탈퇴",
    bodyText: "계정을 탈퇴할 수 있어요",
    rightIcon: <FaSignOutAlt className="w-5 h-5" />,
    path: null,
    isWithdraw: true
  }
];

export default MENU_ITEMS; 