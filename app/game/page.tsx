"use client";

import GameView from "@/components/GameView";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Challenge = {
  userName: string;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  timestamp: string;
};

export default function GamePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | undefined>(undefined);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user");
    if (!user) {
      // Redirect to login if no user, unless there's a challenge
      const challengeParam = searchParams.get("challenge");
      if (!challengeParam) {
        router.push("/");
      }
    } else {
      setIsAuthenticated(true);
    }

    const challengeParam = searchParams.get("challenge");
    if (challengeParam) {
      try {
        const decoded = atob(challengeParam);
        const challengeData = JSON.parse(decoded) as Challenge;
        setChallenge(challengeData);
      } catch (e) {
        console.error("Failed to parse challenge data", e);
      }
    }
  }, [router, searchParams]);

  return <GameView challenge={challenge} />;
}
