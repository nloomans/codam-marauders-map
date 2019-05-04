import { ISessionStatus, IWithSession } from "../types";

export default function getSessionStatus(req: IWithSession): ISessionStatus {
    if (req.user) {
        return { loggedIn: true, login: req.user.login };
    } else {
        return { loggedIn: false };
    }
}
