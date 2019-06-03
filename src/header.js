import React from "react";
import ProfilePic from "./profilePic";

export default function Header(props) {
    return (
        <div id="headerContainer">
            <div id="header">
                <img id="logo" src="/logo.png" onClick={props.showUploader} />
                <p id="welcomeP">Welcome to Bookwormer, {props.first}!</p>
                <div id="nav">
                    <a className="navButtons" href="/">
                        Profile
                    </a>
                    <a className="navButtons" href="/friends">
                        Friends
                    </a>
                    <a className="navButtons" href="/onlineusers">
                        Who is online
                    </a>
                    <a className="navButtons" href="/chatmessages">
                        Chat
                    </a>
                    <a className="navButtons" href="/logout">
                        Log Out
                    </a>
                </div>
                <ProfilePic
                    imageurl={props.imageurl}
                    showUploader={props.showUploader}
                />
            </div>
        </div>
    );
}
