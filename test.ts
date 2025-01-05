import { Queue } from 'bullmq';
import IORedis from 'ioredis';

import { envconfig } from './src/lib/config';
const connection = new IORedis({
    host: envconfig.WORKER_DB_HOST,
    port: envconfig.WORKER_DB_PORT,
    db: envconfig.WORKER_DB_NAME,
    username: envconfig.WORKER_DB_USERNAME,
    password: envconfig.WORKER_DB_PASSWORD,
    maxRetriesPerRequest: null
});
const myQueue = new Queue('balance', { connection });

(async () => {
    await myQueue.add('myJobName', { foo: 'bar' });
    await myQueue.add('myJobName', { qux: 'baz' });
    process.exit()
})()