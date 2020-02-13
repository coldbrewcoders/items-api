// Import redis as a promise-based lib
import redis from "redis";
import bluebird from "bluebird";

// Utils
import logger from "../../utils/Logger";

// Types
import { RedisClient } from "redis";


// Promisify all redis calls
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

// Establish redis connection
const redisClient: RedisClient = redis.createClient(process.env.REDIS_URL);

// Report successful connection
redisClient.on("connect", () => logger.info("REDIS CONNECTION ESTABLISHED"));

// Report redis errors
redisClient.on("error", (error) => logger.info(`REDIS ERROR -> ${error}`));

export { redisClient };