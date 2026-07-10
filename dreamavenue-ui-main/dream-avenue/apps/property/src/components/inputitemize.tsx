import React from "react";

type EditConfirmPopupProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const EditConfirmPopup: React.FC<EditConfirmPopupProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
        <p className="mb-4 font-medium text-gray-800">
          Are you sure you want to delete itemized values?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConfirmPopup;
