import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onConfirm, onCancel, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-yellow-500 w-8 h-8 mr-2" />
          <h2 className="text-xl font-semibold">Confirm Delete</h2>
        </div>
        <p className="mt-4">Are you sure you want to delete "{itemName}"?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            className="bg-gray-300 text-custom-gradient px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
