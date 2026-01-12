"use client";

import Link from "next/link";
import { Bell, Menu, User, LogIn, LogOut, ArrowLeft } from "lucide-react";
import { useApp } from "@/lib/context";
import { usePathname } from "next/navigation";

export function Header({ title, hideProfile }: { title?: string; hideProfile?: boolean }) {
    const { user, logout, notifications } = useApp();
    const pathname = usePathname();
    const isHome = pathname === "/";
    const hasUnread = notifications.some(n => !n.read);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    {!isHome ? (
                        <Link href="/" className="mr-2 p-1 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    ) : null}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold inline-block">{title || "Mercado de Missões"}</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/notifications" className="p-2 text-muted-foreground hover:text-foreground relative">
                        <Bell className="h-5 w-5" />
                        {hasUnread && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
                    </Link>

                    {!hideProfile && (user ? (
                        <div className="flex items-center gap-2">
                            <Link href="/profile">
                                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border border-border hover:bg-secondary/80 transition-colors">
                                    <span className="text-xs font-medium">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors">
                                <LogIn className="h-4 w-4" />
                                <span>Entrar</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}
