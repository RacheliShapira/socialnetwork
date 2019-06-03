import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.updateFriendship = this.updateFriendship.bind(this);
    }

    componentDidMount() {
        let self = this;
        axios
            .get("/friendshipStatus/" + self.props.otherUserId)
            .then(results => {
                //     console.log("sender_id: ", results.data.rows[0].sender_id);
                //     console.log(
                //         "recipient_id: ",
                //         results.data.rows[0].recipient_id
                //     );
                //     console.log("accept: ", results.data.rows[0].accepted);
                if (!results.data.rows[0]) {
                    this.setState({
                        buttonText: "Send Friend Request",
                        friendshipText: "not friends"
                    });
                } else {
                    if (results.data.rows[0].accepted == true) {
                        this.setState({
                            buttonText: "End Friendship",
                            friendshipText: "friends"
                        });
                    } else {
                        if (
                            self.props.otherUserId ==
                            results.data.rows[0].sender_id
                        ) {
                            this.setState({
                                buttonText: "Accept Friendship",
                                friendshipText: "still not friends"
                            });
                        } else if (
                            self.props.otherUserId ==
                            results.data.rows[0].recipient_id
                        ) {
                            this.setState({
                                buttonText: "Cancel Friendship Request",
                                friendshipText: "still not friends"
                            });
                        }
                    } //closes 2nd else
                } // closes 1'st else
            }); //closes axios.then
    } //closes componentDidMount

    updateFriendship() {
        let self = this;

        if (self.state.buttonText == "Send Friend Request") {
            axios.post("/sendFriendship/" + self.props.otherUserId);
            self.setState({
                buttonText: "Cancel Friend Request",
                friendshipText: "still not friends"
            });
        } else if (self.state.buttonText == "Accept Friendship") {
            axios.post("/acceptFriendship/" + self.props.otherUserId);
            self.setState({
                buttonText: "End Friendship",
                friendshipText: "friends"
            });
        } else if (
            self.state.buttonText == "Cancel Friendship Request" ||
            "End Friendship"
        ) {
            axios.post("/removeFriendship/" + self.props.otherUserId);
            self.setState({
                buttonText: "Send Friend Request",
                friendshipText: "not friends"
            });
        }
    }
    denyFriendship() {}

    render() {
        return (
            <div>
                <p>
                    You and <i>{this.props.first} </i>are{" "}
                    {this.state.friendshipText}{" "}
                </p>
                <button id="friendButton" onClick={this.updateFriendship}>
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
}
