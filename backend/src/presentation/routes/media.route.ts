import { Router } from 'express';
import { MediaService } from '../../application/services/media.service';
import { CrawlService } from '../../application/services/crawl.service';
import { MediaRepository } from '../../infrastructure/repositoríes/media.repository';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { URLWorker } from '../../infrastructure/queue';
import { CacheService } from '../../application/services/cache.service';
import { MediaController } from '../controllers/media.controller';

const router = Router();

// Instantiate repository, crawl service, and data service
const repository = new MediaRepository();
const crawlService = new CrawlService();
const cacheService = new CacheService();
const imageService = new MediaService(repository, crawlService, cacheService);
const worker = new URLWorker(imageService);
worker.start();

// Instantiate controller
const controller = new MediaController(imageService);

// Define routes
router.get('/', asyncHandler(controller.get.bind(controller)));
router.post('/', asyncHandler(controller.post.bind(controller)));

export default router;
