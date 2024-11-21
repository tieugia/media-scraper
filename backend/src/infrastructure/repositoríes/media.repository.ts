import { env } from 'process';
import { IMediaRepository } from '../../application/interfaces/i-media.repository';
import { MediaModel } from '../database/media.model';
import { Op } from 'sequelize';
import sequelize from 'sequelize';
import { Readable } from 'stream';
import path from 'path';

require("dotenv").config({
    path: path.resolve(__dirname, "../../../config/.env"),
});

export class MediaRepository implements IMediaRepository {
    async fetch(filters: any, paging: { limit: number; offset: number }): Promise<{ data: any[]; total: number }> {
        const where: any = {};
        if (filters.isImage !== undefined) {
            where.isImage = filters.isImage;
        }

        if (filters.timestamp) {
            if (filters.timestamp.from) {
                where.createdAt = { ...where.createdAt, $gte: filters.timestamp.from };
            }
            if (filters.timestamp.to) {
                where.createdAt = { ...where.createdAt, $lte: filters.timestamp.to };
            }
        }

        if (filters.search) {
            where.webUrl = { [Op.like]: `%${filters.search}%` };
        }

        const { rows, count } = await MediaModel.findAndCountAll({
            where,
            order: sequelize.literal('createdAt DESC'),
            attributes: ['webUrl', 'url', 'isImage'],
            limit: paging.limit,
            offset: paging.offset,
        });

        return { data: rows.map((row) => row.toJSON()), total: count };
    }

    async bulkCreate(data: { webUrl: string, url: string; isImage: boolean }[]): Promise<any[]> {
        return MediaModel.bulkCreate(data, {
            validate: true,
            fields: ['webUrl', 'url', 'isImage'],
        });
    }

    async bulkInsertWithStream(data: { url: string; webUrl: string; isImage: boolean }[]): Promise<void> {
        const sql = require('mssql');
        const config = {
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            server: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            database: process.env.DATABASE_NAME,
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
        };

        try {
            const pool = await sql.connect(config);

            const table = new sql.Table('media');
            table.create = false;
            table.columns.add('isImage', sql.BIT, { nullable: false });
            table.columns.add('url', sql.NVarChar(3000), { nullable: false });
            table.columns.add('webUrl', sql.NVarChar(700), { nullable: false });

            const readable = Readable.from(data);

            readable.on('data', (item: { isImage: boolean; url: string; webUrl: string;  }) => {
                table.rows.add(item.isImage, item.url, item.webUrl);
            });

            await pool.request().bulk(table);

        } catch (err) {
            console.error('Bulk insert failed:', err);
        } finally {
            sql.close();
        }
    }
}

