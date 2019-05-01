// Type definitions for passport-42 1.2.4
// Project: https://github.com/pandark/passport-42
// Definitions by: Noah Loomans <https://noahloomans.com/>

import { Strategy } from "passport";

declare module 'passport-42';

export = FortyTwoStrategy;

interface Options {
	clientID: string,
	clientSecret: string,
	callbackURL: string,
};

/*~ Write your module's methods and properties in this class */
declare class FortyTwoStrategy extends Strategy {
    constructor(
		options: Options,
		callback: (accessToken: any, refreshToken: any, profile: any, cb: any) => void,
	);
}
