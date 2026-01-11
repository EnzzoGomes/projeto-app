"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/context";

export default function RegisterPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const { login } = useApp();
    const router = useRouter();

    const handleVerify = () => {
        setIsVerifying(true);
        // Simulate Face ID check
        setTimeout(() => {
            setIsVerifying(false);
            setVerified(true);
        }, 2500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!verified && step === 2) return;

        if (step === 1) {
            setStep(2);
            return;
        }

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock login
        login("novo.usuario@email.com");
        router.push("/");
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Criar Conta</h1>
                    <p className="text-sm text-muted-foreground">
                        {step === 1 ? "Preencha seus dados pessoais" : "Verificação de Identidade"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {step === 1 ? (
                        <div className="space-y-4 anim-in slide-in-from-right-8 fade-in duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome Completo</label>
                                <Input placeholder="João da Silva" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CPF</label>
                                <Input placeholder="000.000.000-00" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input type="email" placeholder="joao@exemplo.com" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Telefone</label>
                                <Input type="tel" placeholder="(11) 99999-9999" required />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 anim-in slide-in-from-right-8 fade-in duration-300">
                            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 flex flex-col items-center justify-center text-center gap-4 bg-muted/30">
                                {verified ? (
                                    <>
                                        <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Identidade Confirmada</h3>
                                            <p className="text-sm text-muted-foreground">Seu rosto foi verificado com sucesso.</p>
                                        </div>
                                    </>
                                ) : isVerifying ? (
                                    <>
                                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                        <p className="text-sm text-muted-foreground">Analisando biometria facial...</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Camera className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Reconhecimento Facial</h3>
                                            <p className="text-sm text-muted-foreground">Precisamos confirmar que você é você.</p>
                                        </div>
                                        <Button type="button" variant="outline" onClick={handleVerify} className="w-full">
                                            Iniciar Câmera
                                        </Button>
                                    </>
                                )}
                            </div>

                            {!verified && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-blue-500/10 p-3 rounded-md text-blue-500">
                                    <ShieldCheck className="h-4 w-4" />
                                    Seus dados estão protegidos e criptografados.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-2">
                        <Button type="submit" className="w-full" disabled={step === 2 && !verified || isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : step === 1 ? (
                                "Continuar"
                            ) : (
                                "Finalizar Cadastro"
                            )}
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                        Entrar
                    </Link>
                </div>
            </div>
        </div>
    );
}
