import { env } from "@/env";
import UserAuth from "@/components/UserAuth";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">
          GlobeTrotter
        </h1>
        <p className="text-xl text-white">
          Test your geographic knowledge by guessing world locations!
        </p>
      </div>

      <UserAuth />
    </main>
  );
}
