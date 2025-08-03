import { useNotifications } from '../contexts/NotificationContext';

export const useNotification = () => {
  const { addNotification } = useNotifications();

  const success = (title: string, message: string) => {
    addNotification({
      type: 'success',
      title,
      message,
      userId: 1, // This should come from auth context
    });
  };

  const error = (title: string, message: string) => {
    addNotification({
      type: 'error',
      title,
      message,
      userId: 1, // This should come from auth context
    });
  };

  const warning = (title: string, message: string) => {
    addNotification({
      type: 'warning',
      title,
      message,
      userId: 1, // This should come from auth context
    });
  };

  const info = (title: string, message: string) => {
    addNotification({
      type: 'info',
      title,
      message,
      userId: 1, // This should come from auth context
    });
  };

  return {
    success,
    error,
    warning,
    info,
  };
}; 