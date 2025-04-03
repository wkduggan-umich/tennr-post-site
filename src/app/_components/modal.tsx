"use client"

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  };
  
  export default function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-xl max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }
  