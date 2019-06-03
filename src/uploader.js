import React from "react";
import axios from "./axios";
// import ProfilePic from "./profilePic";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.uploadFile = this.uploadFile.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showFilename = this.showFilename.bind(this);
    }
    uploadFile(e) {
        e.preventDefault();

        var file = document.getElementById("file");
        // console.log("file:", file);
        var uploadedFile = file.files[0];
        // console.log("uploadedfile:", uploadedFile);

        var formData = new FormData();
        formData.append("uploadedFile", uploadedFile);

        axios
            .post("/profilePic/upload", formData)
            .then(response => {
                console.log("response: ", response);
                this.props.changePictureUrl(response.data.imageurl);
            })
            .catch(error => {
                console.log("error in uploader: ", error);
            });
    }

    closeModal(e) {
        if (e.target == document.getElementById("uploader")) {
            this.props.hideUploader();
        } else {
            return;
        }
    }
    showFilename() {
        console.log(
            "showfilename!!!!",
            document.getElementById("file").files[0].name
        );
        this.setState({
            filename: document.getElementById("file").files[0].name
        });
    }
    render() {
        return (
            <div>
                <div id="uploader">
                    <h3 className="textUploader">
                        Change your profile picture
                    </h3>
                    <label id="uploadForm">
                        <input
                            name="file-upload"
                            id="file"
                            type="file"
                            onChange={this.showFilename}
                        />
                    </label>
                    <br />
                    <br />
                    <button className="uploadButtons" onClick={this.uploadFile}>
                        Upload
                    </button>
                    <button
                        className="uploadButtons"
                        onClick={this.props.hideUploader}
                    >
                        Close
                    </button>
                </div>
                <div id="uploaderBG" onClick={this.props.hideUploader} />
            </div>
        );
    }
}
