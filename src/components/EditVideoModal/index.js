import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faT, faAudioDescription } from "@fortawesome/free-solid-svg-icons";

const EditVideoModal = ({ isOpen, onClose, videoId, currentTitle, currentDescription, updateVideoDetails }) => {
    const [title, setTitle] = useState(currentTitle);
    const [description, setDescription] = useState(currentDescription);

    // Sync title and description with current props when modal is opened
    useEffect(() => {
        if (isOpen) {
            setTitle(currentTitle);
            setDescription(currentDescription);
        }
    }, [isOpen, currentTitle, currentDescription]);

    if (!isOpen) return null;

    // Handling the submission of updated video details via a PUT request.
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://take-home-assessment-423502.uc.r.appspot.com/api/videos", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, video_id: videoId, description }),
            });

            if (response.ok) {
                const updatedVideo = {
                    id: videoId,
                    title,
                    description,
                };

                updateVideoDetails(updatedVideo);
                setTitle("");
                setDescription("");
                onClose();
            } else {
                console.error("Failed to update video.", await response.json());
            }
        } catch (error) {
            console.error("Error updating video.", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-header">Edit Video</h2>
                <form onSubmit={handleUpdate}>
                    <div className="input-group">
                        <div className="input-container">
                            <FontAwesomeIcon icon={faT} className="input-icon" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="input-with-icon"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-container">
                            <FontAwesomeIcon icon={faAudioDescription} className="input-icon" />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                className="input-with-icon"
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="modal-buttons">
                        <button className="cancel-button" type="button" onClick={(e) => { e.stopPropagation(); onClose(); }}>Cancel</button>
                        <button className="upload-button" type="submit" onClick={(e) => e.stopPropagation()}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVideoModal;