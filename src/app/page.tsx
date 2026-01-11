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
              <div className="p-12 text-center border border-dashed border-muted-foreground/25 rounded-lg space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                  <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Nenhuma missão disponível</h3>
                  <p className="text-sm text-muted-foreground">
                    Seja o primeiro a criar uma missão ou aguarde novas oportunidades.
                  </p>
                </div>
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
