import { WithSession } from "../types";

type SessionStatus = {
	loggedIn: boolean;
}

export default function getSessionStatus(req: WithSession): SessionStatus {
	if (req.user) {
		return { loggedIn: true };
	} else {
		return { loggedIn: false };
	}
}
