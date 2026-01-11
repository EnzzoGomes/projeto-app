"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Target, PlusCircle, Wallet, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Onboarding() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem("mission-market:onboarding-seen");
        if (!hasSeenOnboarding) {
            setShowOnboarding(true);
        }
    }, []);

    const steps = [
        {
            icon: Target,
            title: "Encontre Missões",
            description: "Navegue por tarefas disponíveis perto de você e ganhe dinheiro extra fazendo o que gosta."
        },
        {
            icon: PlusCircle,
            title: "Crie Missões",
            description: "Precisa de ajuda? Publique uma missão e encontre alguém qualificado para realizá-la."
        },
        {
            icon: Wallet,
            title: "Pagamento Direto",
            description: "Receba o valor total em mãos (PIX/Dinheiro). A plataforma cobra apenas 15% de taxa de serviço."
        },
        {
            icon: Shield,
            title: "Segurança Garantida",
            description: "Todos os usuários passam por verificação de identidade com Face ID e documentos."
        }
    ];

    const handleComplete = () => {
        localStorage.setItem("mission-market:onboarding-seen", "true");
        setShowOnboarding(false);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    if (!showOnboarding) return null;

    const step = steps[currentStep];
    const Icon = step.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-card border rounded-xl p-8 max-w-md w-full space-y-6 relative"
                >
                    <button
                        onClick={handleComplete}
                        className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="h-10 w-10 text-primary" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all ${index === currentStep
                                        ? "bg-primary w-8"
                                        : index < currentStep
                                            ? "bg-primary w-2"
                                            : "bg-muted w-2"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="flex-1"
                            >
                                Voltar
                            </Button>
                        )}
                        <Button onClick={handleNext} className="flex-1">
                            {currentStep === steps.length - 1 ? "Começar" : "Próximo"}
                        </Button>
                    </div>

                    <button
                        onClick={handleComplete}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
                    >
                        Pular tutorial
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
