import { FunctionComponent } from "react";
import * as map from "../resources/map";
import { ILocations } from "../types";

interface IProps {
    locations: ILocations;
}

const View: FunctionComponent<IProps> = ({ locations }) => (
    <div style={{ position: "relative" }}>
        <img src={map.svg} />
        {Object.keys(locations).map((login) => {
            const locationIdentifier = locations[login];
            if (map.positions[locationIdentifier] == null) {
                console.warn(`user ${login} at ${locationIdentifier} has no position`);
                return undefined;
            }
            const { top, left } = map.positions[locationIdentifier];

            return <a
                key={login}
                href={`https://profile.intra.42.fr/users/${login}`}
                style={{
                    backgroundImage: `url(https://cdn.intra.42.fr/users/medium_${login}.jpg)`,
                    backgroundSize: "cover",
                    borderRadius: "50%",
                    height: "48px",
                    left: `${left}px`,
                    position: "absolute",
                    top: `${top}px`,
                    width: "48px",
                }} />;
        })}
    </div>
);

export default View;
