import { Request, Response, NextFunction } from 'express';
import { IMediaService } from '../../application/interfaces/i-media.service';
import { urlQueue } from '../../infrastructure/queue';

export class MediaController {
    constructor(private readonly mediaService: IMediaService) { }

    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, limit = 10, isImage, from, to, search } = req.query;

            const filters: any = {};
            if (isImage !== undefined) {
                filters.isImage = isImage === 'true'; 
            }
            if (from || to) {
                filters.timestamp = {
                    from: from ? new Date(from as string) : undefined,
                    to: to ? new Date(to as string) : undefined,
                };
            }
            if (search) {
                filters.search = search as string;
            }

            const paging = {
                limit: Number(limit),
                offset: (Number(page) - 1) * Number(limit),
            };

            const { data, total } = await this.mediaService.fetchData(filters, paging);

            res.status(200).json({
                data,
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalItems: total,
            });
        } catch (error) {
            next(error);
        }
    }

    async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const urls = req.body.urls;
            if (!Array.isArray(urls) || !urls.length) {
                res.status(400).json({ error: 'Invalid URLs' });
            }

            await urlQueue.add('process-urls', urls);

            res.status(202).json({ message: 'URL has been added to the queue for processing.' });
        } catch (error) {
            next(error);
        }
    }
}
