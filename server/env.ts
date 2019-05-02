if (process.env.UID === undefined || process.env.SECRET === undefined) {
    throw "Missing UID or SECRET env. Do you have a .env file?";
}

export type Env = {
	UID: string,
	SECRET: string,
}

const env: Env = {
	UID: process.env.UID,
	SECRET: process.env.SECRET,
}

export default env;
