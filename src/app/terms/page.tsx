import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col pb-20">
            <Header />
            <main className="flex-1 container max-w-screen-md mx-auto p-4">
                <div className="mb-6 flex items-center gap-2">
                    <Link href="/profile" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-2xl font-bold">Termos de Uso</h1>
                </div>

                <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
                    <p>
                        Última atualização: Janeiro de 2026.
                    </p>

                    <section>
                        <h2 className="text-foreground text-xl font-semibold mb-2">1. Aceitação</h2>
                        <p>
                            Ao utilizar o Mercado de Missões, você concorda com estes termos. Se não concordar, por favor, não utilize a plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-foreground text-xl font-semibold mb-2">2. Responsabilidades</h2>
                        <p>
                            <strong>Solicitantes:</strong> São responsáveis pela precisão da descrição da missão e pelo pagamento integral da recompensa acordada.
                        </p>
                        <p className="mt-2">
                            <strong>Prestadores:</strong> São responsáveis pela execução segura e profissional da missão aceita. O Mercado de Missões atua apenas como intermediário.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-foreground text-xl font-semibold mb-2">3. Taxas e Pagamentos</h2>
                        <p>
                            A plataforma cobra uma taxa de serviço (atualmente 15%) sobre o valor de cada missão criada. Esta taxa não é reembolsável após a conclusão ou aceitação do serviço.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-foreground text-xl font-semibold mb-2">4. Segurança</h2>
                        <p>
                            Recomendamos cautela e bom senso. Missões que violem a lei ou coloquem em risco a integridade física de qualquer parte serão removidas e os usuários banidos.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
