import { useEffect, useState, FunctionComponent } from 'react'
import makeIo from 'socket.io-client';
import Map from '../components/Map';
import { Locations } from '../types';

type Props = {
    login?: string,
};

type LocationsState
    = LocationsSuccessfulState
    | LocationsErrorState
    | LocationsLoadingState;

type LocationsSuccessfulState = {
    type: 'successful';
    locations: Locations;
}

type LocationsErrorState = {
    type: 'error';
    error: string;
}

type LocationsLoadingState = {
    type: 'loading';
}

const useLocations = (): LocationsState => {
    const [state, setState] = useState<LocationsState>({ type: 'loading' });

    useEffect(() => {
        const socket = makeIo();

        socket.on('locations', (locations: Locations) => {
            setState({ type: 'successful', locations });
        });

        function onError(error: string) {
            setState({ type: 'error', error });
        }

        socket.on('connect_error', onError);
        socket.on('error', onError);

        return () => {
            socket.close();
        };
    }, []);

    return state;
};

const LoggedInIndex: FunctionComponent<Props> = () => {
    const state = useLocations();

    switch (state.type)
    {
        case 'successful':
            return (
                <main>
                    <ul>
                        {Object.keys(state.locations).map((login) =>
                            <li key={login}>{login} - {state.locations[login]}</li>
                        )}
                    </ul>
                    <Map locations={state.locations} />
                </main>
            );
        case 'error':
            return <main>Failed to connect: {state.error}</main>
        case 'loading':
            return <main>Loading...</main>
    }
};

export default LoggedInIndex
