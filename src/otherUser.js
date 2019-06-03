import React from "react";
import axios from "./axios";
import FriendButton from "./friendButton";

export default class OtherUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidOtherUserId: false
        };
    }
    componentDidMount() {
        var self = this;

        console.log(
            "self.props.match.params.idsfsdfdsfs ",
            self.props.match.params.id
        );
        axios
            .get("/user/" + this.props.match.params.id + ".json")
            .then(results => {
                if (results.data.redirectTo) {
                    self.props.history.push(results.data.redirectTo);
                }
                if (results.data.rows.length == 0) {
                    self.setState({
                        invalidOtherUserId: true
                    });
                } else {
                    self.setState({
                        id: results.data.rows[0].id,
                        first: results.data.rows[0].first,
                        last: results.data.rows[0].last,
                        imageurl: results.data.rows[0].imageurl,
                        bio: results.data.rows[0].bio
                    });
                }
            })
            .catch(err => {
                console.log("error in OtherUser- mount : ", err);
            });
        console.log(
            "this.props.match.params.id : ",
            this.props.match.params.id
        );
    }

    render() {
        return (
            <div id="otherUserContainer">
                <img id="proPicOtherUser" src={this.state.imageurl} />
                <div id="otherUserProfileInfo">
                    <h1>
                        {this.state.first} {this.state.last}
                    </h1>
                    <h3>{this.state.bio}</h3>
                </div>
                <div id="RuFriends">
                    <FriendButton
                        otherUserId={this.props.match.params.id}
                        first={this.state.first}
                    />
                </div>
            </div>
        );
    }
}
