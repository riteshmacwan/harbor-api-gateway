import dotenv from "dotenv";
import Redis from "ioredis";

const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
dotenv.config();

const credential = new DefaultAzureCredential();
const client = new SecretClient(process.env.KEYVAULT_URI, credential);


export default class CommonUtils {
  public readFromCache: boolean = true;
  private static instance: CommonUtils | null = null;
  private redisClient: any;
  private initializingRedis: Promise<void> | null = null;

  // Singleton access method
  public static getInstance(): CommonUtils {
    if (!CommonUtils.instance) {
      const commonUtils = new CommonUtils();
      CommonUtils.instance = commonUtils;
    }
    return CommonUtils.instance;
  }

  // public method for setting if want to read from cache
  setReadFromCache(value: boolean) {
    this.readFromCache = value; 
  }

  /**
    * Initializes the Redis client using configuration from Azure Key Vault.
    */
  initializeRedisClient = async () => {
    console.log("Initializing Redis client ==> ");
    let redisHost = { value: '127.0.0.1' };
    let redisPort = { value: '6379' };
    let redisPassword = { value: '' };
    let redisDB = { value: '0' };

    if (process.env.NODE_ENV !== 'local') {
      redisHost = await client.getSecret(`${process.env.NODE_ENV}-REDIS-HOST`);
      redisPort = await client.getSecret(`${process.env.NODE_ENV}-REDIS-PORT`);
      redisPassword = await client.getSecret(`${process.env.NODE_ENV}-REDIS-PASSWORD`);
      redisDB = await client.getSecret(`${process.env.NODE_ENV}-REDIS-DB`);
    }

    this.redisClient = new Redis({
      host: redisHost.value,
      port: parseInt(redisPort.value, 10),
      password: redisPassword.value,
      db: parseInt(redisDB.value, 10),
    });
  }

  public async ensureRedisInitialized(): Promise<void> {
    if (!this.redisClient) {
      if (!this.initializingRedis) {
        console.log('Redis New Initialise connection called ==> ');
        this.initializingRedis = this.initializeRedisClient();
      }
      await this.initializingRedis;
      this.initializingRedis = null; // Reset for future re-initializations if needed
    }
  }

  setCache = async (key: string, data: any, ttl = 30) => {
    await this.ensureRedisInitialized();
    try {
      // Serialize data to JSON before storing in Redis
      const jsonData = JSON.stringify(data);
      console.log("jsonData", jsonData);
      // Use the set method of ioredis with the 'EX' option to set TTL in seconds
      await this.redisClient.set(key, jsonData, 'EX', ttl);
    } catch (error) {
      throw new Error('Failed to set cache'); // Throw an error to reject the promise
    }
  };

  getCache = async (key: any) => {
    try {
      await this.ensureRedisInitialized();
      const cachedData = await this.redisClient.get(key);
      return cachedData ? this.safeJSONParse(cachedData) : null;
    } catch (error) {
      return null;
    }
  };

  getSecret = async (secretName : string)  => {
    try {
        const keyValutKey = secretName;
        if (this.readFromCache) {
          const cachedData = await this.getCache(keyValutKey);
          if(cachedData){
            return cachedData;
          }
        }
        // Retrieve the secret from Key Vault
        const secret = await client.getSecret(secretName);
        if (!secret) {
          throw new Error('Failed to retrieve secret from Key Vault');
        }

        await this.setCache(keyValutKey, secret.value, 86400);
        return secret.value;
    } catch (error) {
       return null;
    }
  };

  /**
   * Tries to parse a string as JSON. Returns the parsed JSON or the original string if parsing fails.
   * @param {string} data - The string to parse as JSON.
   * @returns {any} - The parsed JSON object if data is a valid JSON string, otherwise the original string.
   */
  safeJSONParse(data: string): any {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;  // Return the original data if it's not JSON
    }
  }

}

