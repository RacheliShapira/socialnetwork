import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioDraft: this.props.bio
        };

        this.editBio = this.editBio.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ bioDraft: e.target.value });
    }

    editBio() {
        var self = this;
        this.props.hideBioEditor();

        axios
            .post("updatebioo", { bioDraft: self.state.bioDraft })
            .then(results => {
                self.props.updateProfileBio(results.data);
            })
            .catch(err => {
                console.log(" error while updating bio: ", err);
                console.log("data in bioDraft", this.state.bioDraft);
            });
    }

    cancelEdit() {
        this.props.hideBioEditor();
    }

    render() {
        return (
            <div>
                <textarea
                    id="bioEditor"
                    value={this.state.bioDraft}
                    onChange={this.handleChange}
                />
                <button id="submitBio" onClick={this.editBio}>
                    Submit
                </button>
                <button id="cancelBio" onClick={this.cancelEdit}>
                    Cancel edit
                </button>
            </div>
        );
    }
}
