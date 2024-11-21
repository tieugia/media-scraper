export interface FetchDataParamsDto {
    page?: number;
    limit?: number;
    isImage?: boolean;
    from?: string;
    to?: string;
    search?: string;
}