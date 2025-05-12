import { useState } from 'react';

export const useWithdrawModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    console.log("탈퇴 확인 로직 실행");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return {
    isModalOpen,
    handleConfirm,
    handleCancel,
    openModal
  };
}; 