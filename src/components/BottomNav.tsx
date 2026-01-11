"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const links = [
        {
            href: "/",
            label: "Início",
            icon: Home,
        },
        {
            href: "/create",
            label: "Publicar",
            icon: PlusSquare,
        },
        {
            href: "/profile",
            label: "Perfil",
            icon: User,
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="grid h-16 grid-cols-3 items-center justify-center">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors hover:bg-accent/50 h-full",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
