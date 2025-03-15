import { env } from "@/env";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

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

    const data = await response.json();

    let city = "Unknown location";
    if (data.status === "OK") {
      for (const result of data.results) {
        for (const component of result.address_components) {
          if (component.types.includes("locality")) {
            city = component.long_name;
            break;
          }
          if (component.types.includes("administrative_area_level_1")) {
            city = component.long_name;
          }
        }

        if (city !== "Unknown location") break;
      }
    }

    return c.json({ city });
  } catch (error) {
    console.error("Geocoding API error:", error);
    return c.json({ error: "Failed to geocode coordinates" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
