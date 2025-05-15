import React, { useState, useEffect } from "react";
import { Camera, ChevronLeft } from "lucide-react";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { generateQRCode, inviteFriend } from "../service/friendApi";
import { getMyInfo } from "../service/userApi";

const FriendInviteSystem = () => {
  const [username, setUsername] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCode, setPendingCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  
  const navigate = useNavigate();

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
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const addFriendByCode = async (code) => {
    try {
      const response = await inviteFriend({ username: code });
      alert(`${code}님을 친구로 추가했습니다.`);
      // 필요시 친구 목록 새로고침 등의 추가 작업
    } catch (error) {
      console.error("친구 추가 실패:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("친구 추가에 실패했습니다.");
      }
    }
  };

  const handleConfirm = async () => {
    await addFriendByCode(pendingCode);
    setIsModalOpen(false);
    setPendingCode("");
    setInputCode("");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPendingCode("");
  };

  const simulateScan = () => {
    setShowScanner(false);
    setTimeout(() => {
      setPendingCode("scanned_code_123");
      setIsModalOpen(true);
    }, 500);
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 pt-[100px]">
      <div className="flex flex-col items-center p-8 w-full max-w-lg bg-yl100 dark:text-darkBg rounded-3xl shadow-lg text-lighttext relative pt-8">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate('/mypage')}
          className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors absolute left-4 top-4 z-10"
          title="뒤로 가기"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-bold mb-6 text-center">
          친구 초대 시스템
        </h1>

        {/* 내 초대 코드 */}
        <section className="flex flex-col items-center mb-8 w-full">
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
          <div className="flex flex-col sm:flex-row items-center w-full gap-2 mb-4">
            <input
              type="text"
              value={username}
              readOnly
              className="form-input flex-1"
              placeholder="사용자 이름"
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(username)}
              className="secondary-button w-full sm:w-auto px-6 py-2 text-base rounded-full whitespace-nowrap flex items-center justify-center min-w-[80px]"
            >
              복사
            </button>
          </div>

          <button
            onClick={async () => {
              const userInfo = await fetchUserInfo();
              if (userInfo) {
                await fetchQRCode(userInfo);
              }
            }}
            className="primary-button w-full"
            disabled={isLoading || userLoading}
          >
            {isLoading || userLoading ? "생성 중..." : "QR 코드 새로고침"}
          </button>
        </section>

        {/* 친구 추가 */}
        <section className="w-full border-t border-lightGold pt-6">
          <h2 className="text-lg font-semibold mb-4 text-center">친구 추가</h2>

          {/* 추가 버튼 */}
          <div className="flex flex-col sm:flex-row items-center w-full gap-2 mb-4">
            <input
              type="text"
              placeholder="친구 사용자명 입력"
              className="form-input flex-1"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                if (inputCode.trim()) {
                  setPendingCode(inputCode);
                  setIsModalOpen(true);
                }
              }}
              className="secondary-button w-full sm:w-auto px-6 py-2 text-base rounded-full whitespace-nowrap flex items-center justify-center min-w-[80px]"
              disabled={!inputCode.trim()}
            >
              추가
            </button>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="primary-button w-full flex items-center justify-center"
          >
            <Camera className="mr-2" size={20} />
            QR 코드 스캔
          </button>
        </section>
      </div>

      {/* 스캐너 모달 */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4 text-center">
              QR 코드를 스캔하세요
            </h3>
            <div className="bg-gray-100 w-full h-64 flex items-center justify-center mb-4">
              <button onClick={simulateScan} className="primary-button">
                스캔 시뮬레이션
              </button>
            </div>
            <button
              onClick={() => setShowScanner(false)}
              className="secondary-button w-full"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 확인 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Modal
            type="info"
            title="친구 추가"
            message={`${pendingCode}님을 친구로 추가하시겠습니까?`}
            confirmText="추가하기"
            cancelText="취소"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </div>
      )}
    </main>
  );
};

export default FriendInviteSystem;