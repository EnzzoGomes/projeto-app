"use client";

import { Header } from "@/components/Header";
import { useApp } from "@/lib/context";
import { MessageCircle, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";

export default function MessagesPage() {
    const { messages, friends, user } = useApp();
    const router = useRouter();

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col pb-20">
                <Header title="Mensagens" />
                <div className="container mx-auto p-4">
                    <EmptyState
                        icon={MessageCircle}
                        title="Faça login"
                        description="Entre na sua conta para ver suas mensagens"
                    />
                </div>
            </div>
        );
    }

    // Group messages by conversation
    const conversations = friends.map(friend => {
        const conversationMessages = messages.filter(msg =>
            (msg.senderId === user.email && msg.receiverId === friend.id) ||
            (msg.senderId === friend.id && msg.receiverId === user.email)
        );

        const lastMessage = conversationMessages[conversationMessages.length - 1];
        const unreadCount = conversationMessages.filter(
            msg => msg.senderId === friend.id && msg.receiverId === user.email && !msg.read
        ).length;

        return {
            friend,
            lastMessage,
            unreadCount,
            hasMessages: conversationMessages.length > 0
        };
    }).filter(conv => conv.hasMessages);

    return (
        <div className="flex min-h-screen flex-col pb-20">
            <Header title="Mensagens" />

            <div className="container mx-auto p-4">
                {conversations.length === 0 ? (
                    <EmptyState
                        icon={MessageCircle}
                        title="Nenhuma conversa"
                        description="Adicione amigos e comece a conversar"
                    />
                ) : (
                    <div className="space-y-2">
                        {conversations.map(({ friend, lastMessage, unreadCount }) => (
                            <div
                                key={friend.id}
                                onClick={() => router.push(`/messages/${friend.id}`)}
                                className="glass-card p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="text-3xl">{friend.avatar || "👤"}</div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold">{friend.name}</h3>
                                        {lastMessage && (
                                            <p className="text-sm text-muted-foreground truncate">
                                                {lastMessage.senderId === user.email ? "Você: " : ""}
                                                {lastMessage.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <div className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {unreadCount}
                                        </div>
                                    )}
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
