export interface ILocations {
    [login: string]: string;
}

export interface ISession {
    id: number;
    login: string;
}

export interface IWithSession {
    user?: ISession;
}

export type ISessionStatus = ISessionStatusLoggedIn | ISessionStatusLoggedOut;

export interface ISessionStatusLoggedOut {
    loggedIn: false;
}

export interface ISessionStatusLoggedIn {
    loggedIn: true;
    login: string;
}
