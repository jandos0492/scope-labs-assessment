import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import "./SingleVideoComments.css";
import AddCommentModal from "../AddCommentModal";
import SingleVideoCommentsList from "../SingleVideoCommentsList";

const SingleVideoComments = ({ videoId }) => {

    const [commentsData, setCommentsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetching the commentsData based on the video_id.
    useEffect(() => {
        const fetchCommentsData = async () => {
            try {
                const commentsDataRes = await fetch(`/api/videos/comments?video_id=${videoId}`);
                const commentsDataResult = await commentsDataRes.json();
                setCommentsData(commentsDataResult.comments);
            } catch (error) {
                console.error("Error fetching the Comments data.", error);
            }
        }
        fetchCommentsData();
    }, [videoId]);

    // Adding new comment to the beginning of comments data
    const addNewComment = (newComment) => {
        setCommentsData((prevCommentsData) => [newComment, ...prevCommentsData]);
    };

    return (
        <div className="single-video-comments-container">
            {commentsData.length > 0 && (
                <p className="single-video-comments-qty">
                    Comments
                    <FontAwesomeIcon className="dot-icon" icon={faCircle} />
                    {commentsData.length}
                </p>
            )}
            <button className="add-comment-button" onClick={() => setIsModalOpen(true)}>Add Comment</button>
            <AddCommentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} addNewComment={addNewComment} videoId={videoId} />
            <SingleVideoCommentsList commentsData={commentsData} />
        </div>
    )
};

export default SingleVideoComments;