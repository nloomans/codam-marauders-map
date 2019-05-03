import { FunctionComponent } from "react";
import { Locations } from "../types";
import * as map from "../resources/map"

type Props = {
    locations: Locations;
}

const View: FunctionComponent<Props> = ({ locations }) => (
    <div style={{ position: 'relative' }}>
        <img src={map.svg} />
        {Object.keys(locations).map((login) => {
            const locationIdentifier = locations[login];
            if (map.positions[locationIdentifier] == undefined) {
                console.warn(`user ${login} at ${locationIdentifier} has no position`);
                return undefined;
            }
            const { top, left } = map.positions[locationIdentifier];

            return <a
                key={login}
                href={`https://profile.intra.42.fr/users/${login}`}
                style={{
                    position: 'absolute',
                    borderRadius: '50%',
                    top: `${top}px`,
                    left: `${left}px`,
                    width: '48px',
                    height: '48px',
                    backgroundImage: `url(https://cdn.intra.42.fr/users/medium_${login}.jpg)`,
                    backgroundSize: 'cover'
                }} />;
        })}
    </div>
);

export default View;
