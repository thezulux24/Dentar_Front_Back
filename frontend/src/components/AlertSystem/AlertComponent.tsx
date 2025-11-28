import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Severity = "success" | "warning" | "error";

interface AlertComponentProps {
  open: boolean;
  message: string;
  severity: Severity;
  autoHideDuration?: number;
  setOpen: (value: boolean) => void;
}

const getBackgroundColor = (severity: Severity): string => {
  switch (severity) {
    case "error":
      return "#f44336"; // rojo
    case "warning":
      return "#ff9800"; // naranja
    case "success":
    default:
      return "#4caf50"; // verde
  }
};

const AlertComponent: React.FC<AlertComponentProps> = ({
  open,
  message,
  severity,
  autoHideDuration = 5000,
  setOpen,
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            top: "10px",
            left: "50%",
            backgroundColor: getBackgroundColor(severity),
            padding: "12px 16px",
            borderRadius: "6px",
            color: "#fff",
            width: "320px",
            textAlign: "center",
            zIndex: 10000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 10.98a1 1 0 1 1 2 0v6a1 1 0 1 1-2 0zm1-4.929a1 1 0 1 0 0 2a1 1 0 0 0 0-2" />
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 0 16 0a8 8 0 0 0-16 0"
                clipRule="evenodd"
              />
            </svg>
            <span style={{ fontSize: "14px", fontWeight: 500 }}>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertComponent;
