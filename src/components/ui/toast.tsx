import * as React from "react";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "loading" | "info";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
};

type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const timeoutRefs = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = React.useCallback((id: string) => {
    // Limpa o timeout se existir
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = React.useCallback((toast: Omit<Toast, "id">): string => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration (default 3 seconds, except for loading)
    if (toast.type !== "loading") {
      const duration = toast.duration ?? 3000;
      const timeoutId = setTimeout(() => {
        timeoutRefs.current.delete(id);
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
      timeoutRefs.current.set(id, timeoutId);
    }

    return id;
  }, []);

  // Cleanup: limpa todos os timeouts quando o componente for desmontado
  React.useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeoutRefs.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 max-w-[420px] w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, removeToast }: { toast: Toast; removeToast: (id: string) => void }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const removeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    // Trigger animation
    const timeoutId = setTimeout(() => setIsVisible(true), 10);
    
    // Cleanup: limpa o timeout se o componente for desmontado
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Cleanup: limpa o timeout de remoção quando o componente for desmontado
  React.useEffect(() => {
    return () => {
      if (removeTimeoutRef.current) {
        clearTimeout(removeTimeoutRef.current);
      }
    };
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    // Limpa qualquer timeout anterior antes de criar um novo
    if (removeTimeoutRef.current) {
      clearTimeout(removeTimeoutRef.current);
    }
    removeTimeoutRef.current = setTimeout(() => {
      removeTimeoutRef.current = null;
      removeToast(toast.id);
    }, 200);
  };

  const icons = {
    success: <CheckCircle2 className="size-5 text-green-500" />,
    error: <AlertCircle className="size-5 text-red-500" />,
    loading: <Loader2 className="size-5 text-blue-500 animate-spin" />,
    info: <AlertCircle className="size-5 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-green-500/10 border-green-500/20",
    error: "bg-red-500/10 border-red-500/20",
    loading: "bg-blue-500/10 border-blue-500/20",
    info: "bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-200",
        bgColors[toast.type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>
        )}
      </div>
      {toast.type !== "loading" && (
        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

