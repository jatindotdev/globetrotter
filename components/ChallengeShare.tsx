"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface ChallengeShareProps {
  userName: string;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
}

export default function ChallengeShare({
  userName,
  score,
  correctAnswers,
  totalAnswers,
}: ChallengeShareProps) {
  const [shareLink, setShareLink] = useState<string>("");

  const generateShareLink = () => {
    const baseUrl = window.location.origin;

    const challenge = {
      userName,
      score,
      correctAnswers,
      totalAnswers,
      timestamp: new Date().toISOString(),
    };

    const encodedData = btoa(JSON.stringify(challenge));

    const shareableUrl = `${baseUrl}/game?challenge=${encodedData}`;
    setShareLink(shareableUrl);

    return shareableUrl;
  };

  const shareToWhatsApp = () => {
    const url = generateShareLink();
    const whatsappText = `I scored ${score} points (${correctAnswers}/${totalAnswers} correct) on GlobeTrotter! Can you beat me? ${url}`;
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

        <div className="p-4 my-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              {userName}&apos;s Challenge
            </h3>
            <p className="text-sm mt-2">Score: {score} points</p>
            <p className="text-sm">
              Answered: {correctAnswers} correct out of {totalAnswers}
            </p>
          </div>
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
