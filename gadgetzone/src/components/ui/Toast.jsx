// ============================================================
// src/components/ui/Toast.jsx
// Production-grade toast notification system
// ============================================================

import { createContext, useContext, useState, useCallback, useRef } from "react";
import "./Toast.css";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timerRef = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timerRef.current[id]);
    delete timerRef.current[id];
  }, []);

  const toast = useCallback(
    ({ type = "info", title, message, duration = 3500 }) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev.slice(-4), { id, type, title, message }]);
      timerRef.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const success = useCallback((msg, title = "Success") => toast({ type: "success", title, message: msg }), [toast]);
  const error = useCallback((msg, title = "Error") => toast({ type: "error", title, message: msg }), [toast]);
  const info = useCallback((msg, title = "Info") => toast({ type: "info", title, message: msg }), [toast]);
  const warning = useCallback((msg, title = "Warning") => toast({ type: "warning", title, message: msg }), [toast]);

  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, dismiss }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="alert">
            <div className={`toast-icon toast-icon-${t.type}`}>{icons[t.type]}</div>
            <div className="toast-body">
              {t.title && <p className="toast-title">{t.title}</p>}
              {t.message && <p className="toast-message">{t.message}</p>}
            </div>
            <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">×</button>
            <div className="toast-progress" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
