import { NextFunctionComponent } from 'next';
import makeIo from 'socket.io-client';
import { useEffect, useState } from 'react';
import View from '../components/View';
import { Locations } from '../types';

type Props = {
    login?: string,
};

const useLocations = () => {
    const [locations, setLocations] =
        useState<Locations | undefined>(undefined);

    useEffect(() => {
        const socket = makeIo();

        socket.on('locations', (locations: Locations) => {
            setLocations(locations);
        })

        return () => {
            socket.close();
        };
    }, []);

    return locations;
};

const Index: NextFunctionComponent<Props> = () => {
    const locations = useLocations();

    if (locations == undefined) {
        return <main>Loading...</main>
    }

    console.log(locations);

    return (
        <main>
            <ul>
                {Object.keys(locations).map((login) =>
                    <li key={login}>{login} - {locations[login]}</li>
                )}
            </ul>
            <View locations={locations} />
        </main>
    )
};

export default Index
