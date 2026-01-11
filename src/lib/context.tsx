"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_MISSIONS } from "@/lib/data";

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

interface AppContextType {
    missions: Mission[];
    userBalance: number;
    acceptedMissions: Mission[];
    user: { name: string; email: string; level: number; xp: number; rating: number; verified?: boolean } | null;
    login: (email: string) => void;
    logout: () => void;
    addMission: (mission: Omit<Mission, "id" | "status" | "distance">) => void;
    acceptMission: (id: string) => void;
    completeMission: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [userBalance, setUserBalance] = useState(450.0);
    const [user, setUser] = useState<{ name: string; email: string; level: number; xp: number; rating: number; verified?: boolean } | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Carregar dados iniciais do LocalStorage
    useEffect(() => {
        try {
            const savedMissions = localStorage.getItem("mission-market:missions");
            const savedBalance = localStorage.getItem("mission-market:balance");
            const savedUser = localStorage.getItem("mission-market:user");

            if (savedMissions) {
                setMissions(JSON.parse(savedMissions));
            } else {
                const initialMissions = MOCK_MISSIONS.map(m => ({
                    ...m,
                    status: "available" as const,
                    paymentMethod: (m.paymentMethod || "pix") as "pix" | "cash" | "card"
                }));
                setMissions(initialMissions);
            }

            if (savedBalance) {
                setUserBalance(parseFloat(savedBalance));
            }

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Erro ao carregar do localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Salvar dados
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem("mission-market:missions", JSON.stringify(missions));
                localStorage.setItem("mission-market:balance", userBalance.toString());
                if (user) {
                    localStorage.setItem("mission-market:user", JSON.stringify(user));
                } else {
                    localStorage.removeItem("mission-market:user");
                }
            } catch (error) {
                console.error("Erro ao salvar no localStorage", error);
            }
        }
    }, [missions, userBalance, user, isLoaded]);

    const login = (email: string) => {
        setUser({
            name: "Usuário Demo",
            email,
            level: 1,
            xp: 0,
            rating: 4.8,
            verified: true
        });
    };

    const logout = () => {
        setUser(null);
    };

    const acceptedMissions = missions.filter((m) => m.status === "accepted" || m.status === "completed");

    const addMission = (newMission: Omit<Mission, "id" | "status" | "distance">) => {
        // No upfront cost for creator in this model, they pay directly to provider
        const mission: Mission = {
            ...newMission,
            id: Math.random().toString(36).substr(2, 9),
            status: "available",
            distance: "0.5km", // Mock distance
            minLevel: 1, // Default min level for user created missions
            paymentMethod: newMission.paymentMethod || "pix"
        };
        setMissions((prev) => [mission, ...prev]);
    };

    const acceptMission = (id: string) => {
        const mission = missions.find(m => m.id === id);
        if (!mission) return;

        if (mission.minLevel && (user?.level || 0) < mission.minLevel) {
            alert(`Nível ${mission.minLevel} necessário para aceitar esta missão.`);
            return;
        }

        setMissions((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status: "accepted" } : m))
        );
    };

    const completeMission = (id: string) => {
        setMissions((prev) =>
            prev.map((m) => {
                if (m.id === id && m.status !== "completed") {
                    // Logic: Provider receives full amount directly from client (Cash/Pix)
                    // Platform charges 15% fee, deducted from Provider's balance (can go negative/debt)
                    const fee = m.reward * 0.15;
                    setUserBalance((b) => b - fee);

                    // Add XP and check for level up
                    if (user) {
                        const xpGained = Math.floor(m.reward); // 1 XP per Reais (approx)
                        const newXp = user.xp + xpGained;
                        const newLevel = Math.floor(newXp / 100) + 1;

                        setUser({
                            ...user,
                            xp: newXp,
                            level: newLevel
                        });
                    }

                    return { ...m, status: "completed" };
                }
                return m;
            })
        );
    };

    // Evitar renderizar children antes de carregar dados para não piscar conteúdo incorreto
    if (!isLoaded) {
        return null; // Ou um loading spin
    }

    return (
        <AppContext.Provider
            value={{
                missions,
                userBalance,
                acceptedMissions,
                user,
                login,
                logout,
                addMission,
                acceptMission,
                completeMission,
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
