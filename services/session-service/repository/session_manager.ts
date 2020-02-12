import { redisClient } from "../config/redis_config";

// Utils
import logger from "../../utils/Logger";


const SESSION_KEY_PREFIX: string = "USER_SESSION";


/*** Private module methods ***/

const _getSessionKey = (userId: number): string => `${SESSION_KEY_PREFIX}:${userId}`;


/*** Public module methods ***/

const getSessionToken = async (userId: number): Promise<any> => {
  try {
    // Use key to get the session token from Redis
    return await redisClient.getAsync(_getSessionKey(userId));
  }
  catch (error) {
    logger.error(`Session Service: getSessionToken ERROR -> ${error}`);
  }
}

const setSessionToken = async (userId: number, token: string): Promise<any> => {
  try {
    // Add key and session token key/value pair to Redis (expires in 30 minutes)
    return await redisClient.setAsync(_getSessionKey(userId), token, "EX", 1800);
  }
  catch (error) {
    logger.error(`Session Service: setSessionToken ERROR -> ${error}`);
  }
}

const removeSessionToken = async (userId: number): Promise<any> => {
  try {
    // Remove session from redis
    return await redisClient.delAsync(_getSessionKey(userId));
  }
  catch (error) {
    logger.error(`Session Service: removeSessionToken ERROR -> ${error}`);
  }
}

export { getSessionToken, setSessionToken, removeSessionToken };