import { IWithSession } from "../types";

interface ISessionStatus {
    loggedIn: boolean;
}

export default function getSessionStatus(req: IWithSession): ISessionStatus {
    if (req.user) {
        return { loggedIn: true };
    } else {
        return { loggedIn: false };
    }
}
