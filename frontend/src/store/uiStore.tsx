import { create } from "zustand";
import React from "react";

// Tipos de severidad permitidos
type Severity = "success" | "warning" | "error";

// Interfaz del estado de la UI
interface UIState {
  openNotifications: boolean;
  messageNotifications: string;
  notificationActions: React.ReactNode | null;
  notificationSeverity: Severity | null;

  openAlert: (
    message?: string,
    severity?: Severity,
    actions?: React.ReactNode | null
  ) => void;

  closeAlert: () => void;
}

const useUIStore = create<UIState>((set) => ({
  openNotifications: false,
  messageNotifications: "",
  notificationActions: null,
  notificationSeverity: null,

  openAlert: (message = "", severity = "error", actions = null) => {
    set({
      openNotifications: true,
      messageNotifications: message,
      notificationSeverity: severity,
      notificationActions: actions,
    });
  },

  closeAlert: () => {
    set({ openNotifications: false });
  },
}));

export default useUIStore;
