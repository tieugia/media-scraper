export interface ICrawlService {
    execute(url: string): Promise<{ images: string[]; videos: string[] } | undefined>;
}
