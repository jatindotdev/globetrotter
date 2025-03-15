import React, { useState } from 'react';
import { useUser } from '@/lib/UserContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Share2 } from 'lucide-react';

export default function ChallengeShare() {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!user) {
    return null;
  }

  // Generate the invitation URL
  const generateInviteUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?inviter=${encodeURIComponent(user.id)}`;
  };

  // Generate WhatsApp share URL
  const generateWhatsAppUrl = () => {
    const inviteUrl = generateInviteUrl();
    const message = encodeURIComponent(
      `🧩 ${user.username} has challenged you to beat their score of ${user.score} in the Globetrotter Challenge! 🌎 Can you guess these world destinations? Play now: ${inviteUrl}`
    );
    return `https://wa.me/?text=${message}`;
  };

  // Copy invitation link to clipboard
  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(generateInviteUrl());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link', error);
    }
  };

  // Generate a preview image based on user's score
  const renderScorePreview = () => {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-full aspect-[2/1] rounded-lg p-6 text-white flex flex-col justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Globetrotter Challenge</h3>
          <p className="mb-4">{user.username}'s Score</p>
          <div className="text-4xl font-bold mb-2">{user.score}</div>
          <p>{user.correctAnswers} correct out of {user.totalAnswers} destinations</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <Share2 size={16} />
        Challenge a Friend
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Challenge Your Friends!</DialogTitle>
            <DialogDescription>
              Share your Globetrotter Challenge with friends and see if they can beat your score!
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {renderScorePreview()}

            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => window.open(generateWhatsAppUrl(), '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Share on WhatsApp
              </Button>

              <Button
                onClick={copyInviteLink}
                variant="outline"
              >
                {isCopied ? 'Link Copied!' : 'Copy Challenge Link'}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}