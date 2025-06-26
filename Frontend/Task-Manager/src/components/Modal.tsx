import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const Modal = ({ children, isOpen, onClose, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center rounded-xl">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="modal-container bg-gradient-to-br from-[#2A1B5D] to-[#3D2A7D] border border-[#4C35A0]/30 rounded-xl shadow-2xl shadow-purple-500/20">
          {/* Modal header */}
          <div className="modal-header flex items-center justify-between p-4 md:p-5 border-b border-[#4C35A0]/20 rounded-t">
            <h3 className="modal-title text-xl font-semibold text-white">
              {title}
            </h3>

            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gradient-to-r hover:from-blue-800/30 hover:to-purple-600/30 hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              onClick={onClose}>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
