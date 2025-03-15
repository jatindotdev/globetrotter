import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/UserContext";
import React, { useState } from "react";

export default function UserRegistration() {
  const { user, registerUser } = useUser();
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setError("");
    setIsRegistering(true);

    try {
      await registerUser(username.trim());
    } catch (err: any) {
      setError(err.message || "Failed to register user");
    } finally {
      setIsRegistering(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          🧩 Welcome to Globetrotter! 🌎
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-slate-600 dark:text-slate-400">
              Enter a username to start your travel guessing adventure!
            </p>
            <Input
              type="text"
              placeholder="Your Globe-Trotting Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isRegistering}
              className="w-full"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={isRegistering}
          >
            {isRegistering
              ? "Setting up your profile..."
              : "Start the Adventure!"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
