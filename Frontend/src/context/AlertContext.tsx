'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomAlert from '../components/CustomAlert';
import VendorTasksModal from '../components/dashboard/VendorTasksModal';

interface AlertState {
  id: number;
  message: string;
  title?: string;
  type: 'alert' | 'confirm' | 'prompt' | 'vendor_upgrade' | 'phone_verification' | 'vendor_tasks';
  initialValue?: string;
  resolve: (value: any) => void;
}

interface AlertContextType {
  showAlert: (message: string, title?: string) => void;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
  showPrompt: (message: string, initialValue?: string, title?: string) => Promise<string | null>;
  showVendorUpgrade: (message: string, title?: string) => Promise<boolean>;
  showPhoneVerification: (message: string, title?: string) => Promise<boolean>;
  showVendorTasks: () => void;
  hideAlert: (value?: any) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (message: string, title?: string) => {
    setAlert({ id: Date.now(), message, title, type: 'alert', resolve: () => {} });
  };

  const showConfirm = (message: string, title?: string) => {
    return new Promise<boolean>((resolve) => {
      setAlert({ id: Date.now(), message, title, type: 'confirm', resolve });
    });
  };

  const showPrompt = (message: string, initialValue?: string, title?: string) => {
    return new Promise<string | null>((resolve) => {
      setAlert({ id: Date.now(), message, title, type: 'prompt', initialValue, resolve });
    });
  };

  const showVendorUpgrade = (message: string, title?: string) => {
    return new Promise<boolean>((resolve) => {
      setAlert({ id: Date.now(), message, title, type: 'vendor_upgrade', resolve });
    });
  };

  const showPhoneVerification = (message: string, title?: string) => {
    return new Promise<boolean>((resolve) => {
      setAlert({ id: Date.now(), message, title, type: 'phone_verification', resolve });
    });
  };

  const showVendorTasks = () => {
    setAlert({ id: Date.now(), message: "", type: 'vendor_tasks', resolve: () => {} });
  };

  const hideAlert = (value?: any) => {
    if (alert) {
      alert.resolve(value);
    }
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, showPrompt, showVendorUpgrade, showPhoneVerification, showVendorTasks, hideAlert }}>
      {children}
      {alert && alert.type !== 'vendor_tasks' && (
        <CustomAlert
          key={alert.id || `${alert.type}-${alert.title}`}
          message={alert.message}
          title={alert.title}
          type={alert.type}
          initialValue={alert.initialValue}
          onClose={hideAlert}
        />
      )}
      {alert && alert.type === 'vendor_tasks' && (
        <VendorTasksModal 
          isOpen={true} 
          onClose={hideAlert} 
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
