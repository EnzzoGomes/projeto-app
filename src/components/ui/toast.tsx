"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { ...toast, id }]);

        if (toast.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration || 5000);
        }
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        layout
                        className="pointer-events-auto"
                    >
                        <div className={`
                            relative overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-xl
                            ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : ''}
                            ${toast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : ''}
                            ${toast.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : ''}
                        `}>
                            <div className="flex gap-3">
                                <div className="shrink-0 mt-0.5">
                                    {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
                                    {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
                                    {toast.type === 'warning' && <AlertTriangle className="h-5 w-5" />}
                                    {toast.type === 'info' && <Info className="h-5 w-5" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-sm">{toast.title}</h3>
                                    {toast.message && (
                                        <p className="text-sm opacity-90 mt-1 text-foreground/80">
                                            {toast.message}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="shrink-0 text-foreground/40 hover:text-foreground transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
