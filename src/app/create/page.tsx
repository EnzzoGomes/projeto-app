"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, DollarSign, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/lib/context";
import { useRouter } from "next/navigation";

export default function CreateMissionPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { addMission } = useApp();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const val = parseFloat(formData.get("reward") as string);
        const floatReward = isNaN(val) ? 0 : val;

        addMission({
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            reward: floatReward,
            location: formData.get("location") as string,
            duration: "Flexível", // Simplificação
            paymentMethod: formData.get("paymentMethod") as "pix" | "cash" | "card",
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        router.push("/");
    }

    return (
        <div className="flex min-h-screen flex-col pb-20">
            <div className="container max-w-screen-sm mx-auto p-4">
                <div className="mb-6 flex items-center gap-2">
                    <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-xl font-bold">Nova Missão</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Título da Missão
                        </label>
                        <Input name="title" placeholder="Ex: Passear com cachorro" required />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Seja claro e objetivo sobre o que precisa ser feito.
                        </p>
                    </div>


                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Valor da Recompensa (R$)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="reward"
                                type="number"
                                placeholder="0,00"
                                className="pl-9"
                                required
                                min="1"
                                step="0.50"
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const fee = val * 0.15; // 15% rate
                                    document.getElementById('fee-display')!.innerText = `Taxa de serviço (15%): R$ ${fee.toFixed(2)}`;
                                    document.getElementById('total-display')!.innerHTML = `Total a pagar: <b>R$ ${(val + fee).toFixed(2)}</b>`;
                                }}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground flex justify-between px-1">
                            <span id="fee-display">Taxa de serviço (15%): R$ 0.00</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Forma de Pagamento (Você paga ao Prestador)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <label className="cursor-pointer border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-muted has-[:checked]:bg-muted has-[:checked]:border-primary transition-all">
                                <input type="radio" name="paymentMethod" value="pix" className="sr-only" defaultChecked />
                                <CreditCard className="h-5 w-5" />
                                <span className="text-xs font-medium">PIX</span>
                            </label>
                            <label className="cursor-pointer border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-muted has-[:checked]:bg-muted has-[:checked]:border-primary transition-all">
                                <input type="radio" name="paymentMethod" value="cash" className="sr-only" />
                                <DollarSign className="h-5 w-5" />
                                <span className="text-xs font-medium">Dinheiro</span>
                            </label>
                            <label className="cursor-pointer border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-muted has-[:checked]:bg-muted has-[:checked]:border-primary transition-all">
                                <input type="radio" name="paymentMethod" value="card" className="sr-only" />
                                <CreditCard className="h-5 w-5" />
                                <span className="text-xs font-medium">Cartão</span>
                            </label>
                        </div>
                        <p className="text-[0.8rem] text-muted-foreground">
                            O pagamento é feito diretamente ao prestador ao final da missão.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Localização
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input name="location" placeholder="Bairro ou endereço aproximado" className="pl-9" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Descrição Detalhada
                        </label>
                        <textarea
                            name="description"
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Descreva os detalhes da tarefa, ferramentas necessárias, horário, etc."
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading ? "Publicando..." : "Publicar Missão"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
