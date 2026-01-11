import { Trophy } from "lucide-react";

interface LevelBadgeProps {
    level: number;
}

export function LevelBadge({ level }: LevelBadgeProps) {
    let color = "bg-slate-500";
    let title = "Iniciante";

    if (level >= 5) {
        color = "bg-amber-500";
        title = "Ouro";
    } else if (level >= 3) {
        color = "bg-slate-300 text-slate-900";
        title = "Prata";
    } else if (level >= 2) {
        color = "bg-orange-700";
        title = "Bronze";
    }

    return (
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${color}`}>
            <Trophy className="h-3 w-3" />
            <span>{title}</span>
        </div>
    );
}
