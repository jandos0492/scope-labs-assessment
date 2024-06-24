import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import "./AddCommentModal.css";

const AddCommentModal = ({ isOpen, onClose, addNewComment, videoId }) => {
    const [commentContent, setCommentContent] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setCommentContent("");
            setUserId("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!commentContent || !userId) {
            alert("All fields are required to add the comment.");
            return;
        }

        try {
            const newCommentRes = await fetch("/api/videos/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ video_id: videoId, user_id: userId, content: commentContent })
            });

            if (newCommentRes.ok) {
                const newCommentResult = await newCommentRes.json();
                addNewComment(newCommentResult);
            } else {
                const errorResponse = await newCommentRes.json();
                console.error("Failed to add new comment.", errorResponse);
            }
        } catch (error) {
            console.error("Error fetching add new comment.", error);
        }

        setCommentContent("");
        setUserId("");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-header">Add comment</h2>
                <form onSubmit={handleAddComment}>
                    <div className="input-group">
                        <div className="input-container">
                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="User_id ex: john_smith"
                                className="input-with-icon"
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="input-container">
                            <FontAwesomeIcon icon={faSquarePlus} className="input-icon" />
                            <textarea
                                type="text"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Comment content"
                                className="input-with-icon"
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="modal-buttons">
                        <button className="cancel-button" type="button" onClick={onClose}>Cancel</button>
                        <button className="upload-button" type="submit">Comment</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default AddCommentModal;