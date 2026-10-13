"use client";

import { useEffect } from "react";
import { startSimulationClock } from "../engine/inactivityTimer";
import { useGameStore } from "./useGameStore";

/**
 * Hook que conecta el reloj de la simulación con el almacén.
 * Solo corre mientras el tablero está activo; se detiene al terminar la partida.
 */
export function useSimulationLoop(): void {
  const isRunning = useGameStore((s) => s.screen === "SIMULATION_DASHBOARD");
  const tick = useGameStore((s) => s.tick);

  useEffect(() => {
    if (!isRunning) return;
    // Primer tick inmediato para sincronizar el reloj visible.
    tick(Date.now());
    return startSimulationClock(tick);
  }, [isRunning, tick]);
}
