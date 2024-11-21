import { Media } from '../../domain/entities/media.entity';
import { ICrawlService } from '../interfaces/i-crawl.service';
import { IMediaService } from '../interfaces/i-media.service';
import { IMediaRepository } from '../interfaces/i-media.repository';
import { ICacheService } from '../interfaces/i-cache-service';

export class MediaService implements IMediaService {
    constructor(
        private readonly repository: IMediaRepository,
        private readonly crawlDataService: ICrawlService,
        private readonly cacheService: ICacheService
    ) { }

    async fetchData(
        filters: { isImage?: boolean; timestamp?: { from?: Date; to?: Date }; search?: string },
        paging: { limit: number; offset: number }
    ): Promise<{ data: Media[]; total: number }> {
        const cacheKey = `data:${JSON.stringify(filters)}:${paging.limit}:${paging.offset}`;

        const cachedResult = await this.cacheService.get(cacheKey);
        if (cachedResult?.total > 0) {
            return cachedResult;
        }

        const result = await this.repository.fetch(filters, paging);

        await this.cacheService.set(cacheKey, result, 3600);

        return result;
    }

    async create(urls: string[]): Promise<void> {
        urls?.forEach(async (url) => {
            const result = await this.crawlDataService.execute(url);
            if (result) {
                const { images, videos } = result;
                const imageRecords = images.map((imageUrl) => ({
                    url: imageUrl,
                    webUrl: url,
                    isImage: true,
                }));

                const videoRecords = videos.map((videoUrl) => ({
                    url: videoUrl,
                    webUrl: url,
                    isImage: false,
                }));

                const allRecords = [...imageRecords, ...videoRecords];

                await this.repository.bulkCreate(allRecords);
                await this.cacheService.delete('data*');
            }
        })
    }
}
