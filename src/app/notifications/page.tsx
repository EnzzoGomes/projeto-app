"use client";

import { Header } from "@/components/Header";
import { Bell, CheckCircle, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
    // Mock notifications - in real app would come from backend
    const notifications = [
        {
            id: "1",
            type: "mission_completed",
            title: "Missão Concluída!",
            message: "Você completou 'Entrega de Encomenda Local' e ganhou R$ 25,00",
            time: "Há 2 horas",
            read: false,
            icon: CheckCircle,
            color: "text-green-500"
        },
        {
            id: "2",
            type: "mission_accepted",
            title: "Nova Missão Aceita",
            message: "Alguém aceitou sua missão 'Passear com Golden Retriever'",
            time: "Há 5 horas",
            read: false,
            icon: Bell,
            color: "text-blue-500"
        },
        {
            id: "3",
            type: "payment",
            title: "Taxa Debitada",
            message: "Taxa de serviço de R$ 3,75 foi debitada do seu saldo",
            time: "Há 1 dia",
            read: true,
            icon: DollarSign,
            color: "text-amber-500"
        }
    ];

    return (
        <div className="flex min-h-screen flex-col pb-20">
            <div className="container max-w-screen-sm mx-auto p-4">
                <Header title="Notificações" />

                <div className="mt-6 space-y-4">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center border border-dashed border-muted-foreground/25 rounded-lg">
                            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="font-semibold text-lg mb-1">Nenhuma notificação</h3>
                            <p className="text-sm text-muted-foreground">
                                Você está em dia! Não há notificações novas.
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const Icon = notification.icon;
                            return (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg border transition-colors ${notification.read
                                            ? "bg-card border-border"
                                            : "bg-primary/5 border-primary/20"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full bg-background ${notification.color}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-semibold text-sm">
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {notification.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
