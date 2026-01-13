"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { useApp, Friend } from "@/lib/context";
import { UserPlus, UserMinus, Star, TrendingUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";

// Mock users for demonstration
const MOCK_USERS: Friend[] = [
    { id: "user1", name: "Maria Silva", email: "maria@email.com", rating: 4.8, level: 5, avatar: "👩" },
    { id: "user2", name: "João Santos", email: "joao@email.com", rating: 4.9, level: 8, avatar: "👨" },
    { id: "user3", name: "Ana Costa", email: "ana@email.com", rating: 4.7, level: 3, avatar: "👩‍💼" },
    { id: "user4", name: "Pedro Lima", email: "pedro@email.com", rating: 5.0, level: 12, avatar: "🧑" },
];

export default function FriendsPage() {
    const { friends, addFriend, removeFriend } = useApp();
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const searchResults = MOCK_USERS.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ).filter(user => !friends.find(f => f.id === user.id));

    const handleAddFriend = (user: Friend) => {
        addFriend(user);
        setSearchQuery("");
    };

    return (
        <div className="flex min-h-screen flex-col pb-20">
            <Header title="Amigos" />

            <div className="container mx-auto p-4 space-y-6">
                {/* Search Section */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Adicionar Amigos</h2>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Buscar por nome ou email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                    </div>

                    {/* Search Results */}
                    {searchQuery && (
                        <div className="space-y-2">
                            {searchResults.length > 0 ? (
                                searchResults.map(user => (
                                    <div key={user.id} className="glass-card p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{user.avatar}</div>
                                            <div>
                                                <h3 className="font-semibold">{user.name}</h3>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                        {user.rating.toFixed(1)}
                                                    </span>
                                                    <span className="text-xs flex items-center gap-1">
                                                        <TrendingUp className="h-3 w-3" />
                                                        Nível {user.level}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddFriend(user)}
                                        >
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Adicionar
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhum usuário encontrado
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Friends List */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Meus Amigos ({friends.length})</h2>

                    {friends.length === 0 ? (
                        <EmptyState
                            icon={UserPlus}
                            title="Nenhum amigo ainda"
                            description="Busque usuários acima para adicionar amigos"
                        />
                    ) : (
                        <div className="space-y-2">
                            {friends.map(friend => (
                                <div key={friend.id} className="glass-card p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">{friend.avatar}</div>
                                        <div>
                                            <h3 className="font-semibold">{friend.name}</h3>
                                            <p className="text-sm text-muted-foreground">{friend.email}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                    {friend.rating.toFixed(1)}
                                                </span>
                                                <span className="text-xs flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3" />
                                                    Nível {friend.level}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => router.push(`/messages/${friend.id}`)}
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeFriend(friend.id)}
                                        >
                                            <UserMinus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
