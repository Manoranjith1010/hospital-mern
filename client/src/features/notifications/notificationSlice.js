import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
};

/**
 * Notification slice
 */
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: 'info',
        ...action.payload,
      };
      state.notifications.push(notification);
      if (action.payload.type === 'unread') {
        state.unreadCount += 1;
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    markAsRead: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, removeNotification, clearNotifications, markAsRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
