import { FunctionComponent, useEffect, useState } from "react";
import makeIo from "socket.io-client";
import Map from "../components/Map";
import { ILocations, ISessionStatusLoggedIn } from "../types";
import Page from "./Page";

interface IProps {
    sessionStatus: ISessionStatusLoggedIn;
}

type ILocationsState
    = ILocationsSuccessfulState
    | ILocationsErrorState
    | ILocationsLoadingState;

interface ILocationsSuccessfulState {
    type: "successful";
    locations: ILocations;
}

interface ILocationsErrorState {
    type: "error";
    error: string;
}

interface ILocationsLoadingState {
    type: "loading";
}

const useLocations = (): ILocationsState => {
    const [state, setState] = useState<ILocationsState>({ type: "loading" });

    useEffect(() => {
        const socket = makeIo();

        socket.on("locations", (locations: ILocations) => {
            setState({ type: "successful", locations });
        });

        function onError(error: string) {
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

const LoggedInIndex: FunctionComponent<IProps> = ({ sessionStatus }) => {
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
