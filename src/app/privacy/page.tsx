import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col pb-20">
            <Header />
            <main className="flex-1 container max-w-screen-md mx-auto p-4">
                <div className="mb-6 flex items-center gap-2">
                    <Link href="/profile" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-2xl font-bold">Política de Privacidade</h1>
                </div>

                <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
                    <p>
                        Última atualização: Janeiro de 2026.
                    </p>

                    <section>
                        <h2 className="text-foreground text-xl font-semibold mb-2">1. Coleta de Dados</h2>
                        <p>
                            Coletamos apenas os dados essenciais para o funcionamento do Mercado de Missões, incluindo:
                            nome, e-mail e dados de localização para facilitar o encontro de missões próximas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-foreground text-xl font-semibold mb-2">2. Uso das Informações</h2>
                        <p>
                            Seus dados são utilizados exclusivamente para:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Conectar solicitantes e prestadores de serviço.</li>
                            <li>Processar pagamentos e transferências de recompensas.</li>
                            <li>Melhorar a segurança e a experiência do usuário na plataforma.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-foreground text-xl font-semibold mb-2">3. Compartilhamento</h2>
                        <p>
                            Não vendemos seus dados para terceiros. Compartilhamos informações apenas com parceiros estritamente necessários para a operação (como processadores de pagamento) ou quando exigido por lei.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-foreground text-xl font-semibold mb-2">4. Seus Direitos (LGPD)</h2>
                        <p>
                            Você tem o direito de solicitar a exclusão de seus dados, correção de informações imprecisas ou portabilidade a qualquer momento através do suporte.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
