export class Media {
    id: string;
    webUrl: string;
    url: string;
    isImage: boolean;
    createdAt: Date;

    constructor(id: string, webUrl: string, url: string, isImage: boolean, createdAt: Date) {
        this.id = id;
        this.webUrl = webUrl;
        this.url = url;
        this.isImage = isImage;
        this.createdAt = createdAt;
    }
}
