import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDiary, deleteDiary } from "../service/diaryApi";
import Modal from "../components/Modal";
import testimage from "../assets/profile.png";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";

const DiaryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const getDiary = async () => {
      try {
        const res = await fetchDiary(id);
        setDiary(res.data);
      } catch (err) {
        // 에러 처리
        alert("일기 정보를 불러오지 못했습니다.");
        navigate(-1);
      }
    };
    getDiary();
  }, [id, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleConfirmEdit = () => {
    setIsEditModalOpen(false);
    navigate(`/diary/edit/${id}`);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDiary(id);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err) {
      alert("삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate(-1);
  };

  if (!diary) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-6xl mx-auto shadow-xl p-10 font-sans rounded-2xl border-4 border-lightGold dark:border-darkOrange bg-yl100 dark:bg-darktext text-lighttext dark:text-darkbg transition-colors duration-300">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleGoBack}
                className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="p-3 bg-lightYellow dark:bg-darkCopper dark:text-darktext rounded-full w-10 h-10 flex items-center justify-center hover:bg-lightYellow/80 dark:hover:bg-darkCopper/80 transition-colors"
                title="수정"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors"
                title="삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="md:w-2/3 w-full flex flex-col">
              <div className="flex justify-center mb-8">
                <div className="w-28 h-28 rounded-full flex justify-center items-center overflow-hidden relative">
                  <div className="absolute inset-0 rounded-full"></div>
                  <img
                    src={testimage}
                    alt="현재 기분"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-2xl font-bold mb-4 dark:text-darkBg">
                {diary.date || "날짜 정보 없음"}
              </div>

              <div className="w-full rounded-lg border border-lightGold dark:border-darkCopper shadow-sm p-5 dark:text-darkBg bg-white min-h-[320px]">
                <p>테스트 1</p>
                <p>테스트 2</p>
                <div className="mt-4">
                  <div className="font-bold">제목: {diary.title}</div>
                  <div className="mt-2">내용: {diary.content}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="일기를 삭제하시겠습니까?"
        content="삭제된 일기는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        isDanger={true}
        loading={isDeleting}
      />
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        title="삭제 완료"
        content="일기가 삭제되었습니다."
        confirmText="확인"
        onConfirm={handleCloseSuccessModal}
        type="success"
      />
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        title="수정하시겠습니까?"
        content="일기를 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
      />
    </div>
  );
};

export default DiaryDetailPage; 