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

interface AppContextType {
    missions: Mission[];
    userBalance: number;
    notifications: Notification[];
    acceptedMissions: Mission[];
    user: { name: string; email: string; level: number; xp: number; rating: number; verified?: boolean } | null;
    login: (email: string) => void;
    logout: () => void;
    addMission: (mission: Omit<Mission, "id" | "status" | "distance">) => void;
    acceptMission: (id: string) => void;
    completeMission: (id: string) => void;
    registerUser: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [userBalance, setUserBalance] = useState(0); // Start with 0
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [user, setUser] = useState<{ name: string; email: string; level: number; xp: number; rating: number; verified?: boolean } | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data
    useEffect(() => {
        try {
            const savedMissions = localStorage.getItem("mission-market:missions");
            const savedBalance = localStorage.getItem("mission-market:balance");
            const savedUser = localStorage.getItem("mission-market:user");
            const savedNotifs = localStorage.getItem("mission-market:notifications");

            if (savedMissions) setMissions(JSON.parse(savedMissions));
            if (savedBalance) setUserBalance(parseFloat(savedBalance));
            if (savedUser) setUser(JSON.parse(savedUser));
            if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
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
            if (user) {
                localStorage.setItem("mission-market:user", JSON.stringify(user));
            } else {
                localStorage.removeItem("mission-market:user");
            }
        } catch (error) {
            console.error("Storage Save Error:", error);
        }
    }, [missions, userBalance, user, notifications, isLoaded]);

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
                        addNotification("Missão Concluída", `Você ganhou ${xpGained} XP e completou a missão!`, "success");
                    }
                    return { ...m, status: "completed" };
                }
                return m;
            })
        );
    };

    if (!isLoaded) return null;

    return (
        <AppContext.Provider
            value={{
                missions,
                userBalance,
                notifications, // Agora exposto
                acceptedMissions: missions.filter(m => (m.status === "accepted" || m.status === "completed")),
                user,
                login,
                logout,
                addMission,
                acceptMission,
                completeMission,
                registerUser
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
