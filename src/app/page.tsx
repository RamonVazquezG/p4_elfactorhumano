"use client";

import { ENDING_PRESETS } from "@/simulation/data/endingPresets";
import { INTRO_DIALOGUE } from "@/simulation/data/narrativeDialogs";
import { METRIC_DEFINITIONS, SIMULATION_TUNING } from "@/simulation/state/initialMetrics";
import { selectActiveTask, useGameStore } from "@/simulation/state/useGameStore";
import { useSimulationLoop } from "@/simulation/state/useSimulationLoop";
import { KanbanBoard } from "@/ui/dashboard/KanbanBoard";
import { GameOverScreen } from "@/ui/end/GameOverScreen";
import { IntroDialogModal } from "@/ui/intro/IntroDialogModal";
import { MainMenuScreen } from "@/ui/main-menu/MainMenuScreen";

/**
 * Enrutador raíz: orquesta los cambios de pantalla de la máquina de estados
 * [INTRO] -> [MAIN_MENU] -> [SIMULATION_DASHBOARD] -> [GAME_OVER]
 * y conecta la capa de presentación con el almacén central.
 */
export default function Home() {
  // Arranca/detiene el reloj de la simulación según la pantalla activa.
  useSimulationLoop();

  const screen = useGameStore((s) => s.screen);
  const metrics = useGameStore((s) => s.metrics);
  const queue = useGameStore((s) => s.queue);
  const history = useGameStore((s) => s.history);
  const stats = useGameStore((s) => s.stats);
  const ending = useGameStore((s) => s.ending);
  const clock = useGameStore((s) => s.clock);
  const startedAt = useGameStore((s) => s.startedAt);
  const activeTask = useGameStore(selectActiveTask);

  const acknowledgeIntro = useGameStore((s) => s.acknowledgeIntro);
  const startSimulation = useGameStore((s) => s.startSimulation);
  const openTask = useGameStore((s) => s.openTask);
  const closeTask = useGameStore((s) => s.closeTask);
  const resolveTask = useGameStore((s) => s.resolveTask);
  const returnToMenu = useGameStore((s) => s.returnToMenu);

  const elapsedMs = startedAt === null ? 0 : clock - startedAt;

  switch (screen) {
    case "INTRO":
      return <IntroDialogModal lines={INTRO_DIALOGUE} onFinish={acknowledgeIntro} />;

    case "MAIN_MENU":
      return (
        <MainMenuScreen
          ticketsToSurvive={SIMULATION_TUNING.ticketsToSurvive}
          // Date.now() se invoca en el manejador del evento, nunca durante el render.
          onStart={() => startSimulation(Date.now())}
        />
      );

    case "SIMULATION_DASHBOARD":
      return (
        <KanbanBoard
          metrics={metrics}
          metricDefinitions={METRIC_DEFINITIONS}
          queue={queue}
          history={history}
          activeTask={activeTask}
          now={clock}
          elapsedMs={elapsedMs}
          ticketsToSurvive={SIMULATION_TUNING.ticketsToSurvive}
          maxQueueSize={SIMULATION_TUNING.maxQueueSize}
          onOpenTask={openTask}
          onCloseTask={closeTask}
          onResolveTask={(taskId, strategy) => resolveTask(taskId, strategy, Date.now())}
        />
      );

    case "GAME_OVER":
      return ending ? (
        <GameOverScreen
          ending={ENDING_PRESETS[ending]}
          metrics={metrics}
          stats={stats}
          history={history}
          durationMs={elapsedMs}
          onRestart={returnToMenu}
        />
      ) : null;
  }
}
