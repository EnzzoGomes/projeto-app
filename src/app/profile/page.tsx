"use client";

import { Header } from "@/components/Header";
import { useApp } from "@/lib/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { user, userBalance, logout, acceptedMissions } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="flex min-h-screen flex-col pb-20">
            <div className="container max-w-screen-sm mx-auto p-4">
                <Header title="Perfil" hideProfile />

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            {user.verified && (
                                <div className="mt-1" title="Verificado">
                                    <svg
                                        className="h-5 w-5 text-blue-500"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M10.59 13.41L7.7 10.5l-1.41 1.41 4.29 4.29 1.41-1.42 7.07-7.07-1.41-1.41z" />
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0" />
                                        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.69L1 12l2.44 2.79-.34 3.69 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                                Nível {user.level} ( {user.xp % 100}/100 XP )
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="p-6 rounded-xl bg-card border shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-muted-foreground">Saldo da Carteira</span>
                            <span className={`text-2xl font-bold ${userBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                R$ {userBalance.toFixed(2)}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {userBalance < 0
                                ? "Você possui pendências com a plataforma referentes às taxas de serviço."
                                : "Saldo disponível para abater taxas futuras."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="font-semibold text-lg border-b border-border pb-2">Minhas Missões</h3>
                        <div className="space-y-4">
                            {acceptedMissions.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground border border-dashed border-border rounded-lg">
                                    Você ainda não aceitou nenhuma missão.
                                    <div className="mt-4">
                                        <Link href="/" className="text-primary hover:underline text-sm">
                                            Explorar Missões Disponíveis
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                acceptedMissions.map(mission => (
                                    <div key={mission.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${mission.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                {mission.status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium line-clamp-1">{mission.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {mission.status === 'completed' ? 'Concluída' : 'Em andamento'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`font-bold whitespace-nowrap ${mission.status === 'completed' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                            {mission.status === 'completed' ? '+ ' : ''}R$ {mission.reward.toFixed(2)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            variant="destructive"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={logout}
                        >
                            <LogOut className="h-4 w-4" />
                            Sair
                        </Button>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground space-x-4">
                    <Link href="/terms" className="hover:underline hover:text-foreground">Termos de Uso</Link>
                    <span>•</span>
                    <Link href="/privacy" className="hover:underline hover:text-foreground">Política de Privacidade</Link>
                </div>
            </div>
        </div>
    );
}
