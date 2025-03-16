import { env } from "@/env";
import jwt from "jsonwebtoken";

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRY = "7d";

export interface JwtPayload {
  id: string;
  username: string;
}

export function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
