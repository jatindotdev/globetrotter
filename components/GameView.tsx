"use client";

import { MarkerControl } from "@/components/MarkerControl";
import { env } from "@/env";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import confetti from "canvas-confetti";
import { ArrowRight, Heart, RefreshCcw, Rotate3D } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ChallengeShare from "./ChallengeShare";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const INITIAL_LIVES = 1;

type GameScore = {
  correct: number;
  incorrect: number;
};

type Destination = {
  id: number;
  city: string;
  country: string;
  clues: string[];
  funFact?: string;
};

type Challenge = {
  userName: string;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  timestamp: string;
};

interface GameViewProps {
  challenge?: Challenge;
}

export default function GameView({ challenge }: GameViewProps) {
  const [user, setUser] = useState<{ id: string; username: string } | null>(
    null
  );
  const router = useRouter();
  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
  const [currentDestination, setCurrentDestination] =
    useState<Destination | null>(null);
  const [showSecondClue, setShowSecondClue] = useState(false);
  const [guessMarker, setGuessMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [guessResult, setGuessResult] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [score, setScore] = useState<GameScore>({ correct: 0, incorrect: 0 });
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFunFact, setCurrentFunFact] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }, []);

  useEffect(() => {
    if (challenge) {
      setChallengeDialogOpen(true);
    }
  }, [challenge]);

  useEffect(() => {
    fetchRandomDestination();
  }, []);

  const fetchRandomDestination = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/destination/random");
      if (!response.ok) {
        throw new Error("Failed to fetch destination");
      }

      const data = await response.json();
      setCurrentDestination(data);
    } catch (error) {
      console.error("Error fetching destination:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCityFromCoordinates = useCallback(
    async (lat: number, lng: number) => {
      try {
        setIsLoadingCity(true);

        const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);

        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }

        const data = await response.json();
        setSelectedCity(data.city);
      } catch (error) {
        console.error("Error fetching city:", error);
        setSelectedCity("Error: Couldn't determine location");
      } finally {
        setIsLoadingCity(false);
      }
    },
    []
  );

  const handlePlaceMarker = useCallback(
    (lat: number, lng: number) => {
      setGuessMarker({ lat, lng });
      fetchCityFromCoordinates(lat, lng);
    },
    [fetchCityFromCoordinates]
  );

  const handleCheckGuess = useCallback(async () => {
    if (!currentDestination || !guessMarker || !selectedCity) return;

    try {
      setIsLoading(true);

      const response = await fetch("/api/destination/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinationId: currentDestination.id,
          guess: selectedCity,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check guess");
      }

      const result = await response.json();

      setGuessResult(result.correct ? "correct" : "incorrect");
      setCurrentFunFact(result.funFact);

      if (result.correct) {
        setScore((prev) => ({
          correct: prev.correct + 1,
          incorrect: prev.incorrect,
        }));
        triggerConfetti();
      } else {
        const newLives = lives - 1;
        const newIncorrectScore = score.incorrect + 1;

        setLives(newLives);
        setScore((prev) => ({
          correct: prev.correct,
          incorrect: newIncorrectScore,
        }));

        if (newLives <= 0) {
          handleGameOver(score.correct, score.correct + newIncorrectScore);
          return;
        }
      }

      setShowResultDialog(true);
    } catch (error) {
      console.error("Error checking guess:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentDestination, guessMarker, selectedCity, lives, user?.id]);

  const handleGameOver = async (
    correctAnswers: number,
    totalAnswers: number
  ) => {
    if (user) {
      try {
        await fetch("/api/game/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            correctAnswers,
            totalAnswers,
          }),
        });
      } catch (error) {
        console.error("Failed to save game results:", error);
      }
    }

    setShowGameOverDialog(true);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleNextLocation = () => {
    setGuessMarker(null);
    setSelectedCity(null);
    setGuessResult(null);
    setShowSecondClue(false);
    setShowResultDialog(false);
    fetchRandomDestination();
  };

  const restartGame = () => {
    setLives(INITIAL_LIVES);
    setScore({ correct: 0, incorrect: 0 });
    setShowGameOverDialog(false);
    handleNextLocation();
  };

  const toggleClue = () => {
    setShowSecondClue(!showSecondClue);
  };

  const renderLives = () => {
    return Array(INITIAL_LIVES)
      .fill(0)
      .map((_, index) => (
        <Heart
          key={index}
          className={`h-5 w-5 ${
            index < lives
              ? "fill-red-500 text-red-500"
              : "fill-none text-gray-300"
          }`}
        />
      ));
  };

  if (!currentDestination && isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-lg">Loading game...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API}>
        <Map
          defaultCenter={{ lat: 20, lng: 0 }}
          defaultZoom={2}
          minZoom={3}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId="globetrotter-map"
          className="w-full h-screen"
        >
          <MarkerControl
            onPlaceMarker={handlePlaceMarker}
            guessMarker={guessMarker}
            selectedCity={selectedCity}
            onCheckGuess={handleCheckGuess}
            isLoading={isLoadingCity || isLoading}
          />
        </Map>
      </APIProvider>
      <div className="absolute top-4 left-4 flex flex-col gap-4 z-10">
        <Card className="w-80">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-green-500">
                    {score.correct}
                  </p>
                  <p className="text-xs text-gray-600">Correct</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-red-500">
                    {score.incorrect}
                  </p>
                  <p className="text-xs text-gray-600">Incorrect</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4">
                <span className="text-sm font-medium mr-1">Lives:</span>
                {renderLives()}
              </div>
              {user && (
                <p className="text-sm text-gray-500">
                  Logged in as: {user.username}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {currentDestination && !challengeDialogOpen && (
          <Card className="w-80">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Hint</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleClue}
                className="h-8 w-8 hover:scale-110 transition-transform duration-200"
              >
                <Rotate3D size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                {showSecondClue
                  ? currentDestination.clues[1] || "No second clue available"
                  : currentDestination.clues[0] || "No clue available"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle
              className={
                guessResult === "correct" ? "text-green-500" : "text-red-500"
              }
            >
              {guessResult === "correct"
                ? "Correct Answer! 🎉"
                : "Incorrect Answer! 😢"}
            </DialogTitle>

            {currentDestination && guessResult === "incorrect" && (
              <DialogDescription>
                The location was {currentDestination.city}, but you guessed{" "}
                {selectedCity}
              </DialogDescription>
            )}
          </DialogHeader>

          {currentFunFact && (
            <p className="my-4 text-center">{currentFunFact}</p>
          )}

          <DialogFooter>
            <Button onClick={handleNextLocation} className="w-full">
              Next Challenge <ArrowRight size={16} className="ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGameOverDialog}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="text-6xl">🏆</div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Game Over!
            </DialogTitle>
            <DialogDescription className="text-center mt-4" asChild>
              <div className="space-y-4">
                <div className="p-4 bg-slate-100 rounded-lg">
                  <p className="text-lg">Final Score</p>
                  <div className="flex justify-center gap-6 mt-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">
                        {score.correct}
                      </p>
                      <p className="text-sm text-gray-600">Correct</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-500">
                        {score.incorrect}
                      </p>
                      <p className="text-sm text-gray-600">Incorrect</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            {user && (
              <ChallengeShare
                userName={user.username}
                score={score.correct * 10}
                correctAnswers={score.correct}
                totalAnswers={score.correct + score.incorrect}
              />
            )}
            <Button onClick={restartGame} variant="secondary">
              Play Again <RefreshCcw size={16} className="ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {challenge !== undefined && (
        <Dialog open={challengeDialogOpen}>
          <DialogContent className="sm:max-w-md" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold">
                🎯 Challenge from {challenge.userName}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-green-500">
                    {challenge.correctAnswers}
                  </p>
                  <p className="text-xs text-gray-600">Correct</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-red-500">
                    {challenge.totalAnswers - challenge.correctAnswers}
                  </p>
                  <p className="text-xs text-gray-600">Incorrect</p>
                </div>
              </div>
              <p className="text-sm text-center font-medium mt-2">
                Can you beat this score?
              </p>
            </div>
            <DialogFooter className="flex flex-row gap-4">
              <Button
                variant="secondary"
                onClick={() => {
                  router.push("/");
                }}
                className="flex-1"
              >
                Go Back
              </Button>
              <Button
                onClick={() => setChallengeDialogOpen(false)}
                className="flex-1"
              >
                Start Game
                <ArrowRight size={16} />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
