// Import redis as a promise-based lib
const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

// Establish redis connection
const redisClient = redis.createClient(process.env.REDIS_URL);

// Report successful connection
redisClient.on("connect", () => console.log("Session Service: REDIS CONNECTION ESTABLISHED"));

// Report redis errors
redisClient.on("error", (error) => console.log(`Session Service: REDIS ERROR -> ${error}`));


module.exports = {
  redisClient
};