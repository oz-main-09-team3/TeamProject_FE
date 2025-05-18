import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import useAuthStore from "../store/authStore";
import useFriendStore from "../store/friendStore";
import useUiStore from "../store/uiStore";
import { useNavigate } from "react-router-dom";

const FriendInviteSystem = () => {
  const navigate = useNavigate();
  
  // Zustand 스토어 사용
  const { user, isAuthenticated, fetchUserInfo } = useAuthStore();
  const { qrCodeUrl, isLoading, error, generateQRCode, inviteFriend } = useFriendStore();
  const { openModal } = useUiStore();
  
  // 로컬 상태
  const [username, setUsername] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  
  // 컴포넌트 마운트 시 사용자 정보 로드 및 QR 코드 생성
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        setUserLoading(true);
        try {
          const userData = await fetchUserInfo();
          setUsername(userData?.username || userData?.email || userData?.name || "");
          
          if (userData?.username) {
            await generateQRCode(userData.username);
          }
        } catch (error) {
          console.error("사용자 정보/QR 코드 생성 실패:", error);
        } finally {
          setUserLoading(false);
        }
      } else {
        navigate('/login');
      }
    };
    
    loadData();
  }, [isAuthenticated, fetchUserInfo, generateQRCode, navigate]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      openModal('error', {
        title: '오류',
        content: error,
        onConfirm: () => null
      });
    }
  }, [error, openModal]);

  // QR 코드 새로고침
  const refreshQRCode = async () => {
    if (username) {
      try {
        await generateQRCode(username);
      } catch (err) {
        openModal('error', {
          title: 'QR 코드 생성 실패',
          content: err.message || 'QR 코드를 생성하는데 실패했습니다.',
          onConfirm: () => null
        });
      }
    }
  };

  // 친구 추가 처리
  const handleAddFriend = async () => {
    if (!inputCode.trim()) {
      openModal('warning', {
        title: '입력 오류',
        content: '친구 사용자명을 입력해주세요.',
        onConfirm: () => null
      });
      return;
    }
    
    try {
      const payload = {
        invite_type: "qr",
        invite_code: inputCode.trim()
      };
      
      await inviteFriend(payload);
      
      openModal('success', {
        title: '친구 추가 완료',
        content: `${inputCode}님을 친구로 추가했습니다.`,
        onConfirm: () => {
          setInputCode('');
        }
      });
    } catch (err) {
      openModal('error', {
        title: '친구 추가 실패',
        content: err.message || '친구 추가에 실패했습니다.',
        onConfirm: () => null
      });
    }
  };

  // QR 스캔 시뮬레이션
  const simulateScan = () => {
    setShowScanner(false);
    
    openModal('confirm', {
      title: '친구 추가',
      content: '스캔된 코드로 친구를 추가하시겠습니까?',
      onConfirm: async () => {
        try {
          const payload = {
            invite_type: "qr",
            invite_code: "scanned_code_123"
          };
          
          await inviteFriend(payload);
          
          openModal('success', {
            title: '친구 추가 완료',
            content: '친구가 추가되었습니다.',
            onConfirm: () => null
          });
        } catch (err) {
          openModal('error', {
            title: '친구 추가 실패',
            content: err.message || '친구 추가에 실패했습니다.',
            onConfirm: () => null
          });
        }
      }
    });
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
              onClick={refreshQRCode}
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
              disabled={!inputCode.trim() || isLoading}
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