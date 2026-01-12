"use client";

import { Header } from "@/components/Header";
import { MissionCard } from "@/components/MissionCard";
import { useApp } from "@/lib/context";
import { Onboarding } from "@/components/Onboarding";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { missions } = useApp();
  const router = useRouter();
  const availableMissions = missions.filter(m => m.status === "available");

  return (
    <div className="flex min-h-screen flex-col">
      <Onboarding />
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
              <EmptyState
                icon={require("lucide-react").MapPin}
                title="Nenhuma missão disponível"
                description="Seja o primeiro a criar uma missão ou aguarde novas oportunidades na sua região."
                action={
                  <Button onClick={() => router.push('/create')} variant="outline" className="mt-4">
                    Criar Missão
                  </Button>
                }
              />
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
