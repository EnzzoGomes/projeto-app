"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import { useApp } from "@/lib/context";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
    id: string;
    text: string;
    sender: "me" | "other";
    time: string;
}

export default function ChatPage() {
    const params = useParams();
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "Olá! Vi que você aceitou a missão.", sender: "other", time: "10:00" },
        { id: "2", text: "Sim! Estou disponível para começar agora.", sender: "me", time: "10:05" },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const { missions } = useApp();
    // Ensure we compare safely (params.id can be string or string[])
    const missionId = Array.isArray(params.id) ? params.id[0] : params.id;
    const mission = missions.find(m => m.id === missionId);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, msg]);
        setNewMessage("");

        // Simulate reply
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                text: "Perfeito! Aguardo você no local.",
                sender: "other",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    if (!mission) return <div className="p-4">Carregando conversa...</div>;

    return (
        <div className="flex min-h-screen flex-col bg-background pb-16">
            {/* Header do Chat */}
            <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
                <Link href={`/mission/${mission.id}`} className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div className="flex-1 overflow-hidden">
                    <h1 className="truncate text-sm font-semibold">{mission.title}</h1>
                    <p className="text-xs text-muted-foreground">Chat com Solicitante</p>
                </div>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 space-y-4 p-4 overflow-y-auto">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${msg.sender === "me"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground" // Corrigido para garantir contraste no Dark Mode
                                }`}
                        >
                            <p>{msg.text}</p>
                            <p className={`mt-1 text-[10px] ${msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input de Mensagem */}
            <div className="fixed bottom-16 left-0 right-0 border-t border-border bg-background p-4 md:absolute md:bottom-0">
                {/* Ajustado bottom para não sobrepor BottomNav no mobile (bottom-16) mas em desktop sem bottomNav seria bottom-0 
             Como BottomNav está sempre lá, manter bottom-16 é seguro para mobile, 
             mas em desktop o layout é diferente. Vamos fixar bottom-16 para garantir.
         */}
                <form onSubmit={handleSendMessage} className="container mx-auto max-w-screen-sm flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
