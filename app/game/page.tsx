"use client";

import GameView from "@/components/GameView";
import { Suspense } from "react";

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameView />
    </Suspense>
  );
}
