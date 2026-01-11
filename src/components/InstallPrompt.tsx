"use client";

import { useEffect, useState } from "react";
import { X, Share, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        );

        setIsStandalone(
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes("android-app://")
        );
    }, []);

    useEffect(() => {
        if (!isStandalone && isIOS) {
            // Show prompt after a small delay to not annoy immediately
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [isStandalone, isIOS]);

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 bg-background border-t border-border shadow-2xl md:hidden"
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-lg">Instale o App</h3>
                        <p className="text-sm text-muted-foreground">
                            Adicione à tela inicial para a melhor experiência.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowPrompt(false)}
                        className="p-1 hover:bg-muted rounded-full"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        1. Toque em <Share className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="h-px bg-border flex-1" />
                    <div className="flex items-center gap-2">
                        2. Selecione <span className="font-medium whitespace-nowrap">Adicionar à Tela de Início</span> <PlusSquare className="h-4 w-4" />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
