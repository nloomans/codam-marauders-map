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
