"use client";

import { MarkerControl } from "@/components/MarkerControl";
import { env } from "@/env";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import confetti from "canvas-confetti";
import { ArrowRight, Heart, RefreshCcw, Rotate3D } from "lucide-react";
import { useCallback, useState } from "react";
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

const LOCATIONS = [
  {
    name: "Paris",
    lat: 48.8566,
    lng: 2.3522,
    clue1: 'This city is known as the "City of Light"',
    clue2: "It has a famous tower that was built for a World Fair",
    funFact:
      "The Eiffel Tower was originally intended to be a temporary installation.",
    radius: 10000, // 10km radius for checking if the guess is correct
  },
  {
    name: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    clue1: "This city hosted the Olympics twice",
    clue2: "It has the busiest pedestrian crossing in the world",
    funFact: "Shinjuku Station is the busiest train station in the world.",
    radius: 15000, // 15km radius
  },
  {
    name: "New York City",
    lat: 40.7128,
    lng: -74.006,
    clue1: "This city never sleeps",
    clue2: "It has a famous statue that was a gift from France",
    funFact: "The New York Public Library has over 50 million items.",
    radius: 8000,
  },
];

const INITIAL_LIVES = 7;

type GameScore = {
  correct: number;
  incorrect: number;
};

export default function GameView() {
  const [currentLocation, setCurrentLocation] = useState(LOCATIONS[0]);
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

  const handleCheckGuess = useCallback(() => {
    if (!guessMarker || !selectedCity) return;

    const isCorrect =
      selectedCity.toLowerCase() === currentLocation.name.toLowerCase() ||
      selectedCity.toLowerCase().includes(currentLocation.name.toLowerCase()) ||
      currentLocation.name.toLowerCase().includes(selectedCity.toLowerCase());

    setGuessResult(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setScore((prev) => ({
        correct: prev.correct + 1,
        incorrect: prev.incorrect,
      }));
      triggerConfetti();
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setScore((prev) => ({
        correct: prev.correct,
        incorrect: prev.incorrect + 1,
      }));

      if (newLives <= 0) {
        setShowGameOverDialog(true);
        return;
      }
    }

    setShowResultDialog(true);
  }, [currentLocation.name, guessMarker, selectedCity, lives]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleNextLocation = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * LOCATIONS.length);
    } while (
      LOCATIONS[nextIndex].name === currentLocation.name &&
      LOCATIONS.length > 1
    );

    setCurrentLocation(LOCATIONS[nextIndex]);
    setGuessMarker(null);
    setSelectedCity(null);
    setGuessResult(null);
    setShowSecondClue(false);
    setShowResultDialog(false);
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
    return Array(lives)
      .fill(0)
      .map((_, index) => (
        <Heart key={index} className="h-5 w-5 fill-red-500 text-red-500" />
      ));
  };

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
            isLoading={isLoadingCity}
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
              <p className="font-semibold">
                Score: {score.correct} correct / {score.incorrect} incorrect
              </p>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium mr-1">Lives:</span>
                {renderLives()}
              </div>
            </div>
          </CardContent>
        </Card>

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
              {showSecondClue ? currentLocation.clue2 : currentLocation.clue1}
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showResultDialog}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <div className="flex items-center justify-center">
              {guessResult === "correct" ? (
                <div className="text-4xl animate-bounce">🎉</div>
              ) : (
                <div className="text-4xl">😢</div>
              )}
            </div>
            <DialogTitle
              className={`text-center text-xl ${
                guessResult === "correct"
                  ? "text-green-500 font-bold"
                  : "text-red-500 font-bold"
              }`}
            >
              {guessResult === "correct" ? "Excellent!" : "Not Quite Right"}
            </DialogTitle>
            {guessResult === "incorrect" && (
              <DialogDescription className="text-center p-2 bg-slate-100 rounded-lg mt-4">
                The correct location was{" "}
                <span className="font-bold text-primary">
                  {currentLocation.name}
                </span>
                , but you guessed{" "}
                <span className="font-bold text-red-500">{selectedCity}</span>
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="p-4 bg-primary/5 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">
              Did you know? 🤔
            </h4>
            <p className="text-sm text-muted-foreground">
              {currentLocation.funFact}
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={handleNextLocation}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <span>Next Challenge</span>
              <ArrowRight size={16} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGameOverDialog} onOpenChange={setShowGameOverDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Game Over! 😢</DialogTitle>
            <DialogDescription>
              You've used all your lives. Your final score was {score.correct}{" "}
              correct answers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-4 mt-4">
            <Button onClick={restartGame} className="w-full">
              Play Again <RefreshCcw size={16} className="ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
