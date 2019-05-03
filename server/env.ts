if (process.env.UID === undefined || process.env.SECRET === undefined) {
    throw new Error("Missing UID or SECRET env. Do you have a .env file?");
}

export interface IEnv {
    SECRET: string;
    UID: string;
}

const env: IEnv = {
    SECRET: process.env.SECRET,
    UID: process.env.UID,
};

export default env;
