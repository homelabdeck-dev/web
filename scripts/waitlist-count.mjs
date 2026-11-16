// Usage: node --env-file=.env.local scripts/waitlist-count.mjs [interest]   (default: ai-pack)
// Prints how many addresses asked to join a product waitlist and how many confirmed. Needs REDIS_URL.
import Redis from "ioredis";

const interest = process.argv[2] ?? "ai-pack";
const db = new Redis(process.env.REDIS_URL);
const [requested, confirmed, subscribers] = await Promise.all([
  db.scard(`waitlist:${interest}:requested`),
  db.scard(`waitlist:${interest}`),
  db.scard("subscribers"),
]);
console.log(`${interest}: ${confirmed} confirmed, ${requested} asked (unconfirmed included); newsletter total ${subscribers}`);
await db.quit();
