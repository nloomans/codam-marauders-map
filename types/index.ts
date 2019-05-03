export type Locations = {
    [login: string]: string,
}

export type Session = {
    id: number,
    login: string,
}


export type WithSession = {
	user?: Session,
}
