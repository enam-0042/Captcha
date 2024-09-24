import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  btnText?: string;
}

function Modal({
  isOpen,
  onClose,
  title = "You're Verified",
  btnText = "Confirm",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6">
        <div className="text-center  mb-4">
          <p className="text-3xl font-semibold">{title}</p>
        </div>

        <div className="flex justify-center">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={onClose}
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
