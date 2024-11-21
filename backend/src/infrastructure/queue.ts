import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { IMediaService } from '../application/interfaces/i-media.service';
import path from 'path';
import { env } from 'process';

require("dotenv").config({
    path: path.resolve(__dirname, "../../config/.env"),
});

const connection = new IORedis({
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

export const urlQueue = new Queue('urlQueue', {
    connection,
    defaultJobOptions: {
        attempts: 10,
        backoff: {
            type: 'fixed',
            delay: 15000,
        },
    },
});

export class URLWorker {
    private readonly mediaService: IMediaService;

    constructor(mediaService: IMediaService) {
        this.mediaService = mediaService;
    }

    start() {
        const worker = new Worker(
            'urlQueue',
            async (job) => {
                console.log(`Processing job ${job.name} with id ${job.id}:`, job.data);

                await this.mediaService.create(job.data);

                console.log(`Job ${job.name} with id ${job.id} completed.`);
            },
            { connection }
        );

        worker.on('completed', (job) => {
            console.log(`Job ${job.name} with id ${job.id} finished successfully.`);
        });

        worker.on('failed', (job, err) => {
            console.error(`Job ${job!.name} with id ${job!.id} failed:`, err);
        });
    }
}
