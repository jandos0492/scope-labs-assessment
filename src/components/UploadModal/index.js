import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faT, faLink, faAudioDescription } from "@fortawesome/free-solid-svg-icons";
import "./UploadModal.css";

const UploadModal = ({ isOpen, onClose, addNewVideo }) => {
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    // Handling form submission to add a new video, sends a POST request to the API,
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !videoUrl || !description) {
            alert("All fields are required to add the video.");
            return;
        }

        try {
            const newVideoRes = await fetch("/api/videos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, video_url: videoUrl, description, user_id: "jandos_arinovv" })
            });

            if (newVideoRes.ok) {
                const refreshVideoListRes = await fetch("https://take-home-assessment-423502.uc.r.appspot.com/api/videos?user_id=jandos_arinovv");
                if (refreshVideoListRes.ok) {
                    const videoListData = await refreshVideoListRes.json();
                    const newVideo = videoListData.videos.find(
                        (video) => video.title === title && video.description === description
                    );

                    if (newVideo) {
                        addNewVideo(newVideo);
                        setTitle("");
                        setVideoUrl("");
                        setDescription("");
                        onClose();
                    } else {
                        console.error("Newly created video not found in the fetched list.");
                    }
                } else {
                    console.error("Failed to fetch the updated video list.");
                }
            } else {
                const errorResponse = await newVideoRes.json();
                console.error("Failed new video upload.", errorResponse);
            }
        } catch (error) {
            console.error("Error fetching a new video upload", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-header">Upload a video</h2>
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
                        <button className="cancel-button" type="button" onClick={(e) => { e.stopPropagation(); onClose(); }}>Cancel</button>
                        <button className="upload-button" type="submit" onClick={(e) => e.stopPropagation()}>Upload</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UploadModal;