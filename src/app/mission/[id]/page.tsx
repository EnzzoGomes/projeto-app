"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, DollarSign, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { useState, useEffect } from "react";

export default function MissionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { missions, acceptMission } = useApp();
    const [mission, setMission] = useState<any>(null);
    const [isAccepting, setIsAccepting] = useState(false);

    useEffect(() => {
        if (params.id) {
            const found = missions.find((m) => m.id === params.id);
            setMission(found);
        }
    }, [params.id, missions]);

    if (!mission) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-muted-foreground">Carregando detalhes...</p>
            </div>
        );
    }

    const handleAccept = async () => {
        setIsAccepting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        acceptMission(mission.id);
        setIsAccepting(false);
        router.push("/profile");
    };

    return (
        <div className="flex min-h-screen flex-col pb-20">
            <div className="container max-w-screen-sm mx-auto p-4">
                <div className="mb-6 flex items-center gap-2">
                    <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-xl font-bold">Detalhes da Missão</h1>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold leading-tight">{mission.title}</h2>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{mission.location}</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">Recompensa (Via {mission.paymentMethod === 'pix' ? 'PIX' : mission.paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'})</span>
                            <div className="flex items-center text-emerald-500">
                                <DollarSign className="h-5 w-5 mr-1" />
                                <span className="text-2xl font-bold">{mission.reward.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Tempo Estimado</span>
                            <div className="flex items-center text-foreground">
                                <Clock className="h-5 w-5 mr-1" />
                                <span className="font-medium">{mission.duration}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Sobre a Missão</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {mission.description}
                        </p>
                    </div>

                    <div className="fixed bottom-20 left-0 w-full px-4 md:static md:p-0 flex flex-col gap-3">
                        {mission.status !== "available" && (
                            <Button
                                variant="secondary"
                                size="lg"
                                className="w-full max-w-screen-sm mx-auto shadow-sm"
                                onClick={() => router.push(`/mission/${mission.id}/chat`)}
                            >
                                Contactar Solicitante
                            </Button>
                        )}

                        <Button
                            size="lg"
                            className="w-full max-w-screen-sm mx-auto shadow-lg"
                            onClick={handleAccept}
                            disabled={isAccepting || mission.status !== "available"}
                        >
                            {isAccepting ? "Aceitando..." : mission.status === "available" ? "Aceitar Missão" : "Missão Aceita"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
