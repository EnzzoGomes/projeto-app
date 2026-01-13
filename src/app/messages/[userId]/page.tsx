"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { useApp } from "@/lib/context";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";

export default function ChatPage() {
    const params = useParams();
    const userId = params.userId as string;
    const { friends, getConversation, sendMessage, markMessagesAsRead, user } = useApp();
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const friend = friends.find(f => f.id === userId);
    const conversation = getConversation(userId);

    useEffect(() => {
        if (user) {
            markMessagesAsRead(userId);
        }
    }, [userId, user, markMessagesAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    if (!user) {
        router.push("/register");
        return null;
    }

    if (!friend) {
        return (
            <div className="flex min-h-screen flex-col pb-20">
                <Header title="Conversa" />
                <div className="container mx-auto p-4">
                    <p className="text-center text-muted-foreground">Usuário não encontrado</p>
                </div>
            </div>
        );
    }

    const handleSend = () => {
        if (!messageText.trim()) return;
        sendMessage(userId, messageText);
        setMessageText("");
    };

    return (
        <div className="flex min-h-screen flex-col pb-20">
            <Header title={friend.name} />

            <div className="flex-1 container mx-auto p-4 flex flex-col">
                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                    {conversation.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            Nenhuma mensagem ainda. Comece a conversa!
                        </div>
                    ) : (
                        conversation.map(msg => {
                            const isMine = msg.senderId === user.email;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${isMine
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <p className={`text-xs mt-1 ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                            }`}>
                                            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2 sticky bottom-0 bg-background pt-2">
                    <Input
                        placeholder="Digite uma mensagem..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1"
                    />
                    <Button onClick={handleSend} disabled={!messageText.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
