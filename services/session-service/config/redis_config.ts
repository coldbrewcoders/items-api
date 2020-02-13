// Import redis as a promise-based lib
import redis from "redis";
import bluebird from "bluebird";

// Utils
import logger from "../../utils/Logger";

// Types
import { RedisClient } from "redis";


interface IRedisClientAsync extends RedisClient {
  getAsync(key: string): Promise<string>;
  setAsync(key: string, value: string, mode: string, duration: number): Promise<string>;
  delAsync(key: string): Promise<number>;
}


// Promisify all redis calls
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

// Establish redis connection
const redisClient: IRedisClientAsync = redis.createClient(process.env.REDIS_URL) as IRedisClientAsync;

// Report successful connection
redisClient.on("connect", () => logger.info("REDIS CONNECTION ESTABLISHED"));

// Report redis errors
redisClient.on("error", (error) => logger.info(`REDIS ERROR -> ${error}`));

export { redisClient };