import { NextFunctionComponent, NextContext } from "next";
import axios from "axios";
import LoggedInIndex from "../components/LoggedInIndex";
import LoggedOutIndex from "../components/LoggedOutIndex";
import getSessionStatus from "../utils/getSessionStatus";
import { WithSession } from "../types";

type Props = {
    loggedIn: boolean,
};

const Index: NextFunctionComponent<Props, {}, NextContext<{}, WithSession>> =
    ({ loggedIn }) => {
        if (loggedIn) {
            return <LoggedInIndex />;
        } else {
            return <LoggedOutIndex />
        }
    }

Index.getInitialProps = async ({ req }) => {
    if (req) {
        return getSessionStatus(req);
    } else {
        const res = await axios({
            url: '/api/session/status',
        });
        return res.data;
    }
}

export default Index;
