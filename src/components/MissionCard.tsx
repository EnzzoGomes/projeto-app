"use client";

import { MapPin, Clock, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface MissionProps {
    id: string;
    title: string;
    description: string;
    reward: number;
    location: string;
    distance: string;
    duration: string;
    minLevel?: number;
    paymentMethod?: "pix" | "cash" | "card";
}

const paymentIcons = {
    pix: "₿",
    cash: "$",
    card: "💳"
};

export function MissionCard({ mission }: { mission: MissionProps }) {
    return (
        <Link href={`/mission/${mission.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden rounded-lg border border-border bg-card hover:bg-card/80 hover:border-primary/50 transition-all duration-200"
            >
                <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground truncate">
                                    {mission.title}
                                </h3>
                                {mission.minLevel && mission.minLevel > 1 && (
                                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                        <Star className="h-3 w-3" />
                                        Nv. {mission.minLevel}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {mission.description}
                            </p>
                        </div>

                        <div className="shrink-0 text-right">
                            <div className="text-2xl font-bold text-primary">
                                R$ {mission.reward.toFixed(2)}
                            </div>
                            {mission.paymentMethod && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    {paymentIcons[mission.paymentMethod]} {mission.paymentMethod.toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{mission.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{mission.duration}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                            Ver detalhes
                            <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                    </div>
                </div>

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
        </Link>
    );
}
