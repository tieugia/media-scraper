import { Media } from '../../domain/entities/media.entity';

export interface IMediaRepository {
    fetch(filters: any, paging: { limit: number; offset: number }): Promise<{ data: Media[]; total: number }>;
    bulkCreate(data: { webUrl: string, url: string; isImage: boolean }[]): Promise<any[]>;
    bulkInsertWithStream(data: {  url: string; webUrl: string; isImage: boolean }[]): Promise<void>;
}
