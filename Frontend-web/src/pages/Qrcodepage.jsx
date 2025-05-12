import React, { useState, useEffect } from "react";
import { Camera, ChevronLeft } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const FriendInviteSystem = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCode, setPendingCode] = useState("");

  const navigate = useNavigate();

  const generateInviteCode = () => {
    const userId = "user123";
    const newCode = userId + "_" + Math.random().toString(36).substring(2, 10);
    setInviteCode(newCode);

    const url = `https://your-app.com/friend/add?code=${newCode}`;
    setInviteUrl(url);
  };

  useEffect(() => {
    generateInviteCode();
  }, []);

  const addFriendByCode = (code) => {
    alert(`코드 ${code}로 친구 추가 시도`);
  };

  const handleConfirm = () => {
    addFriendByCode(pendingCode);
    setIsModalOpen(false);
    setPendingCode("");
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
            {inviteUrl && (
              <QRCodeCanvas
                value={inviteUrl}
                size={220}
                level="H"
                includeMargin={true}
              />
            )}
          </div>

          {/* 복사 버튼 */}
          <div className="flex flex-col sm:flex-row items-center w-full gap-2 mb-4">
            <input
              type="text"
              value={inviteUrl}
              readOnly
              className="form-input flex-1"
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(inviteUrl)}
              className="secondary-button w-full sm:w-auto px-6 py-2 text-base rounded-full whitespace-nowrap flex items-center justify-center min-w-[80px]"
            >
              복사
            </button>
          </div>

          <button
            onClick={generateInviteCode}
            className="primary-button w-full"
          >
            새 코드 생성
          </button>
        </section>

        {/* 친구 추가 */}
        <section className="w-full border-t border-lightGold pt-6">
          <h2 className="text-lg font-semibold mb-4 text-center">친구 추가</h2>

          {/* 추가 버튼 */}
          <div className="flex flex-col sm:flex-row items-center w-full gap-2 mb-4">
            <input
              type="text"
              placeholder="친구 초대 코드 입력"
              className="form-input flex-1"
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                setPendingCode(inviteCode);
                setIsModalOpen(true);
              }}
              className="secondary-button w-full sm:w-auto px-6 py-2 text-base rounded-full whitespace-nowrap flex items-center justify-center min-w-[80px]"
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
            message="친구를 추가하시겠습니까?"
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
