"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { useApp } from "@/lib/context";
import { Star, Calendar, MessageCircle, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";

export default function HistoryPage() {
    const { workHistory } = useApp();
    const [activeTab, setActiveTab] = useState<'client' | 'provider'>('provider');
    const router = useRouter();

    const filteredHistory = workHistory.filter(h => h.role === activeTab);

    return (
        <div className="flex min-h-screen flex-col pb-20">
            <Header title="Histórico de Trabalho" />

            <div className="container mx-auto p-4 space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-muted rounded-lg">
                    <button
                        onClick={() => setActiveTab('provider')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'provider'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Briefcase className="h-4 w-4 inline mr-2" />
                        Trabalhei Para
                    </button>
                    <button
                        onClick={() => setActiveTab('client')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'client'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <User className="h-4 w-4 inline mr-2" />
                        Trabalharam Pra Mim
                    </button>
                </div>

                {/* History List */}
                {filteredHistory.length === 0 ? (
                    <EmptyState
                        icon={activeTab === 'provider' ? Briefcase : User}
                        title={activeTab === 'provider' ? "Nenhum trabalho realizado" : "Nenhum trabalho recebido"}
                        description={activeTab === 'provider'
                            ? "Aceite missões para começar seu histórico"
                            : "Crie missões para que outros trabalhem para você"
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {filteredHistory.map(history => (
                            <div key={history.id} className="glass-card p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{history.missionTitle}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {activeTab === 'provider' ? 'Cliente' : 'Prestador'}: {history.partnerName}
                                        </p>
                                    </div>
                                    {history.rating && (
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-sm font-medium">{history.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(history.completedAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.push(`/messages/${history.partnerId}`)}
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Enviar Mensagem
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
