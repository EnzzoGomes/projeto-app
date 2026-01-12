import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="h-24 w-24 rounded-full bg-muted/30 flex items-center justify-center mb-6 ring-1 ring-border/50">
                <Icon className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                {description}
            </p>
            {action}
        </div>
    );
}
