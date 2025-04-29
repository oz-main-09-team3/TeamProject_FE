import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

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

export default function Modal({
  type = "info",
  title = "알림",
  message = "",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}) {
  const { icon, confirmStyle, cancelStyle } = ICON_MAP[type];

  return (
    <div className="bg-white w-[420px] min-h-[200px] p-6 rounded-[8px] shadow-lg flex flex-col justify-between">
      {/* 내용 */}
      <div className="flex items-start gap-3">
        {icon}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-700 mt-1">{message}</p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className={`px-4 py-2 rounded text-sm font-medium ${cancelStyle}`}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded text-sm font-medium ${confirmStyle}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
