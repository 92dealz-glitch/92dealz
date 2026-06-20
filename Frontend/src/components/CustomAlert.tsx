"use client";

import React, { useState } from 'react';

interface CustomAlertProps {
  message: string;
  title?: string;
  type?: 'alert' | 'confirm' | 'prompt' | 'vendor_upgrade' | 'phone_verification';
  initialValue?: string;
  onClose: (value?: any) => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ 
  message, 
  title = 'Alert', 
  type = 'alert', 
  initialValue = '', 
  onClose 
}) => {
  const [inputValue, setInputValue] = useState(initialValue);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-900/40 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200 border border-zinc-100">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#E9E0D4] p-3 rounded-2xl text-[#708238]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 tracking-tight">{title}</h3>
          </div>
          
          <p className="text-zinc-600 font-bold mb-8 leading-relaxed">
            {message}
          </p>

          {type === 'prompt' && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl px-4 py-3 mb-6 outline-none focus:border-[#708238] focus:ring-4 focus:ring-[#E9E0D4]/30 transition-all font-bold"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onClose(inputValue);
                if (e.key === 'Escape') onClose(null);
              }}
            />
          )}

          <div className="flex gap-3">
            {type === 'alert' && (
              <button
                onClick={() => onClose()}
                className="w-full bg-[#708238] hover:bg-[#5E6E2F] text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-[#E9E0D4] active:scale-[0.98]"
              >
                Continue
              </button>
            )}
            {type === 'confirm' && (
              <>
                <button
                  onClick={() => onClose(false)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-black py-4 rounded-xl transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onClose(true)}
                  className="flex-1 bg-[#708238] hover:bg-[#5E6E2F] text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-[#E9E0D4] active:scale-[0.98]"
                >
                  Confirm
                </button>
              </>
            )}
            {type === 'prompt' && (
              <>
                <button
                  onClick={() => onClose(null)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-black py-4 rounded-xl transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onClose(inputValue)}
                  className="flex-1 bg-[#708238] hover:bg-[#5E6E2F] text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-[#E9E0D4] active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </>
            )}
            {(type === 'vendor_upgrade' || type === 'phone_verification') && (
              <>
                <button
                  onClick={() => onClose(false)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold py-3 rounded-xl transition-all active:scale-[0.98] text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onClose(true)}
                  className="flex-1 bg-[#708238] hover:bg-[#5E6E2F] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#E9E0D4] active:scale-[0.98] text-sm"
                >
                  Go to Account Settings
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;


