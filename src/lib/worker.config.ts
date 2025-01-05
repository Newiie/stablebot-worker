import IORedis from 'ioredis';
import { envconfig } from './config'
export const workerConnection = new IORedis({
    host: envconfig.WORKER_DB_HOST,
    port: envconfig.WORKER_DB_PORT,
    db: envconfig.WORKER_DB_NAME,
    username: envconfig.WORKER_DB_USERNAME,
    password: envconfig.WORKER_DB_PASSWORD,
    maxRetriesPerRequest: null
});