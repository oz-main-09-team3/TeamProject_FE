import React, { useEffect, useRef } from 'react';
import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import useUiStore from '../store/uiStore';

const ICON_MAP = {
  error: {
    icon: <XCircle className="text-red-500 w-6 h-6" aria-hidden="true" />,
    confirmStyle: "bg-red-500 hover:bg-red-600 text-white",
    cancelStyle: "border border-transparent text-red-500 hover:underline",
    role: "alertdialog",
  },
  success: {
    icon: <CheckCircle className="text-green-500 w-6 h-6" aria-hidden="true" />,
    confirmStyle: "bg-green-500 hover:bg-green-600 text-white",
    cancelStyle: "border border-transparent text-green-500 hover:underline",
    role: "alertdialog",
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-500 w-6 h-6" aria-hidden="true" />,
    confirmStyle: "bg-yellow-400 hover:bg-yellow-500 text-black",
    cancelStyle: "border border-transparent text-yellow-600 hover:underline",
    role: "alertdialog",
  },
  info: {
    icon: <Info className="text-blue-500 w-6 h-6" aria-hidden="true" />,
    confirmStyle: "bg-blue-500 hover:bg-blue-600 text-white",
    cancelStyle: "border border-transparent text-blue-500 hover:underline",
    role: "dialog",
  },
  confirm: {
    icon: <Info className="text-blue-500 w-6 h-6" aria-hidden="true" />,
    confirmStyle: "bg-blue-500 hover:bg-blue-600 text-white",
    cancelStyle: "border border-transparent text-blue-500 hover:underline",
    role: "dialog",
  },
};

/**
 * 모달 컴포넌트 - Zustand와 통합
 * @param {Object} props
 * @param {string} props.type - 모달 타입 ('error' | 'success' | 'warning' | 'info' | 'confirm')
 * @param {boolean} props.closeOnOutsideClick - 외부 클릭 시 닫기 여부 (기본값: true)
 */
const Modal = ({ type = 'info', closeOnOutsideClick = true }) => {
  const modalRef = useRef();
  const contentRef = useRef();
  
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
    
    // 모달이 열릴 때 포커스 설정
    if (contentRef.current) {
      contentRef.current.focus();
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal, type]);

  // 모달이 열려있지 않으면 렌더링 안함
  if (!isOpen) return null;

  const { icon, confirmStyle, cancelStyle, role } = ICON_MAP[type];
  
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeModal(type);
  };
  
  const handleCancel = () => {
    if (onCancel) onCancel();
    closeModal(type);
  };

  const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && e.target === modalRef.current) {
      closeModal(type);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 opacity-100"
      role={role}
      aria-modal="true"
      aria-labelledby={`modal-title-${type}`}
      aria-describedby={`modal-content-${type}`}
      ref={modalRef}
      onClick={handleOutsideClick}
    >
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200 opacity-100"
        aria-hidden="true"
      />
      <div 
        className="relative bg-white w-[420px] min-h-[200px] p-6 rounded-[8px] shadow-lg flex flex-col justify-between transform transition-all duration-200 scale-100 opacity-100"
        ref={contentRef}
        tabIndex={-1}
      >
        {/* 내용 */}
        <div className="flex items-start gap-3">
          {icon}
          <div>
            <h2 
              id={`modal-title-${type}`}
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
            <p 
              id={`modal-content-${type}`}
              className="text-sm text-gray-700 mt-1"
            >
              {content}
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 mt-6">
          {(type === 'confirm' || type === 'warning' || type === 'error') && cancelText && (
            <button
              onClick={handleCancel}
              className={`px-4 py-2 rounded text-sm font-medium ${cancelStyle}`}
              aria-label={cancelText}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded text-sm font-medium ${confirmStyle}`}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;