import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { initSocket } from "./socket";

class ChatMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textOfMessage: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentDidUpdate() {
        if (!this.elem) {
            return null;
        }

        this.elem.scrollTop = this.elem.scrollHeight;
    }
    componentDidMount() {
        if (!this.elem) {
            return null;
        }
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    handleChange(e) {
        this.setState({
            textOfMessage: e.target.value
        });
    }
    sendMessage(e) {
        console.log(" !this.state.textOfMessage", this.state.textOfMessage);
        initSocket().emit("chatMessageFromUserInput", this.state.textOfMessage);
        e.preventDefault();
        this.setState({
            textOfMessage: ""
        });
    }
    render() {
        if (!this.props.chatMessages) {
            return null;
        }
        return (
            <div id="chatMessagesBox">
                <div id="chatMessagesContainer">
                    {this.props.chatMessages.length == 0 && (
                        <p id="noMessagesP">
                            Be the first one to say something!
                        </p>
                    )}
                    {this.props.chatMessages && (
                        <div
                            id="messagesContainer"
                            ref={elem => (this.elem = elem)}
                        >
                            {this.props.chatMessages &&
                                this.props.chatMessages.map(msg => {
                                    return (
                                        <div
                                            key={msg.message_id}
                                            className="chatMessageItem"
                                        >
                                            <Link to={`/user/${msg.sender_id}`}>
                                                <img
                                                    className="chatImg"
                                                    src={msg.sender_url}
                                                />
                                            </Link>
                                            <div className="chatMessageItemInfo">
                                                <p>
                                                    <span className="messageSender">
                                                        {msg.sender_first}{" "}
                                                        {msg.sender_last}
                                                    </span>{" "}
                                                    <span className="messageDate">
                                                        on{" "}
                                                        {msg.message_created_at.slice(
                                                            0,
                                                            10
                                                        )}
                                                        ,{" "}
                                                        {msg.message_created_at.slice(
                                                            14,
                                                            19
                                                        )}
                                                    </span>
                                                </p>
                                                <p className="message-content">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                    <div id="chatMessageInput">
                        <textarea
                            id="textarea"
                            value={this.state.textOfMessage}
                            onChange={this.handleChange}
                            name="chat"
                            placeholder="Write a message here"
                        />
                        <br />
                        <button onClick={this.sendMessage}>Send Message</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    console.log("state.chatMessages", state.chatMessages);
    if (!state.chatMessages) {
        return {};
    } else {
        return {
            chatMessages: state.chatMessages
        };
    }
};

export default connect(mapStateToProps)(ChatMessages);
