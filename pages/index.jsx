import axios from "axios";
import LoggedInIndex from "../components/LoggedInIndex";
import LoggedOutIndex from "../components/LoggedOutIndex";
import getSessionStatus from "../utils/getSessionStatus";

const Index =
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
