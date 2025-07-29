import { configureStore } from '@reduxjs/toolkit';
import employeeSlice from '../features/employees/employeeSlice';
import responsableSlice from '../features/responsables/responsableSlice';
import notificationSlice from '../features/notifications/notificationSlice';
import uiSlice from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    employees: employeeSlice,
    responsables: responsableSlice,
    notifications: notificationSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;