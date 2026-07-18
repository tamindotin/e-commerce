import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URI);

redis.on("connect", () => {
  console.log("Redis connected.");
});

redis.on("error", (err) => {
  console.error("Error in Redis connection:", err.message);
  process.exit(1);
});

export default redis;
