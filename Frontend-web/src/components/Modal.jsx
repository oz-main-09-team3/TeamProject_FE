import React, { useEffect, useRef } from 'react';
import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import useUiStore from '../store/uiStore';

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
  confirm: {
    icon: <Info className="text-blue-500 w-6 h-6" />,
    confirmStyle: "bg-blue-500 hover:bg-blue-600 text-white",
    cancelStyle: "border border-transparent text-blue-500 hover:underline",
  },
};

/**
 * 모달 컴포넌트 - Zustand와 통합
 */
const Modal = ({ type = 'info' }) => {
  const modalRef = useRef();
  
  // Zustand 스토어 사용
  const { 
    modals, 
    closeModal 
  } = useUiStore();
  
  const modal = modals[type];
  const isOpen = modal?.isOpen || false;
  const title = modal?.title || '';
  const content = modal?.content || '';
  const confirmText = modal?.confirmText || '확인';
  const cancelText = modal?.cancelText || '취소';
  const onConfirm = modal?.onConfirm;
  const onCancel = modal?.onCancel;
  
  // ESC 키 누르면 모달 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal(type);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal, type]);

  // 모달이 열려있지 않으면 렌더링 안함
  if (!isOpen) return null;

  const { icon, confirmStyle, cancelStyle } = ICON_MAP[type];
  
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeModal(type);
  };
  
  const handleCancel = () => {
    if (onCancel) onCancel();
    closeModal(type);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 opacity-100"
      role="dialog"
      aria-modal="true"
      ref={modalRef}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200 opacity-100" onClick={() => closeModal(type)} />
      <div className="relative bg-white w-[420px] min-h-[200px] p-6 rounded-[8px] shadow-lg flex flex-col justify-between transform transition-all duration-200 scale-100 opacity-100">
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
          {(type === 'confirm' || type === 'warning' || type === 'error') && cancelText && (
            <button
              onClick={handleCancel}
              className={`px-4 py-2 rounded text-sm font-medium ${cancelStyle}`}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
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