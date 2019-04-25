require('dotenv').config();

const axios = require('axios');
const chalk = require('chalk');
const httpLinkHeader = require('http-link-header');
const oauth2 = require('simple-oauth2').create({
	client: {
		id: process.env.OAUTH2_42_UID,
		secret: process.env.OAUTH2_42_SECRET,
	},
	auth: {
		tokenHost: "https://api.intra.42.fr"
	}
});

const sleep = ms => new Promise(resolve => global.setTimeout(resolve, ms));

const pad = (str, n) => str.length < n ? pad(str + ' ', n) : str;

const makeGetAllPages = (axiosInstance) => async (url, acc = []) => {
	const { data, headers } = await axiosInstance.get(url);
	const totalData = acc.concat(data);
	const next = headers.link && httpLinkHeader.parse(headers.link).get('rel', 'next')[0];
	if (!next)
		return (totalData);
	await sleep(0.5 * 1000);
	return (makeGetAllPages(axiosInstance)(next.uri, totalData));
}

async function main() {
	const token = oauth2.accessToken.create(
		await oauth2.clientCredentials.getToken()
	);
	const instance = axios.create({
		headers: {
			'Authorization': `Bearer ${token.token.access_token}`
		}
	});
	const getAllPages = makeGetAllPages(instance);
	while (true) {
		const locations =
			await getAllPages('https://api.intra.42.fr/v2/campus/14/locations?per_page=100&filter[active]=true&filter[primary]=true');
		console.log(chalk.bold(`The are currently ${locations.length} users active`));
		locations.forEach(location => {
			const { host, user: { login } } = location;
			console.log(`${pad(login, 8)} - ${host}`);
		});
		await sleep(15 * 1000);
	};
}

main().catch((reason) => {
	console.error(reason);
	process.exit(1);
})
