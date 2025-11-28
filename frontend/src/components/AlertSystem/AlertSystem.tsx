import React from "react";

// component
import AlertComponent from "./AlertComponent";

// store
import useUIStore from "../../store/uiStore";

const AlertSystem: React.FC = () => {
  const {
    openNotifications,
    messageNotifications,
    notificationSeverity,
    closeAlert,
  } = useUIStore();

  return (
    <AlertComponent
      open={openNotifications}
      message={messageNotifications}
      severity={notificationSeverity ?? "error"} // por defecto "error"
      autoHideDuration={6000}
      setOpen={closeAlert}
    />
  );
};

export default AlertSystem;