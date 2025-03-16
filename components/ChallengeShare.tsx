"use client";

import { Share2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface ChallengeShareProps {
  userId: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export default function ChallengeShare({
  userId,
  score,
  correctAnswers,
  incorrectAnswers,
}: ChallengeShareProps) {
  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/game?challenge=${encodeURIComponent(
      userId
    )}`;

    return shareableUrl;
  };

  const shareToWhatsApp = () => {
    const url = generateShareLink();
    const whatsappText = `I just played GlobeTrotter and scored ${score} points! Can you beat my score? Check it out here: ${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
      "_blank"
    );
  };

  const copyShareLink = async () => {
    const url = generateShareLink();
    await navigator.clipboard.writeText(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          Challenge a Friend <Share2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Score!</DialogTitle>
        </DialogHeader>

        <div className="my-4 rounded-lg">
          <img
            src={`https://dynamic-og-image-generator.vercel.app/api/generate?title=Score+${score}+%28W+${correctAnswers}+-+L+${incorrectAnswers}%29&author=Jatin&websiteUrl=has+challenged+you%21&avatar=&theme=nightOwl`}
            alt="Score Card"
            className="rounded h-auto aspect-video w-md bg-muted"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={shareToWhatsApp} className="flex items-center gap-2">
            Share to WhatsApp
          </Button>

          <Button
            variant="outline"
            onClick={copyShareLink}
            className="flex items-center gap-2"
          >
            Copy Challenge Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
