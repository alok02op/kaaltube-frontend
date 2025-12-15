import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const typeStyles = {
  success: {
    icon: <CheckCircle className="text-green-500 w-6 h-6" />,
    bg: "bg-green-50 border-green-500 text-green-700",
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-500 w-6 h-6" />,
    bg: "bg-yellow-50 border-yellow-500 text-yellow-700",
  },
  error: {
    icon: <XCircle className="text-red-500 w-6 h-6" />,
    bg: "bg-red-50 border-red-500 text-red-700",
  },
};

const AlertPopup = ({ show, type = "success", message, onClose, autoClose = 3000 }) => {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => onClose?.(), autoClose);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  const style = typeStyles[type] || typeStyles.success;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 border rounded-xl shadow-md p-4 w-fit ${style.bg}`}
        >
          {style.icon}
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertPopup;
