import React, {createContext, useContext, useState, ReactNode, useCallback} from 'react';
import ToastMessage, {ToastType} from '../components/common/ToastMessage';

interface ToastContextData {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

const DEFAULT_DURATION = 3000; // 3 seconds

export const ToastProvider: React.FC<ToastProviderProps> = ({children}) => {
  const [toastState, setToastState] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success',
  });
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType, duration: number = DEFAULT_DURATION) => {
      // Clear any existing timeout if a new toast is shown quickly
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }

      setToastState({isVisible: true, message, type});

      const timeout = setTimeout(() => {
        setToastState(prevState => ({...prevState, isVisible: false}));
        setHideTimeout(null);
      }, duration);
      setHideTimeout(timeout);
    },
    [hideTimeout],
  );

  // // Optional: Function to hide toast manually if ever needed
  // const hideToast = useCallback(() => {
  //   if (hideTimeout) {
  //     clearTimeout(hideTimeout);
  //     setHideTimeout(null);
  //   }
  //   setToastState(prevState => ({ ...prevState, isVisible: false }));
  // }, [hideTimeout]);

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      <ToastMessage
        isVisible={toastState.isVisible}
        message={toastState.message}
        type={toastState.type}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextData => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
