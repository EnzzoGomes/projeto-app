"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, CheckCircle2, ShieldCheck, Loader2, Upload, FileText, User, Mail, Phone, CreditCard, AlertCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { useToast } from "@/components/ui/toast";

type Step = 1 | 2 | 3;

export default function RegisterPage() {
    const [step, setStep] = useState<Step>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [faceVerified, setFaceVerified] = useState(false);
    const [documentUploaded, setDocumentUploaded] = useState(false);
    const [cpf, setCpf] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { registerUser, user } = useApp();
    const router = useRouter();
    const { addToast } = useToast();

    // Se já estiver logado, redirecionar para home
    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const validateCPF = (cpf: string) => {
        const cleaned = cpf.replace(/\D/g, '');
        return cleaned.length === 11;
    };

    const formatCPF = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
        if (match) {
            return [match[1], match[2], match[3], match[4]].filter(Boolean).join('.').replace(/\.(\d{2})$/, '-$1');
        }
        return value;
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value);
        setCpf(formatted);
    };

    const handleFaceVerify = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setFaceVerified(true);
        }, 3000);
    };

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDocumentUploaded(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            if (!validateCPF(cpf)) {
                alert("CPF inválido");
                return;
            }
            setStep(2);
            return;
        }

        if (step === 2) {
            if (!documentUploaded) {
                alert("Por favor, envie uma foto do seu documento");
                return;
            }
            setStep(3);
            return;
        }

        if (step === 3) {
            if (!faceVerified) {
                alert("Por favor, complete a verificação facial");
                return;
            }

            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulando processamento visual

            // Create real user session
            registerUser({
                name: name,
                email: email,
                password: password,
                cpf: cpf
            });

            router.push("/");
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                    <div className={`h-2 w-2 rounded-full transition-all ${s === step ? 'bg-primary w-8' :
                        s < step ? 'bg-primary' : 'bg-muted'
                        }`} />
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Criar Conta Segura</h1>
                    <p className="text-sm text-muted-foreground">
                        {step === 1 && "Preencha seus dados pessoais"}
                        {step === 2 && "Envie foto do seu documento"}
                        {step === 3 && "Verificação de identidade"}
                    </p>
                </div>

                {renderStepIndicator()}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Step 1: Personal Data */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Nome Completo
                                </label>
                                <Input
                                    placeholder="João da Silva Santos"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    CPF
                                </label>
                                <Input
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={handleCPFChange}
                                    maxLength={14}
                                    required
                                />
                                {cpf && !validateCPF(cpf) && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        CPF inválido
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="joao@exemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    Telefone
                                </label>
                                <Input type="tel" placeholder="(11) 99999-9999" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    Sua Senha
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Identidade e Segurança (Stripe Identity) */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="rounded-lg border border-border bg-card p-6 text-center space-y-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Verificação Oficial</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Para garantir a segurança de todos, usamos tecnologia bancária para verificar seu documento e rosto.
                                    </p>
                                </div>

                                {documentUploaded ? (
                                    <div className="bg-green-500/10 text-green-500 p-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Identidade Verificada com Sucesso
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-12 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
                                        onClick={async () => {
                                            setIsLoading(true);
                                            try {
                                                const res = await fetch('/api/identity', {
                                                    method: 'POST',
                                                    body: JSON.stringify({ userId: 'temp-user', email: 'user@example.com' })
                                                });
                                                const data = await res.json();

                                                if (data.error && data.message.includes("SANDBOX_MODE")) {
                                                    addToast({
                                                        type: "info",
                                                        title: "Modo Simulação",
                                                        message: "Simulando verificação (Stripe Identity requer chaves reais).",
                                                        duration: 4000
                                                    });
                                                    setTimeout(() => {
                                                        setDocumentUploaded(true);
                                                        setFaceVerified(true);
                                                        addToast({ type: "success", title: "Verificado!", message: "Identidade confirmada." });
                                                        setIsLoading(false);
                                                    }, 2000);
                                                } else if (data.url) {
                                                    window.location.href = data.url;
                                                }
                                            } catch (error) {
                                                addToast({ type: "error", title: "Erro", message: "Não foi possível iniciar a verificação." });
                                                setIsLoading(false);
                                            }
                                        }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Conectando à Verificação...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Iniciar Verificação de Identidade
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground text-center px-4">
                                Seus dados são processados de forma segura pela <strong>Stripe Identity</strong> seguindo as normas da <strong>LGPD</strong>.
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300 text-center">
                            <div className="py-8">
                                <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Tudo Pronto!</h2>
                                <p className="text-muted-foreground">
                                    Sua conta foi criada e sua identidade verificada. Você já pode aceitar missões.
                                </p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg text-left text-sm space-y-2 border border-border">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nome:</span>
                                    <span className="font-medium">{name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">CPF:</span>
                                    <span className="font-medium">{cpf}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="text-green-500 font-medium flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Verificado
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-2 space-y-3">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || (step === 2 && !documentUploaded) || (step === 3 && !faceVerified)}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Finalizando...
                                </>
                            ) : step === 3 ? (
                                "Finalizar Cadastro"
                            ) : (
                                "Continuar"
                            )}
                        </Button>

                        {step > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => setStep((step - 1) as Step)}
                            >
                                Voltar
                            </Button>
                        )}
                    </div>
                </form>

                <div className="text-center text-sm">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="underline underline-offset-4 hover:text-primary font-medium">
                        Entrar
                    </Link>
                </div>
            </div>
        </div>
    );
}
