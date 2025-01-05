import { Worker, Job } from 'bullmq';
import { workerConnection } from './lib/worker.config';
import { tasksHandler } from './tasks';
import dbConnect from './models/dbConnect';
new Worker('main',
    async (job: Job) => {
        switch (job.name) {
            case "balance":
                await tasksHandler.updateBalance(job)
                break;
            default:
                break;
        }
    },
    { connection: workerConnection, concurrency: 50 }
)
    .on("ready", async () => {
        await dbConnect()
        console.log("Worker Started")
    })
    .on('completed', job => {
        console.log(`${job.id} has completed!`);
    });