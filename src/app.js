import React from "react";
import axios from "./axios";
import Header from "./header";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherUser from "./otherUser";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Friends from "./friends";
import OnlineUsers from "./onlineusers";
import ChatMessages from "./chatmessages";
import Map from "./map";

export default class App extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            uploaderVisible: false,
            bioEditorVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.changePictureUrl = this.changePictureUrl.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.hideBioEditor = this.hideBioEditor.bind(this);
        this.showBioEditor = this.showBioEditor.bind(this);
        this.updateProfileBio = this.updateProfileBio.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(results => {
                this.setState({
                    first: results.data.rows[0].first,
                    last: results.data.rows[0].last,
                    imageurl: results.data.rows[0].imageurl,
                    bio: results.data.rows[0].bio
                });
            })
            .catch(err => {
                console.log("error in mount app: ", err);
            });
    }
    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }

    changePictureUrl(url) {
        console.log(
            "(changePictureUrl) imageurl : ",
            this.state.imageurl,
            "url : ",
            url
        );
        this.setState({
            imageurl: url,
            uploaderIsVisible: false
        });
    }

    ///////////////////BioEditor

    hideBioEditor() {
        this.setState({
            bioEditorVisible: false
        });
    }
    showBioEditor() {
        this.setState({
            bioEditorVisible: true
        });
    }

    updateProfileBio(bio) {
        console.log("updateBio running!");
        this.setState({
            bio: bio
        });
    }

    render() {
        return (
            <div>
                <Header
                    first={this.state.first}
                    last={this.state.last}
                    imageurl={this.state.imageurl}
                    showUploader={this.showUploader}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        imageurl={this.state.imageurl}
                        changePictureUrl={this.changePictureUrl}
                        showUploader={this.showUploader}
                        hideUploader={this.hideUploader}
                    />
                )}
                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageurl={this.state.imageurl}
                                    showUploader={this.showUploader}
                                    hideUploader={this.hideUploader}
                                    bio={this.state.bio}
                                    showBioEditor={this.showBioEditor}
                                    hideBioEditor={this.hideBioEditor}
                                    bioEditorVisible={
                                        this.state.bioEditorVisible
                                    }
                                    updateProfileBio={this.updateProfileBio}
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherUser
                                    first={this.state.first}
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/friends" component={Friends} />
                        <Route path="/onlineusers" component={OnlineUsers} />
                        <Route path="/chatmessages" component={ChatMessages} />
                        <Route path="/map" component={Map} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

//
