"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Mission {
    id: string;
    title: string;
    description: string;
    reward: number;
    location: string;
    distance: string;
    duration: string;
    minLevel?: number;
    paymentMethod?: "pix" | "cash" | "card";
    status: "available" | "accepted" | "completed";
}

export interface Notification {
    id: string;
    type: "info" | "success" | "warning";
    title: string;
    message: string;
    date: string;
    read: boolean;
}

export interface Friend {
    id: string;
    name: string;
    email: string;
    rating: number;
    level: number;
    avatar?: string;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    read: boolean;
}

export interface WorkHistory {
    id: string;
    missionId: string;
    missionTitle: string;
    partnerId: string;
    partnerName: string;
    role: 'client' | 'provider';
    completedAt: string;
    rating?: number;
}

interface AppContextType {
    missions: Mission[];
    userBalance: number;
    notifications: Notification[];
    acceptedMissions: Mission[];
    friends: Friend[];
    messages: Message[];
    workHistory: WorkHistory[];
    user: { name: string; email: string; level: number; xp: number; rating: number; verified?: boolean } | null;
    login: (email: string) => void;
    logout: () => void;
    addMission: (mission: Omit<Mission, "id" | "status" | "distance">) => void;
    acceptMission: (id: string) => void;
    completeMission: (id: string) => void;
    registerUser: (data: any) => void;
    addFriend: (friend: Friend) => void;
    removeFriend: (friendId: string) => void;
    sendMessage: (receiverId: string, content: string) => void;
    markMessagesAsRead: (userId: string) => void;
    getConversation: (userId: string) => Message[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [userBalance, setUserBalance] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [workHistory, setWorkHistory] = useState<WorkHistory[]>([]);
    const [user, setUser] = useState<{ name: string; email: string; level: number; xp: number; rating: number; verified?: boolean } | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data
    useEffect(() => {
        try {
            const savedMissions = localStorage.getItem("mission-market:missions");
            const savedBalance = localStorage.getItem("mission-market:balance");
            const savedUser = localStorage.getItem("mission-market:user");
            const savedNotifs = localStorage.getItem("mission-market:notifications");
            const savedFriends = localStorage.getItem("mission-market:friends");
            const savedMessages = localStorage.getItem("mission-market:messages");
            const savedHistory = localStorage.getItem("mission-market:workHistory");

            if (savedMissions) setMissions(JSON.parse(savedMissions));
            if (savedBalance) setUserBalance(parseFloat(savedBalance));
            if (savedUser) setUser(JSON.parse(savedUser));
            if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
            if (savedFriends) setFriends(JSON.parse(savedFriends));
            if (savedMessages) setMessages(JSON.parse(savedMessages));
            if (savedHistory) setWorkHistory(JSON.parse(savedHistory));
        } catch (error) {
            console.error("Storage Error:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save data
    useEffect(() => {
        if (!isLoaded) return;
        try {
            localStorage.setItem("mission-market:missions", JSON.stringify(missions));
            localStorage.setItem("mission-market:balance", userBalance.toString());
            localStorage.setItem("mission-market:notifications", JSON.stringify(notifications));
            localStorage.setItem("mission-market:friends", JSON.stringify(friends));
            localStorage.setItem("mission-market:messages", JSON.stringify(messages));
            localStorage.setItem("mission-market:workHistory", JSON.stringify(workHistory));
            if (user) {
                localStorage.setItem("mission-market:user", JSON.stringify(user));
            } else {
                localStorage.removeItem("mission-market:user");
            }
        } catch (error) {
            console.error("Storage Save Error:", error);
        }
    }, [missions, userBalance, user, notifications, friends, messages, workHistory, isLoaded]);

    const addNotification = (title: string, message: string, type: "info" | "success" | "warning" = "info") => {
        const newNotif: Notification = {
            id: crypto.randomUUID(),
            type,
            title,
            message,
            date: new Date().toISOString(),
            read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const login = (email: string) => {
        // In a real app this would validate against DB
        // For persistence without backend, we check if there's a user saved or create a session
        const existingUser = localStorage.getItem("mission-market:user");
        if (existingUser) {
            const parsed = JSON.parse(existingUser);
            if (parsed.email === email) {
                setUser(parsed);
                return;
            }
        }

        // If simply logging in without prior register data (legacy/simple flow), create basic user
        setUser({
            name: email.split("@")[0],
            email,
            level: 1,
            xp: 0,
            rating: 5.0,
            verified: false
        });
    };

    const registerUser = (data: any) => {
        const newUser = {
            name: data.name,
            email: data.email,
            level: 1,
            xp: 0,
            rating: 5.0,
            verified: true // Assuming they passed the intense registration
        };
        setUser(newUser);
        addNotification("Bem-vindo!", "Sua conta foi criada com sucesso.", "success");
    };

    const logout = () => {
        setUser(null);
    };

    const addMission = (newMission: Omit<Mission, "id" | "status" | "distance">) => {
        const mission: Mission = {
            ...newMission,
            id: crypto.randomUUID(),
            status: "available",
            distance: "Calculando...", // Ideally would use Geo API
            minLevel: 1,
            paymentMethod: newMission.paymentMethod || "pix"
        };
        setMissions((prev) => [mission, ...prev]);
        addNotification("Missão Criada", `Sua missão "${mission.title}" está visível para prestadores.`, "success");
    };

    const acceptMission = (id: string) => {
        const mission = missions.find(m => m.id === id);
        if (!mission) return;

        if (mission.minLevel && (user?.level || 0) < mission.minLevel) {
            // Toast would be better, using alert for now as per plan to replace later
            addNotification("Erro", `Nível ${mission.minLevel} necessário.`, "warning");
            return;
        }

        setMissions((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status: "accepted" } : m))
        );
        addNotification("Missão Aceita", `Você aceitou a missão "${mission.title}".`, "success");
    };

    const completeMission = (id: string) => {
        const mission = missions.find(m => m.id === id);
        if (!mission) return;

        setMissions((prev) =>
            prev.map((m) => {
                if (m.id === id && m.status !== "completed") {
                    const fee = m.reward * 0.15;
                    setUserBalance((b) => b - fee);

                    if (user) {
                        const xpGained = Math.floor(m.reward);
                        const newXp = user.xp + xpGained;
                        const newLevel = Math.floor(newXp / 100) + 1;

                        setUser(prevUser => ({
                            ...prevUser!,
                            xp: newXp,
                            level: newLevel
                        }));

                        // Add to work history
                        const historyEntry: WorkHistory = {
                            id: crypto.randomUUID(),
                            missionId: m.id,
                            missionTitle: m.title,
                            partnerId: 'client-' + m.id.slice(0, 8),
                            partnerName: 'Cliente',
                            role: 'provider',
                            completedAt: new Date().toISOString(),
                            rating: 5
                        };
                        setWorkHistory(prev => [historyEntry, ...prev]);

                        addNotification("Missão Concluída", `Você ganhou ${xpGained} XP e completou a missão!`, "success");
                    }
                    return { ...m, status: "completed" };
                }
                return m;
            })
        );
    };

    const addFriend = (friend: Friend) => {
        if (friends.find(f => f.id === friend.id)) {
            addNotification("Aviso", "Este usuário já está na sua lista de amigos.", "warning");
            return;
        }
        setFriends(prev => [...prev, friend]);
        addNotification("Amigo Adicionado", `${friend.name} foi adicionado aos seus amigos.`, "success");
    };

    const removeFriend = (friendId: string) => {
        const friend = friends.find(f => f.id === friendId);
        setFriends(prev => prev.filter(f => f.id !== friendId));
        if (friend) {
            addNotification("Amigo Removido", `${friend.name} foi removido dos seus amigos.`, "info");
        }
    };

    const sendMessage = (receiverId: string, content: string) => {
        if (!user) return;

        const newMessage: Message = {
            id: crypto.randomUUID(),
            senderId: user.email,
            receiverId,
            content,
            timestamp: new Date().toISOString(),
            read: false
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const markMessagesAsRead = (userId: string) => {
        if (!user) return;
        setMessages(prev => prev.map(msg =>
            (msg.senderId === userId && msg.receiverId === user.email && !msg.read)
                ? { ...msg, read: true }
                : msg
        ));
    };

    const getConversation = (userId: string): Message[] => {
        if (!user) return [];
        return messages.filter(msg =>
            (msg.senderId === user.email && msg.receiverId === userId) ||
            (msg.senderId === userId && msg.receiverId === user.email)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    };

    if (!isLoaded) return null;

    return (
        <AppContext.Provider
            value={{
                missions,
                userBalance,
                notifications,
                acceptedMissions: missions.filter(m => (m.status === "accepted" || m.status === "completed")),
                friends,
                messages,
                workHistory,
                user,
                login,
                logout,
                addMission,
                acceptMission,
                completeMission,
                registerUser,
                addFriend,
                removeFriend,
                sendMessage,
                markMessagesAsRead,
                getConversation
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}
