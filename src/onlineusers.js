import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FriendButton from "./friendButton";

class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (!this.props.onlineUsers) {
            return null;
        }
        return (
            <div className="onlineUsersList">
                {this.props.onlineUsers.length > 0 && (
                    <h2 className="onlineTitle">Those people are online:</h2>
                )}
                {this.props.onlineUsers.length == 0 && (
                    <h2 className="onlineTitle">No body Online</h2>
                )}
                {this.props.onlineUsers && (
                    <div className="onlineUserContainer">
                        {this.props.onlineUsers &&
                            this.props.onlineUsers.map(i => {
                                return (
                                    <div key={i.id} className="onlineUserItem">
                                        {
                                            <Link
                                                to={`/user/${i.id}`}
                                                key={i.id}
                                            >
                                                <div id="userPicture">
                                                    <img
                                                        className="userImag"
                                                        src={i.imageurl}
                                                    />
                                                </div>
                                            </Link>
                                        }
                                        <div className="userName" />
                                        <h4>
                                            {i.first} {i.last}
                                        </h4>

                                        <FriendButton
                                            otherUserId={i.id}
                                            first={i.first}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    console.log("onliiiine", state);
    if (!state.onlineUsers) {
        return {};
    } else {
        return {
            onlineUsers: state.onlineUsers
        };
    }
};

export default connect(mapStateToProps)(OnlineUsers);
