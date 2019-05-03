import axios from "axios";
import { NextContext, NextFunctionComponent } from "next";
import LoggedInIndex from "../components/LoggedInIndex";
import LoggedOutIndex from "../components/LoggedOutIndex";
import { IWithSession } from "../types";
import getSessionStatus from "../utils/getSessionStatus";

interface IProps {
    loggedIn: boolean;
}

const Index: NextFunctionComponent<IProps, {}, NextContext<{}, IWithSession>> =
    ({ loggedIn }) => {
        if (loggedIn) {
            return <LoggedInIndex />;
        } else {
            return <LoggedOutIndex />;
        }
    };

Index.getInitialProps = async ({ req }) => {
    if (req) {
        return getSessionStatus(req);
    } else {
        const res = await axios({
            url: "/api/session/status",
        });
        return res.data;
    }
};

export default Index;
