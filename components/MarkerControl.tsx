import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

interface MarkerControlProps {
  onPlaceMarker: (lat: number, lng: number) => void;
  guessMarker: { lat: number; lng: number } | null;
  selectedCity: string | null;
  onCheckGuess: () => void;
  isLoading: boolean;
}

export function MarkerControl({
  onPlaceMarker,
  guessMarker,
  selectedCity,
  onCheckGuess,
  isLoading,
}: MarkerControlProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const clickListener = map.addListener(
      "click",
      (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const newPosition = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        onPlaceMarker(newPosition.lat, newPosition.lng);
      }
    );

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, onPlaceMarker]);

  if (!guessMarker) return null;

  return (
    <div className="relative">
      <AdvancedMarker position={guessMarker} />
      {guessMarker && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-white rounded-md shadow-lg w-md p-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-muted-foreground">
                  Selected Location
                </h3>
                {!isLoading ? (
                  <p className="text-2xl font-bold">
                    {selectedCity || "Unknown location"}
                  </p>
                ) : (
                  <>
                    <Skeleton className="h-8 w-5/6 " />
                    <Skeleton className="h-8 w-2/3 " />
                  </>
                )}
              </div>
              <Button
                disabled={isLoading}
                onClick={() => {
                  onCheckGuess();
                }}
                className="w-full"
              >
                Submit Guess
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
