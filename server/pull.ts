import axios, { AxiosInstance } from 'axios';
import httpLinkHeader from 'http-link-header'
import { create as makeOauth2 } from 'simple-oauth2'
import { Locations } from '../types';

if (process.env.UID === undefined || process.env.SECRET === undefined) {
    throw "Missing UID or SECRET env. Do you have a .env file?";
}

const oauth2 = makeOauth2({
    client: {
        id: process.env.UID,
        secret: process.env.SECRET,
    },
    auth: {
        tokenHost: 'https://api.intra.42.fr'
    }
})

const sleep = (ms: number) =>
    new Promise(resolve => global.setTimeout(resolve, ms));

const pad = (str: string, n: number): string =>
    str.length < n ? pad(str + ' ', n) : str;

const makeGetAllPages = (axiosInstance: AxiosInstance) =>
    async (url: string, acc = []): Promise<any> => {
        const { data, headers } = await axiosInstance.get(url);
        const totalData = acc.concat(data);
        const next = headers.link && httpLinkHeader.parse(headers.link).get('rel', 'next')[0];
        if (!next)
            return (totalData);
        await sleep(500);
        return (makeGetAllPages(axiosInstance)(next.uri, totalData));
    }

export default async function pull(callback: (locations: Locations) => void) {
    const token = oauth2.accessToken.create(
        await oauth2.clientCredentials.getToken({})
    );
    const instance = axios.create({
        headers: {
            'Authorization': `Bearer ${token.token.access_token}`
        }
    });
    // TODO: replace any with proper types
    const getAllPages = makeGetAllPages(instance);
    while (true) {
        const rawLocations: any[] =
            await getAllPages('https://api.intra.42.fr/v2/campus/14/locations?per_page=100&filter[active]=true&filter[primary]=true');
        const locations: Locations = rawLocations.reduce((prev, curr) => {
            const { host, user: { login } } = curr;
            return {
                ...prev,
                [login]: host,
            }
        }, {});
        callback(locations);
        await sleep(15 * 1000);
    };
}
