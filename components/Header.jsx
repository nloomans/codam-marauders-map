import React from "react";
import Link from "next/link";

const Header = ({ login }) => (
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

            .profile {
                display: flex;
            }

            .username, .logout {
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

            // change username to logout link on hover
            .logout {
                display: none;
                color: white;
                text-decoration: underline;
            }

            .profile:hover .logout {
                display: block;
            }

            .profile:hover .username {
                display: none;
            }
        `}</style>
        <h1>Marauder's Map for Codam</h1>
        <div className="grow" />
        <div className="profile">
            <div className="username">{login}</div>
            <Link href="/auth/logout"><a className="logout">logout</a></Link>
            <div className="profile-picture" style={{
                backgroundImage: `url(https://cdn.intra.42.fr/users/small_${login}.jpg)`,
            }} />
        </div>
    </header>
);

export default Header;
