import axios from 'axios';
import { FetchDataParamsDto } from '../dtos/fetch-data-params.dto';
import {Buffer} from 'buffer';

const API_BASE_URL = 'http://localhost:3002/api/media';
const username = 'admin';
const password = 'password';
const credentials = Buffer.from(`${username}:${password}`).toString('base64');

export const fetchData = async ({
    page = 1,
    limit = 10,
    isImage,
    from,
    to,
    search,
}: FetchDataParamsDto) => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (isImage !== undefined) params.append('isImage', String(isImage));
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (search) params.append('search', search);

    const response = await axios.get(`${API_BASE_URL}?${params.toString()}`, {
        headers: {
            Authorization: `Basic ${credentials}`,
        }
    });
    return response.data;
};

export const postUrl = async (urls: string[]) => {
    const response = await axios.post(API_BASE_URL, { urls: urls }, {
        headers: {
            Authorization: `Basic ${credentials}`,
        }
    });
    return response.data;
};

