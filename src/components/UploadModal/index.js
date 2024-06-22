import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faT, faLink } from "@fortawesome/free-solid-svg-icons";
import "./UploadModal.css";

const UploadModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Video Title:", title);
        console.log("Video URL", videoUrl);
        setTitle("");
        setVideoUrl("");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Upload a video</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <div className="input-container">
                            <FontAwesomeIcon icon={faT} className="input-icon" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title your video"
                                className="input-with-icon"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-container">
                            <FontAwesomeIcon icon={faLink} id="url-icon" className="input-icon" />
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://www.your-video-link.com"
                                className="input-with-icon"
                            />
                        </div>
                    </div>
                    <div className="modal-buttons">
                        <button className="cancel-button modal-button" type="button" onClick={onClose}>Cancel</button>
                        <button className="upload-button modal-button" type="submit" onClick={handleSubmit}>Upload</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UploadModal;