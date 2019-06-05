import axios, { AxiosInstance } from "axios";
import httpLinkHeader from "http-link-header";
import { create as makeOauth2, AccessToken, OAuthClient } from "simple-oauth2";
import { ILocations } from "../types";

const sleep = (ms: number) =>
    new Promise((resolve) => global.setTimeout(resolve, ms));

const pad = (str: string, n: number): string =>
    str.length < n ? pad(str + " ", n) : str;

export interface IGetAccessToken {
    (): Promise<AccessToken>;
}

const makeGetAccessToken =
    (oauthClient: OAuthClient): IGetAccessToken => async () =>
        oauthClient.accessToken.create(
            oauthClient.clientCredentials.getToken({}));

export interface IGetRefreshingAccessToken {
    (): Promise<string>;
}

export const makeGetRefreshingAccessToken =
    (getAccessToken: IGetAccessToken): IGetRefreshingAccessToken => {
        let tokenCache: AccessToken | null = null;

        return async (): Promise<string> => {
            if (tokenCache == null || tokenCache.expired()) {
                tokenCache = await getAccessToken();
            }
            return tokenCache.token.access_token;
        }
    }

interface ISendGetRequest {
    (url: string): Promise<any>;
}

const makeSendGetRequest = (
    axiosInstance: AxiosInstance,
    getRefreshingAccessToken: IGetRefreshingAccessToken
): ISendGetRequest =>
    async (url: string): Promise<any> => {
        return axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${await getRefreshingAccessToken()}`,
            }
        });
    };

const makeGetAllPages = (sendGetRequest: ISendGetRequest) =>
    async function getAllPages(url: string, acc = []): Promise<any> {
        const { data, headers } = await sendGetRequest(url);
        const totalData = acc.concat(data);
        const next = headers.link &&
            httpLinkHeader.parse(headers.link).get("rel", "next")[0];
        if (!next) {
            return (totalData);
        }
        await sleep(500);
        return (getAllPages(next.uri, totalData));
    };

export default async function pull(callback: (locations: ILocations) => void) {
    if (process.env.UID === undefined || process.env.SECRET === undefined) {
        throw new Error("Missing UID or SECRET env. Do you have a .env file?");
    }

    const oauthClient = makeOauth2({
        auth: {
            tokenHost: "https://api.intra.42.fr",
        },
        client: {
            id: process.env.UID,
            secret: process.env.SECRET,
        },
    });

    const axiosInstance = axios.create();
    const getAccessToken = makeGetAccessToken(oauthClient);
    const getRefreshingAccessToken =
        makeGetRefreshingAccessToken(getAccessToken);
    const sendGetRequest =
        makeSendGetRequest(axiosInstance, getRefreshingAccessToken);

    // TODO: replace any with proper types
    const getAllPages = makeGetAllPages(sendGetRequest);
    while (true) {
        const rawLocations: any[] = await getAllPages(
            "https://api.intra.42.fr/v2/campus/14/locations" +
            "?per_page=100&filter[active]=true&filter[primary]=true",
        );
        const locations: ILocations = rawLocations.reduce((prev, curr) => {
            const { host, user: { login } } = curr;
            return {
                ...prev,
                [login]: host,
            };
        }, {});
        callback(locations);
        await sleep(15 * 1000);
    }
}
