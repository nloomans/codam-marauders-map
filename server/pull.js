const axios = require("axios");
const httpLinkHeader = require("http-link-header");
const oauth2 = require("simple-oauth2");
const env = require('./env');

const oauth2Instance = oauth2.create({
    auth: {
        tokenHost: "https://api.intra.42.fr",
    },
    client: {
        id: env.UID,
        secret: env.SECRET,
    },
});

const sleep = (ms) => new Promise((resolve) => global.setTimeout(resolve, ms));

const pad = (str, n) => str.length < n ? pad(str + " ", n) : str;

const makeGetAccessToken = (oauth2Client) => {
    let tokenCache = null;

    return async () => {
        if (tokenCache == null || tokenCache.expired()) {
            tokenCache = oauth2Client.accessToken.create(
                await oauth2Client.clientCredentials.getToken({}));
        }
        return tokenCache.token.access_token;
    }
}

const makeSendGetRequest = (axiosInstance, getAccessToken) =>
    async (url) => {
        return axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${await getAccessToken()}`,
            }
        });
    };

const makeGetAllPages = (sendGetRequest) =>
    async function getAllPages(url, acc = []) {
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

module.exports = async function pull(callback) {
    const axiosInstance = axios.create();
    const getAccessToken = makeGetAccessToken(oauth2Instance);
    const sendGetRequest = makeSendGetRequest(axiosInstance, getAccessToken);

    const getAllPages = makeGetAllPages(sendGetRequest);
    while (true) {
        const rawLocations = await getAllPages(
            "https://api.intra.42.fr/v2/campus/14/locations" +
            "?per_page=100&filter[active]=true&filter[primary]=true",
        );
        const locations = rawLocations.reduce((prev, curr) => {
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
