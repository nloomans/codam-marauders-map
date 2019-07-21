import React from "react";
import Head from "next/head";

const Layout = ({ children }) => {
    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700" rel="stylesheet" />
            </Head>
            <style jsx global>{`
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: 'Roboto Mono', monospace;
                    background-color: #202124;
                    color: white;
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
