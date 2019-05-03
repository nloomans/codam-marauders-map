import { FunctionComponent } from "react";

const SmallPage: FunctionComponent = ({ children }) => (
    <div className="SmallPage">
        <style jsx>{`
            .SmallPage {
                text-align: center;
                width: 100vw;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `}</style>
        <div className="centered">
            <h1>Marauder's Map for Codam</h1>
            {children}
        </div>
    </div>
);

export default SmallPage;
