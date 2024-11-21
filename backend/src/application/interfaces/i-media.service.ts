import { Media } from '../../domain/entities/media.entity';

export interface IMediaService {
    fetchData(filters: any, paging: { limit: number; offset: number }): Promise<{ data: Media[]; total: number }>;
    create(urls: string[]): Promise<void>;
}
