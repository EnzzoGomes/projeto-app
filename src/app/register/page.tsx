"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, CheckCircle2, ShieldCheck, Loader2, Upload, FileText, User, Mail, Phone, CreditCard, AlertCircle } from "lucide-react";
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
    const { registerUser } = useApp();
    const router = useRouter();

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
                name: "Novo Usuário", // In real app would come from input state
                email: "usuario@email.com", // Should come from state
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
                                <Input placeholder="João da Silva Santos" required />
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
                                <Input type="email" placeholder="joao@exemplo.com" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    Telefone
                                </label>
                                <Input type="tel" placeholder="(11) 99999-9999" required />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Document Upload */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center bg-muted/30">
                                {documentUploaded ? (
                                    <div className="space-y-3">
                                        <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Documento Recebido</h3>
                                            <p className="text-sm text-muted-foreground">Seu documento foi enviado com sucesso</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                            <FileText className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Documento de Identidade</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Envie uma foto clara do seu RG ou CNH
                                            </p>
                                        </div>
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleDocumentUpload}
                                            />
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                                                <Upload className="h-4 w-4" />
                                                Escolher Arquivo
                                            </div>
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-500/10 p-3 rounded-md">
                                <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-blue-500">
                                    Seus documentos são criptografados e armazenados com segurança. Usamos apenas para verificação de identidade.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Face ID */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 flex flex-col items-center justify-center text-center gap-4 bg-muted/30">
                                {faceVerified ? (
                                    <>
                                        <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Identidade Confirmada!</h3>
                                            <p className="text-sm text-muted-foreground">Seu rosto foi verificado com sucesso</p>
                                        </div>
                                    </>
                                ) : isVerifying ? (
                                    <>
                                        <div className="relative">
                                            <div className="h-20 w-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                                                <Camera className="h-10 w-10 text-primary animate-pulse" />
                                            </div>
                                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Analisando...</h3>
                                            <p className="text-sm text-muted-foreground">Verificando biometria facial</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Camera className="h-10 w-10 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Reconhecimento Facial</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Posicione seu rosto no centro da câmera
                                            </p>
                                        </div>
                                        <Button type="button" onClick={handleFaceVerify} className="w-full">
                                            <Camera className="mr-2 h-4 w-4" />
                                            Iniciar Verificação
                                        </Button>
                                    </>
                                )}
                            </div>

                            {!faceVerified && (
                                <div className="space-y-2 text-xs text-muted-foreground">
                                    <p className="font-medium">Dicas para melhor verificação:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Certifique-se de estar em local bem iluminado</li>
                                        <li>Remova óculos escuros ou acessórios</li>
                                        <li>Olhe diretamente para a câmera</li>
                                    </ul>
                                </div>
                            )}
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
