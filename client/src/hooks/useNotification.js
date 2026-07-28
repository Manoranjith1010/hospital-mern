import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, removeNotification, clearNotifications } from '../features/notifications/notificationSlice';

/**
 * Custom hook for notifications
 */
export const useNotification = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  const notify = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = Date.now();
      dispatch(
        addNotification({
          id,
          message,
          type, // 'success', 'error', 'info', 'warning'
          duration,
        }),
      );

      if (duration) {
        setTimeout(() => {
          dispatch(removeNotification(id));
        }, duration);
      }

      return id;
    },
    [dispatch],
  );

  const remove = useCallback(
    (id) => {
      dispatch(removeNotification(id));
    },
    [dispatch],
  );

  const clear = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return {
    notifications,
    unreadCount,
    notify,
    remove,
    clear,
    success: (msg, duration) => notify(msg, 'success', duration),
    error: (msg, duration) => notify(msg, 'error', duration),
    warning: (msg, duration) => notify(msg, 'warning', duration),
    info: (msg, duration) => notify(msg, 'info', duration),
  };
};

export default useNotification;
