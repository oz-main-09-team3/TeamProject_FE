import React from 'react';
import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ICON_MAP = {
  error: {
    icon: <XCircle className="text-red-500 w-6 h-6" />,
    confirmStyle: "bg-red-500 hover:bg-red-600 text-white",
    cancelStyle: "border border-transparent text-red-500 hover:underline",
  },
  success: {
    icon: <CheckCircle className="text-green-500 w-6 h-6" />,
    confirmStyle: "bg-green-500 hover:bg-green-600 text-white",
    cancelStyle: "border border-transparent text-green-500 hover:underline",
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-500 w-6 h-6" />,
    confirmStyle: "bg-yellow-400 hover:bg-yellow-500 text-black",
    cancelStyle: "border border-transparent text-yellow-600 hover:underline",
  },
  info: {
    icon: <Info className="text-blue-500 w-6 h-6" />,
    confirmStyle: "bg-blue-500 hover:bg-blue-600 text-white",
    cancelStyle: "border border-transparent text-blue-500 hover:underline",
  },
};

/**
 * 모달 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 함수
 * @param {string} props.title - 모달 제목
 * @param {string} props.content - 모달 내용
 * @param {string} props.confirmText - 확인 버튼 텍스트
 * @param {string} props.cancelText - 취소 버튼 텍스트
 * @param {Function} props.onConfirm - 확인 버튼 클릭 시 실행할 함수
 * @param {Function} props.onCancel - 취소 버튼 클릭 시 실행할 함수
 * @param {boolean} props.isDanger - 위험한 작업인지 여부
 * @param {string} props.type - 모달 타입 (error, success, warning, info)
 * @returns {JSX.Element} 모달 컴포넌트
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDanger = false,
  type = 'info'
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const { icon, confirmStyle, cancelStyle } = ICON_MAP[type];

  const handleCancelModalCloseAndGoBack = () => {
    onCancel();
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white w-[420px] min-h-[200px] p-6 rounded-[8px] shadow-lg flex flex-col justify-between">
        {/* 내용 */}
        <div className="flex items-start gap-3">
          {icon}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-700 mt-1">{content}</p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 mt-6">
          {cancelText && (
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded text-sm font-medium ${cancelStyle}`}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-sm font-medium ${confirmStyle}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
