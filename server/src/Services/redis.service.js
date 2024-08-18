const { promisify } = require("../Utils");

const redis = require("redis");

const redisClient = redis.createClient();

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNX = promisify(redisClient.setNX).bind(redisClient);
const delKey = promisify(redisClient.DEL).bind(redisClient);
const acquiredLock = async (productId, quantity, cartId) => {
  const key = `lock_v2024_${productId}`;
  const reTryTimes = 10;
  const expireTime = 3000; // 3 seconds
  const waitTime = 50;
  for (let index = 0; index < reTryTimes; index++) {
    const result = await setNX(key, expireTime);
    //  0 or 1
    if (Boolean(result)) {
      return key;
    } else {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
};

const releaseLock = async (lockKey) => {
  return await delKey(lockKey);
};
