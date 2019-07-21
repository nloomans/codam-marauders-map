import React, { useState, useEffect } from "react";
import makeIo from "socket.io-client";
import Map from "./Map";
import Page from "./Page";

const useLocations = () => {
    const [state, setState] = useState({ type: "loading" });

    useEffect(() => {
        const socket = makeIo();

        socket.on("locations", (locations) => {
            setState({ type: "successful", locations });
        });

        function onError(error) {
            setState({ type: "error", error });
        }

        socket.on("connect_error", onError);
        socket.on("error", onError);

        return () => {
            socket.close();
        };
    }, []);

    return state;
};

const LoggedInIndex = ({ sessionStatus }) => {
    const state = useLocations();

    switch (state.type) {
        case "successful":
            return (
                <Page sessionStatus={sessionStatus}>
                    <main>
                        <ul>
                            {Object.keys(state.locations).map((login) =>
                                <li key={login}>{login} - {state.locations[login]}</li>,
                            )}
                        </ul>
                        <Map locations={state.locations} />
                    </main>
                </Page>
            );
        case "error":
            return <Page sessionStatus={sessionStatus}><main>Failed to connect: {state.error}</main></Page>;
        case "loading":
            return <Page sessionStatus={sessionStatus}><main>Loading...</main></Page>;
    }
};

export default LoggedInIndex;
