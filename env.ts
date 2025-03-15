import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    MAPS_BACKEND_API: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_MAPS_API: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_MAPS_API: process.env.NEXT_PUBLIC_MAPS_API,
    MAPS_BACKEND_API: process.env.MAPS_BACKEND_API,
  },
});
