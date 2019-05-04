import { FunctionComponent } from "react";
import { ISessionStatusLoggedIn } from "../types";
import Header from "./Header";

interface IProps {
    sessionStatus: ISessionStatusLoggedIn;
}

const Page: FunctionComponent<IProps> = ({ children, sessionStatus }) => (
    <div className="Page">
        <Header login={sessionStatus.login} />
        {children}
    </div>
);

export default Page;
