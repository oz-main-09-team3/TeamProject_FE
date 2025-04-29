import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const FriendInviteSystem = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [showScanner, setShowScanner] = useState(false);

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

  const simulateScan = () => {
    setShowScanner(false);
    setTimeout(() => {
      addFriendByCode("scanned_code_123");
    }, 500);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="flex flex-col items-center p-8 w-full max-w-lg bg-white rounded-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          친구 초대 시스템
        </h1>

        {/* 내 초대 코드 */}
        <div className="flex flex-col items-center mb-8 w-full">
          <h2 className="text-lg font-semibold mb-2">내 초대 코드</h2>

          <div className="border-2 border-gray-200 rounded-lg p-4 mb-4">
            {inviteUrl && (
              <QRCodeCanvas
                value={inviteUrl}
                size={220} // 살짝 줄여서 반응형 대응
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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
            >
              복사
            </button>
          </div>

          <button
            onClick={generateInviteCode}
            className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300 w-full"
          >
            새 코드 생성
          </button>
        </div>

        {/* 친구 추가 */}
        <div className="w-full border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4 text-center">친구 추가</h2>

          <div className="flex flex-col sm:flex-row w-full gap-2 mb-4">
            <input
              type="text"
              placeholder="친구 초대 코드 입력"
              className="flex-grow border rounded px-3 py-2"
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <button
              onClick={() => addFriendByCode(inviteCode)}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
            >
              추가
            </button>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center justify-center w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
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
            <div className="bg-gray-200 w-full h-64 flex items-center justify-center mb-4">
              <button
                onClick={simulateScan}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                스캔 시뮬레이션
              </button>
            </div>
            <button
              onClick={() => setShowScanner(false)}
              className="w-full bg-gray-300 px-4 py-2 rounded"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default FriendInviteSystem;
