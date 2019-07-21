import React from "react";
import Header from "./Header";

const Page = ({ children, sessionStatus }) => (
    <div className="Page">
        <Header login={sessionStatus.login} />
        {children}
    </div>
);

export default Page;
