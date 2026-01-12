"use client";

import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, Scale, FileText, AlertCircle } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col pb-20">
            <Header title="Termos e Conformidade" />

            <div className="container max-w-screen-md mx-auto p-4 space-y-6">
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-start gap-4">
                    <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                        <h2 className="font-semibold text-lg text-primary">Conformidade Legal (Brasil)</h2>
                        <p className="text-sm text-foreground/80">
                            Este aplicativo opera em estrita conformidade com a <strong>LGPD</strong> (Lei 13.709/18) e atua exclusivamente como <strong>intermédio de serviços autônomos</strong>, não gerando vínculo empregatício (CLT).
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    <section className="space-y-3">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Scale className="h-5 w-5" />
                            1. Natureza Jurídica (Marketplace)
                        </h3>
                        <div className="text-muted-foreground text-sm space-y-2 leading-relaxed text-justify">
                            <p>
                                O <strong>Mission Market</strong> é uma plataforma de tecnologia que conecta Solicitantes a Prestadores Independentes.
                                Ao aceitar estes termos, o usuário reconhece que:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Inexistência de Vínculo Trabalhista:</strong> O Prestador é um profissional autônomo, livre para aceitar ou recusar missões, sem cumprimento de horário fixo ou subordinação.</li>
                                <li><strong>Preço e Pagamento:</strong> A plataforma atua como facilitadora de pagamentos (Split Payment), retendo apenas a taxa de serviço acordada. O prestador recebe diretamente pelos serviços realizados.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            2. Proteção de Dados (LGPD)
                        </h3>
                        <div className="text-muted-foreground text-sm space-y-2 leading-relaxed text-justify">
                            <p>
                                Seus dados pessoais são sagrados. Em conformidade com a Lei Geral de Proteção de Dados:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Dados Sensíveis:</strong> Não armazenamos imagens brutas de seus documentos. A verificação é realizada por parceiro credenciado (Stripe Identity) com criptografia bancária.</li>
                                <li><strong>Finalidade:</strong> Seus dados são usados exclusivamente para execução do contrato, segurança da plataforma e cumprimento de obrigações legais (KYC/AML).</li>
                                <li><strong>Direitos:</strong> Você pode solicitar a exclusão ou portabilidade de seus dados a qualquer momento através do suporte.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            3. Segurança e Verificação
                        </h3>
                        <div className="text-muted-foreground text-sm space-y-2 leading-relaxed text-justify">
                            <p>
                                Para garantir a segurança da comunidade, todos os usuários passam por verificações rigorosas:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Validação Documental:</strong> Todo documento é conferido contra bases governamentais para evitar fraudes.</li>
                                <li><strong>Prova de Vida:</strong> A biometria facial garante que o titular do documento é quem está operando a conta.</li>
                                <li><strong>Antecedentes:</strong> A plataforma se reserva o direito de realizar checagens de antecedentes criminais para missões sensíveis.</li>
                            </ul>
                        </div>
                    </section>
                </div>

                <div className="pt-8 text-center text-xs text-muted-foreground border-t border-border/50">
                    <p>Última atualização: Janeiro de 2026. CNPJ: 00.000.000/0001-00</p>
                    <p>Ao continuar usando o app, você concorda com estes termos.</p>
                </div>
            </div>
        </div>
    );
}
