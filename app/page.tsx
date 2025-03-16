import { Globe } from "@/components/magicui/globe";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen items-center overflow-hidden rounded-lg border bg-background">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 pt-28">
        GlobeTrotter
      </span>
      <span className="text-2xl font-normal text-muted-foreground">
        Test your geographic knowledge by guessing world locations!
      </span>
      <Button size="lg" className="px-8 mt-4 z-50" asChild>
        <Link href="/game">Play Now</Link>
      </Button>
      <Globe className="top-64" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
    </div>
  );
}
