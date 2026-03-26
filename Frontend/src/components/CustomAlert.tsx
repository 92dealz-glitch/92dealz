'use client';

import React from 'react';

interface CustomAlertProps {
  message: string;
  title?: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, title = 'Alert', onClose }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 dark:bg-orange-950/30 p-2 rounded-full text-orange-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell ring-orange-500">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            {message}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
