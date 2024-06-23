import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faT, faLink, faAudioDescription } from "@fortawesome/free-solid-svg-icons";
import "./UploadModal.css";

const UploadModal = ({ isOpen, onClose, addNewVideo }) => {
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !videoUrl || !description || !videoUrl) {
            console.error("All fields are required.");
            return;
        }

        try {
            const newVideoRes = await fetch("/api/videos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, video_url: videoUrl, description, user_id: "zhandos_arinovv"})
            });

            if (newVideoRes.ok) {
                const newVideoResult = await newVideoRes.json();
                addNewVideo(newVideoResult);
            } else {
                const errorResponse = await newVideoRes.json();
                console.error("Failed new video upload.", errorResponse);
            }
        } catch (error) {
            console.error("Error fetch a new video upload", error);
        }

        setTitle("");
        setVideoUrl("");
        setDescription("");
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
                    <div className="input-group">
                        <div className="input-container">
                            <FontAwesomeIcon icon={faAudioDescription} id="url-icon" className="input-icon" />
                            <textarea
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Video description"
                                className="input-with-icon"
                                rows="3"
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