"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/context";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useApp();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        login(email);
        setIsLoading(false);
        router.push("/");
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6 text-primary-foreground"
                        >
                            <path d="M12 2v20M2 12h20" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h1>
                    <p className="text-sm text-muted-foreground">
                        Entre para encontrar missões ou contratar ajuda.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                        <Input
                            id="email"
                            placeholder="seu@email.com"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium leading-none">Senha</label>
                        <Input id="password" type="password" placeholder="••••••••" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    <p>Não tem conta? <span className="underline cursor-pointer hover:text-foreground">Cadastre-se</span></p>
                </div>
            </div>
        </div>
    );
}
