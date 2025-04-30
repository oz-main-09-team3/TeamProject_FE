import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Modal from "../components/Modal";

const FriendInviteSystem = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCode, setPendingCode] = useState("");

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
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center p-8 w-full max-w-lg dark:text-darkdark bg-yl100 dark:bg-yl100 rounded-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          친구 초대 시스템
        </h1>

        {/* 내 초대 코드 */}
        <div className="flex flex-col items-center mb-8 w-full">
          <h2 className="text-lg font-semibold mb-2">내 초대 코드</h2>
          <div className="border-2 border-lightGold dark:border-darkOrange rounded-lg p-4 mb-4">
            {inviteUrl && (
              <QRCodeCanvas
                value={inviteUrl}
                size={220}
                level="H"
                includeMargin={true}
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center w-full gap-2 mb-4">
            <input
              type="text"
              value={inviteUrl}
              readOnly
              className="flex-grow border rounded px-3 py-2 bg-gray-100"
            />
            <button
              onClick={() => navigator.clipboard.writeText(inviteUrl)}
              className="bg-lightGold text-lighttext hover:bg-lightOrange dark:bg-darkOrange dark:text-darkdark dark:hover:bg-darkCopper dark:hover:text-yl100 px-4 py-2 rounded w-full sm:w-auto"
            >
              복사
            </button>
          </div>

          <button
            onClick={generateInviteCode}
            className="bg-lightOrange px-6 py-2 rounded dark:text-yl100 hover:bg-lightGold w-full dark:bg-darkCopper dark:hover:text-darkdark dark:hover:bg-darkOrange "
          >
            새 코드 생성
          </button>
        </div>

        {/* 친구 추가 */}
        <div className="w-full border-t border-lightGold pt-6">
          <h2 className="text-lg font-semibold mb-4 text-center">친구 추가</h2>

          <div className="flex flex-col sm:flex-row w-full gap-2 mb-4">
            <input
              type="text"
              placeholder="친구 초대 코드 입력"
              className="flex-grow border rounded px-3 py-2"
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <button
              onClick={() => {
                setPendingCode(inviteCode);
                setIsModalOpen(true);
              }}
              className="px-6 py-2 rounded bg-lightGold text-lighttext hover:bg-lightOrange dark:bg-darkOrange dark:text-darkdark dark:hover:bg-darkCopper dark:hover:text-yl100 w-full sm:w-auto"
            >
              추가
            </button>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center justify-center w-full px-4 py-3 rounded bg-lightOrange text-lighttext dark:text-yl100 dark:hover:text-darkdark hover:bg-lightGold dark:bg-darkCopper dark:hover:bg-darkOrange"
          >
            <Camera className="mr-2" size={20} />
            QR 코드 스캔
          </button>
        </div>
      </div>

      {/* 스캐너 모달 */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4 text-center">
              QR 코드를 스캔하세요
            </h3>
            <div className="bg-gray-100 w-full h-64 flex items-center justify-center mb-4">
              <button
                onClick={simulateScan}
                className="bg-lightOrange text-lighttext px-4 py-2 rounded"
              >
                스캔 시뮬레이션
              </button>
            </div>
            <button
              onClick={() => setShowScanner(false)}
              className="w-full bg-lightGold text-lighttext px-4 py-2 rounded"
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
