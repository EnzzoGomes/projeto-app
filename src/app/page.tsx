"use client";

import { Header } from "@/components/Header";
import { MissionCard } from "@/components/MissionCard";
import { useApp } from "@/lib/context";

export default function Home() {
  const { missions } = useApp();
  const availableMissions = missions.filter(m => m.status === "available");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container max-w-screen-sm mx-auto p-4 py-8">
        <div className="flex flex-col gap-6">
          <section className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Missões Disponíveis</h1>
            <p className="text-muted-foreground">
              Encontre tarefas perto de você e ganhe dinheiro extra.
            </p>
          </section>

          <div className="grid gap-4">
            {availableMissions.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-muted-foreground/25 rounded-lg text-muted-foreground">
                Nenhuma missão disponível no momento.
              </div>
            ) : (
              availableMissions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
