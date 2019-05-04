import axios from "axios";
import { NextContext, NextFunctionComponent } from "next";
import LoggedInIndex from "../components/LoggedInIndex";
import LoggedOutIndex from "../components/LoggedOutIndex";
import { ISessionStatus, IWithSession } from "../types";
import getSessionStatus from "../utils/getSessionStatus";

interface IProps {
    sessionStatus: ISessionStatus;
}

const Index: NextFunctionComponent<IProps, {}, NextContext<{}, IWithSession>> =
    ({ sessionStatus }) => {
        if (sessionStatus.loggedIn) {
            return <LoggedInIndex sessionStatus={sessionStatus} />;
        } else {
            return <LoggedOutIndex />;
        }
    };

Index.getInitialProps = async ({ req }) => {
    if (req) {
        return { sessionStatus: getSessionStatus(req) };
    } else {
        const res = await axios({
            url: "/api/session/status",
        });
        return { sessionStatus: res.data };
    }
};

export default Index;
