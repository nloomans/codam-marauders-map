import { FunctionComponent, useEffect, useState } from "react";
import makeIo from "socket.io-client";
import Map from "../components/Map";
import { ILocations } from "../types";

interface IProps {
    login?: string;
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

const LoggedInIndex: FunctionComponent<IProps> = () => {
    const state = useLocations();

    switch (state.type) {
        case "successful":
            return (
                <main>
                    <ul>
                        {Object.keys(state.locations).map((login) =>
                            <li key={login}>{login} - {state.locations[login]}</li>,
                        )}
                    </ul>
                    <Map locations={state.locations} />
                </main>
            );
        case "error":
            return <main>Failed to connect: {state.error}</main>;
        case "loading":
            return <main>Loading...</main>;
    }
};

export default LoggedInIndex;
