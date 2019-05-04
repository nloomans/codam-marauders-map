import { FunctionComponent } from "react";

interface IProps {
    login: string;
}

const Header: FunctionComponent<IProps> = ({ login }) => (
    <header>
        <style jsx>{`
            header {
                width: 100vw;
                display: flex;
                box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 4px 0px;
            }

            h1 {
                font-size: 16px;
                margin: 16px;
            }

            .grow {
                flex-grow: 1;
            }

            .login {
                font-size: 16px;
                margin: 16px;
            }

            .profile-picture {
                width: 32px;
                height: 32px;
                flex-shrink: 0;
                margin-top: 11px;
                margin-bottom: 11px;
                margin-left: 0;
                margin-right: 16px;
                border-radius: 50%;
                background-size: cover;
            }
        `}</style>
        <h1>Marauder's Map for Codam</h1>
        <div className="grow" />
        <div className="login">{login}</div>
        <div className="profile-picture"  style={{
            backgroundImage: `url(https://cdn.intra.42.fr/users/small_${login}.jpg)`,
        }} />
    </header>
);

export default Header;
