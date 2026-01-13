"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/lib/context";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user } = useApp();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ["/login", "/register", "/terms", "/privacy"];
    const isPublicRoute = publicRoutes.includes(pathname);

    useEffect(() => {
        // Se não for rota pública e não houver usuário, redirecionar para login
        if (!isPublicRoute && !user) {
            router.push("/login");
        }
        setIsChecking(false);
    }, [user, pathname, isPublicRoute, router]);

    // Mostrar loading durante verificação inicial
    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
                </div>
            </div>
        );
    }

    // Se for rota pública ou usuário autenticado, mostrar conteúdo
    if (isPublicRoute || user) {
        return <>{children}</>;
    }

    // Caso contrário, não mostrar nada (redirecionamento em andamento)
    return null;
}
