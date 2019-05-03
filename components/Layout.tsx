import Head from "next/head";
import { FunctionComponent } from "react";

const Layout: FunctionComponent = ({ children }) => {
    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700" rel="stylesheet" />
            </Head>
            <style jsx global>{`
                body {
                    margin: 0;
                    font-family: 'Roboto Mono', monospace;
                    background-color: black;
                    color: white;
                    width: 100vw;
                    height: 100vh;
                }

                a, a:visited {
                    color: #99f;
                    text-decoration: none;
                }
            `}
            </style>
            {children}
        </>
    );
};

export default Layout;
