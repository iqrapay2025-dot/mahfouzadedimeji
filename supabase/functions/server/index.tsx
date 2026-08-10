import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for the deployed site origin only
const allowedOrigins = new Set([
  "https://mahfouz-adedimeji.vercel.app",
  "https://mahfouzadedimeji.com",
  "https://www.mahfouzadedimeji.com",
  "https://mahfouz.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8443",
]);

app.use(
  "/*",
  cors({
    origin: (origin) => {
      // Allow requests with no origin (curl, server-to-server)
      // or from the allowed origins list. Return null to block.
      if (!origin) return origin;
      if (allowedOrigins.has(origin)) return origin;
      return null;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ca594394/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);