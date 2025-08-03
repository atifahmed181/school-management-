import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="transform transition-all duration-300 ease-in-out"
          style={{
            animation: 'slideInRight 0.3s ease-out',
          }}
        >
          <NotificationToast
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationContainer; 