import axios from 'axios';
import { Parser } from 'htmlparser2';
import { ICrawlService } from '../interfaces/i-crawl.service';
import { Readable, Writable } from 'stream';
export class CrawlService implements ICrawlService {
    async execute(url: string): Promise<{ images: string[]; videos: string[] } | undefined>  {
        const { data } = await axios.get(url);;

        if (!data)           
            throw new Error(`Failed to fetch ${url}`);

        const images: string[] = [];
        const videos: string[] = [];

        const parser = new Parser(
            {
                onopentag(name: string, attributes: { src: string; }) {
                    if (name === 'img' && attributes.src) {
                        images.push(attributes.src);
                    }
                    if (name === 'source' && attributes.src) {
                        videos.push(attributes.src);
                    }
                },
            },
            { decodeEntities: true }
        );

        const writable = new Writable({
            write(chunk: Buffer, encoding: string, callback: (error?: Error | null) => void) {
                parser.write(chunk.toString());
                callback();
            },
        });

        const readableStream = Readable.from(data);
        readableStream.pipe(writable);

        await new Promise((resolve, reject) => {
            writable.on('finish', resolve);
            writable.on('error', reject);
        });

        return { images, videos };
    };
}
