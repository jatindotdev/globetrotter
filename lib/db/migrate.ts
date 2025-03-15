import { db, sql } from "@/lib/db";
import * as schema from "./schema";

const initialData = [
  {
    city: "Paris",
    country: "France",
    clues: [
      "This city is home to a famous tower that sparkles every night.",
      "Known as the 'City of Love' and a hub for fashion and art.",
    ],
    funFacts: [
      "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
      "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules.",
    ],
    trivia: [
      "This city is famous for its croissants and macarons. Bon appétit!",
      "Paris was originally a Roman city called Lutetia.",
    ],
  },
  {
    city: "Tokyo",
    country: "Japan",
    clues: [
      "This city has the busiest pedestrian crossing in the world.",
      "You can visit an entire district dedicated to anime, manga, and gaming.",
    ],
    funFacts: [
      "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
      "More than 14 million people live in Tokyo, making it one of the most populous cities in the world.",
    ],
    trivia: [
      "The city has over 160,000 restaurants, more than any other city in the world.",
      "Tokyo's subway system is so efficient that train delays of just a few minutes come with formal apologies.",
    ],
  },
  {
    city: "New York",
    country: "USA",
    clues: [
      "Home to a green statue gifted by France in the 1800s.",
      "Nicknamed 'The Big Apple' and known for its Broadway theaters.",
    ],
    funFacts: [
      "The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.",
      "Times Square was once called Longacre Square before being renamed in 1904.",
    ],
    trivia: [
      "New York City has 468 subway stations, making it one of the most complex transit systems in the world.",
      "The Empire State Building has its own zip code: 10118.",
    ],
  },
  {
    city: "Rome",
    country: "Italy",
    clues: [
      "This city is built on seven hills and was once the center of a vast empire.",
      "Home to an ancient amphitheater where gladiators once fought.",
    ],
    funFacts: [
      "People throw approximately €1.5 million into the Trevi Fountain each year, which is collected and donated to charity.",
      "The Vatican City, located within this city, is the smallest independent state in the world.",
    ],
    trivia: [
      "There are more than 2,000 fountains throughout this city.",
      "The Pantheon in this city has the world's largest unreinforced concrete dome.",
    ],
  },
  {
    city: "Sydney",
    country: "Australia",
    clues: [
      "This city is famous for its iconic opera house with sail-shaped roofs.",
      "Home to one of the world's most famous harbors and a large steel arch bridge nicknamed 'The Coathanger'.",
    ],
    funFacts: [
      "The Sydney Opera House has over one million roof tiles covering approximately 1.62 hectares.",
      "Sydney's Bondi Beach is one of the most famous beaches in the world and can attract up to 40,000 visitors on a hot day.",
    ],
    trivia: [
      "Sydney is the oldest and largest city in Australia.",
      "The Sydney Harbour Bridge is the world's largest (but not the longest) steel arch bridge.",
    ],
  },
];

async function main() {
  // Connect to the database
  console.log("Connecting to database...");
  try {
    console.log("Creating schema...");

    await sql`DROP TABLE IF EXISTS trivia CASCADE`;
    await sql`DROP TABLE IF EXISTS fun_facts CASCADE`;
    await sql`DROP TABLE IF EXISTS clues CASCADE`;
    await sql`DROP TABLE IF EXISTS destinations CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;

    await sql`CREATE TABLE IF NOT EXISTS destinations (
      id SERIAL PRIMARY KEY,
      city VARCHAR(100) NOT NULL,
      country VARCHAR(100) NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS clues (
      id SERIAL PRIMARY KEY,
      destination_id INTEGER NOT NULL REFERENCES destinations(id),
      clue TEXT NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS fun_facts (
      id SERIAL PRIMARY KEY,
      destination_id INTEGER NOT NULL REFERENCES destinations(id),
      fact TEXT NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS trivia (
      id SERIAL PRIMARY KEY,
      destination_id INTEGER NOT NULL REFERENCES destinations(id),
      fact TEXT NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(100) NOT NULL UNIQUE,
      score INTEGER NOT NULL DEFAULT 0,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      total_answers INTEGER NOT NULL DEFAULT 0,
      created_at VARCHAR NOT NULL DEFAULT current_timestamp
    )`;

    console.log("Schema created successfully");

    console.log("Seeding initial data...");

    for (const destination of initialData) {
      const [newDestination] = await db
        .insert(schema.destinations)
        .values({
          city: destination.city,
          country: destination.country,
        })
        .returning();

      for (const clueText of destination.clues) {
        await db.insert(schema.clues).values({
          destinationId: newDestination.id,
          clue: clueText,
        });
      }

      for (const factText of destination.funFacts) {
        await db.insert(schema.funFacts).values({
          destinationId: newDestination.id,
          fact: factText,
        });
      }

      for (const triviaText of destination.trivia) {
        await db.insert(schema.trivia).values({
          destinationId: newDestination.id,
          fact: triviaText,
        });
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    // Close the database connection
    console.log("Closing database connection...");
    await db.$client.end();
  }
}

main();
