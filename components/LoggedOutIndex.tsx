import { FunctionComponent } from "react";
import SmallPage from "./SmallPage";

const LoggedOutIndex: FunctionComponent = () => (
    <SmallPage>
        <p>Before we start,</p>
        <p><a href="/auth">“I solemnly swear that I am up to no good.”</a></p>
    </SmallPage>
);

export default LoggedOutIndex;
