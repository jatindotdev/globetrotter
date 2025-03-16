import { env } from "@/env";
import { createToken, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { compare, hash } from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

const SALT_ROUNDS = 10;

app.get("/geocode", async (c) => {
  const { lat, lng } = c.req.query();

  if (!lat || !lng) {
    return c.json({ error: "Missing latitude or longitude parameters" }, 400);
  }

  try {
    const apiKey = env.MAPS_BACKEND_API;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location data from Google API");
    }

    const data: {
      status: string;
      results: google.maps.GeocoderResult[];
    } = await response.json();

    let city = "Unknown location";

    if (data.status === "OK") {
      const addressComponents = data.results.find(
        (result) =>
          result.types.includes("locality") &&
          result.types.includes("political")
      );
      if (addressComponents) {
        city = addressComponents.formatted_address;
      }

      if (city === "Unknown location") {
        const alternativeAddress = data.results.find(
          (result) =>
            result.types.includes("administrative_area_level_1") &&
            result.types.includes("political")
        );
        if (alternativeAddress) {
          city = alternativeAddress.formatted_address;
        }
      }

      if (city === "Unknown location") {
        const countryAddress = data.results.find((result) =>
          result.types.includes("country")
        );
        if (countryAddress) {
          city = countryAddress.formatted_address;
        }
      }
    }

    return c.json({ city });
  } catch (error) {
    console.error("Geocoding API error:", error);
    return c.json({ error: "Failed to geocode coordinates" }, 500);
  }
});

app.post("/auth/register", async (c) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;

    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });

    if (existingUser) {
      return c.json({ error: "Username already exists" }, 409);
    }

    const hashedPassword = await hash(password, SALT_ROUNDS);

    const [newUser] = await db
      .insert(schema.users)
      .values({
        username,
        password: hashedPassword,
        score: 0,
        correctAnswers: 0,
        totalAnswers: 0,
      })
      .returning({
        id: schema.users.id,
        username: schema.users.username,
      });

    const token = createToken({
      id: newUser.id,
      username: newUser.username,
    });

    return c.json({
      message: "User registered successfully",
      id: newUser.id,
      username: newUser.username,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "Failed to register user" }, 500);
  }
});

app.post("/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;

    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });

    if (!user) {
      return c.json({ error: "Invalid username or password" }, 401);
    }

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      return c.json({ error: "Invalid username or password" }, 401);
    }

    const token = createToken({
      id: user.id,
      username: user.username,
    });

    return c.json({
      message: "Login successful",
      id: user.id,
      username: user.username,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Failed to authenticate" }, 500);
  }
});

app.get("/auth/me", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const payload = verifyToken(token);
    if (!payload) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, payload.id),
      columns: {
        id: true,
        username: true,
        score: true,
        correctAnswers: true,
        totalAnswers: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return c.json({ error: "Failed to fetch user data" }, 500);
  }
});

app.get("/destination/random", async (c) => {
  try {
    const destination = await db.query.destinations.findFirst({
      orderBy: sql`random()`,
    });

    if (!destination) {
      return c.json({ error: "No destinations found" }, 404);
    }

    const clues = await db.query.clues.findMany({
      where: eq(schema.clues.destinationId, destination.id),
      orderBy: sql`random()`,
      limit: 2,
    });

    const destinationClues = clues.map((c) => c.clue);

    return c.json({
      id: destination.id,
      city: destination.city,
      country: destination.country,
      clues: destinationClues,
    });
  } catch (error) {
    console.error("Error fetching random destination:", error);
    return c.json({ error: "Failed to fetch random destination" }, 500);
  }
});

app.post("/destination/check", async (c) => {
  try {
    const body = await c.req.json();
    const { destinationId, guess, userId } = body;

    if (!destinationId || !guess) {
      return c.json({ error: "Missing destination ID or guess" }, 400);
    }

    const destination = await db.query.destinations.findFirst({
      where: eq(schema.destinations.id, destinationId),
    });

    if (!destination) {
      return c.json({ error: "Destination not found" }, 404);
    }

    const isCorrect =
      guess.toLowerCase() === destination.city.toLowerCase() ||
      guess.toLowerCase().includes(destination.city.toLowerCase()) ||
      destination.city.toLowerCase().includes(guess.toLowerCase());

    const fact = await db.query.funFacts.findFirst({
      where: eq(schema.funFacts.destinationId, destinationId),
      orderBy: sql`random()`,
    });

    const funFact = fact
      ? fact.fact
      : "No fun fact available for this destination";

    return c.json({
      correct: isCorrect,
      correctAnswer: destination.city,
      country: destination.country,
      funFact: funFact,
    });
  } catch (error) {
    console.error("Error checking guess:", error);
    return c.json({ error: "Failed to check guess" }, 500);
  }
});

app.post("/game/save", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const payload = verifyToken(token);
    if (!payload) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, payload.id),
      columns: {
        id: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const body = await c.req.json();
    const { correctAnswers, totalAnswers } = body;

    await db
      .update(schema.users)
      .set({
        score: sql`${schema.users.score} + ${correctAnswers * 10}`,
        correctAnswers: sql`${schema.users.correctAnswers} + ${correctAnswers}`,
        totalAnswers: sql`${schema.users.totalAnswers} + ${totalAnswers}`,
      })
      .where(eq(schema.users.id, user.id));

    const userResp = await db.query.users.findFirst({
      where: eq(schema.users.id, user.id),
      columns: {
        username: true,
        score: true,
        correctAnswers: true,
        totalAnswers: true,
      },
    });

    return c.json({
      message: "Game results saved",
      user: userResp,
    });
  } catch (error) {
    console.error("Error saving game results:", error);
    return c.json({ error: "Failed to save game results" }, 500);
  }
});

app.get("/user/:id", async (c) => {
  try {
    const { id } = c.req.param();

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
      columns: {
        id: true,
        username: true,
        score: true,
        correctAnswers: true,
        totalAnswers: true,
        createdAt: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
