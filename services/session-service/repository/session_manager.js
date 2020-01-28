const { redisClient } = require("../config/redis_config");


const SESSION_KEY_PREFIX = "USER_SESSION";


/*** Private module methods ***/

const _getSessionKey = (userId) => `${SESSION_KEY_PREFIX}:${userId}`;


/*** Public module methods ***/

const getSessionToken = async (userId) => {
  try {
    // Use key to get the session token from Redis
    return await redisClient.getAsync(_getSessionKey(userId));
  }
  catch (error) {
    console.error(`Session Service: getSessionToken ERROR -> ${error}`);
    return false;
  }
}

const setSessionToken = async (userId, token) => {
  try {
    // Add key and session token key/value pair to Redis
    return await redisClient.setAsync(_getSessionKey(userId), token);
  }
  catch (error) {
    console.error(`Session Service: setSessionToken ERROR -> ${error}`);
    return false;
  }
}

const removeSessionToken = async (userId) => {
  try {
    // Remove session from redis
    return await redisClient.delAsync(_getSessionKey(userId));
  }
  catch (error) {
    console.error(`Session Service: removeSessionToken ERROR -> ${error}`);
    return false;
  }
}


module.exports = {
  getSessionToken,
  setSessionToken,
  removeSessionToken
};