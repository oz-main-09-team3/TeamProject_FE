import React, { useState, useEffect } from "react";
import { Camera, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateQRCode, inviteFriend } from "../service/friendApi";
import { getMyInfo } from "../service/userApi";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import useUiStore from "../store/uiStore";
import Modal from "../components/Modal";

const FriendInviteSystem = () => {
  const [username, setUsername] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [pendingCode, setPendingCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  
  const navigate = useNavigate();
  const { openModal } = useUiStore();

  // 토큰으로 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    
    console.log("토큰 확인:", token ? "있음" : "없음");
    
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate('/login');
      return null;
    }
    
    setUserLoading(true);
    try {
      const response = await getMyInfo();
      console.log("사용자 정보 응답:", response);
      const userData = response.data;
      setUsername(userData.username || userData.email || userData.name);
      return userData;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      console.error("에러 응답:", error.response);
      if (error.response?.status === 401) {
        // 토큰 만료 또는 유효하지 않음
        localStorage.removeItem('token');
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        navigate('/login');
      }
      return null;
    } finally {
      setUserLoading(false);
    }
  };

  // 백엔드에서 QR 코드 이미지 가져오기
  const fetchQRCode = async (userInfo) => {
    if (!userInfo) return;
    
    setIsLoading(true);
    try {
      const userIdentifier = userInfo.username || userInfo.email || userInfo.name;
      const response = await generateQRCode(userIdentifier);
      
      // ArrayBuffer를 Blob으로 변환
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      
      setQrCodeUrl(url);
    } catch (error) {
      console.error("QR 코드 생성 실패:", error);
      alert("QR 코드 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeComponent = async () => {
      const userInfo = await fetchUserInfo();
      if (userInfo) {
        await fetchQRCode(userInfo);
      }
    };
    
    initializeComponent();
    
    // cleanup
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, []); 

  const handleAddFriend = () => {
    if (!inputCode.trim()) {
      openModal('error', {
        title: '오류',
        content: '친구 코드를 입력해주세요.',
        confirmText: '확인'
      });
      return;
    }
    if (inputCode.trim().length < 3) {
      openModal('error', {
        title: '오류',
        content: '잘못된 코드입니다.',
        confirmText: '확인'
      });
      return;
    }
    setPendingCode(inputCode);
    openModal('confirm', {
      title: '친구 추가',
      content: `${inputCode}님을 친구로 추가하시겠습니까?`,
      confirmText: '추가하기',
      cancelText: '취소',
      onConfirm: () => addFriendByCode(inputCode)
    });
  };

  const addFriendByCode = async (code) => {
    try {
      if (!code || typeof code !== 'string' || code.trim().length < 3) {
        throw new Error('유효하지 않은 초대 코드입니다.');
      }

      const payload = {
        invite_code: `${code}_초대코드`
      };
      
      console.log("친구 추가 요청:", payload);
      const response = await inviteFriend(payload);
      console.log("친구 추가 응답:", response);
      
      openModal('success', {
        title: '성공',
        content: `${code}님을 친구로 추가했습니다.`,
        confirmText: '확인'
      });
    } catch (error) {
      console.error("친구 추가 실패 상세 정보:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        error: error
      });
      
      let errorMessage = "친구 추가에 실패했습니다.";
      
      if (error.response?.status === 500) {
        errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      openModal('error', {
        title: '오류',
        content: errorMessage,
        confirmText: '확인'
      });
    }
  };

  const simulateScan = () => {
    setShowScanner(false);
    setTimeout(() => {
      setPendingCode("scanned_code_123");
      openModal('confirm', {
        title: '친구 추가',
        content: 'scanned_code_123님을 친구로 추가하시겠습니까?',
        confirmText: '추가하기',
        cancelText: '취소',
        onConfirm: () => addFriendByCode("scanned_code_123")
      });
    }, 500);
  };

  return (
    <main className="flex items-center justify-center min-h-screen w-full px-4 pt-[100px]">
      <div className="flex flex-col items-center p-8 w-full max-w-md bg-yl100 dark:text-darkBg rounded-3xl shadow-lg text-lighttext relative pt-8">
        {/* 뒤로 가기 버튼 */}
        <BackButton to="/mypage" />

        <h1 className="text-2xl font-bold mb-4 text-center">
          친구 초대 시스템
        </h1>

        {/* 내 초대 코드 */}
        <section className="flex flex-col items-center w-full">
          <h2 className="text-lg font-semibold mb-2">내 초대 코드</h2>
          <div className="border-2 border-lightGold dark:border-darkOrange rounded-lg p-4 mb-4 bg-white">
            {isLoading || userLoading ? (
              <div className="w-[220px] h-[220px] flex items-center justify-center">
                <span className="text-gray-500">QR 코드 생성 중...</span>
              </div>
            ) : qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-[220px] h-[220px]"
              />
            ) : (
              <div className="w-[220px] h-[220px] flex items-center justify-center">
                <span className="text-gray-500">QR 코드를 불러올 수 없습니다</span>
              </div>
            )}
          </div>

          {/* 사용자 이름 표시 */}
          <div className="flex flex-col items-center gap-2 mb-4 w-full">
            <FormInput
              value={username}
              readOnly={true}
              placeholder="사용자 이름"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(username)}
              className="w-full"
            >
              복사
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2 mb-4 w-full">
            <Button
              onClick={async () => {
                const userInfo = await fetchUserInfo();
                if (userInfo) {
                  await fetchQRCode(userInfo);
                }
              }}
              disabled={isLoading || userLoading}
              variant="primary"
              className="w-full"
            >
              {isLoading || userLoading ? "생성 중..." : "QR 코드 새로고침"}
            </Button>
          </div>
        </section>

        {/* 친구 추가 */}
        <section className="w-full border-t border-lightGold pt-6">
          <h2 className="text-lg font-semibold mb-4 text-center">친구 추가</h2>

          {/* 추가 버튼 */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <FormInput
              placeholder="친구 사용자명 입력"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddFriend}
              disabled={!inputCode.trim()}
              className="w-full"
            >
              추가
            </Button>
          </div>

          <Button
            onClick={() => setShowScanner(true)}
            variant="primary"
            className="w-full flex items-center justify-center"
          >
            <Camera className="mr-2" size={20} />
            QR 코드 스캔
          </Button>
        </section>
      </div>

      {/* 스캐너 모달 */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-2 text-center text-darkBg">
              QR 코드를 스캔하세요
            </h3>
            <div className="bg-gray-100 w-full h-64 flex items-center justify-center mb-4">
              <Button onClick={simulateScan} variant="primary" className="w-full">
                스캔 시뮬레이션
              </Button>
            </div>
            <Button
              onClick={() => setShowScanner(false)}
              variant="secondary"
              className="w-full"
            >
              취소
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default FriendInviteSystem;