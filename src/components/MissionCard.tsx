"use client";

import { MapPin, DollarSign, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MissionProps {
    id: string;
    title: string;
    description: string;
    reward: number;
    location: string;
    distance: string;
    duration: string;
}

export function MissionCard({ mission }: { mission: MissionProps }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-accent/50"
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h3 className="font-semibold leading-none tracking-tight text-foreground">
                        {mission.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {mission.description}
                    </p>
                </div>
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 px-3 py-1 text-emerald-500">
                    <DollarSign className="mr-1 h-3.5 w-3.5" />
                    <span className="font-bold">{mission.reward.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{mission.location} • {mission.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{mission.duration}</span>
                </div>
            </div>

            <div className="mt-4">
                <Link
                    href={`/mission/${mission.id}`}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    Ver Missão
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </motion.div>
    );
}
