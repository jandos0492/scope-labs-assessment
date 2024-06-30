import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircle } from "@fortawesome/free-solid-svg-icons";
import "./SingleVideoCommentsList.css";

const SingleVideoCommentsList = ({ commentsData }) => {

    // Logic to convert a date string to relative time or a localized date string.
    const formatDate = (dateString) => {
        if (!dateString) {
            return "Date not available";
        }

        const commentDate = new Date(dateString);

        const now = new Date();
        const diffInMilliseconds = now - commentDate;
        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else {
            return commentDate.toLocaleDateString();
        }
    };

    return (
        <div className="comments-list">
            {commentsData.length > 0 && (
                commentsData.map((comment, index) => (
                    <div className="comment-info" key={index}>
                        <p>
                            <FontAwesomeIcon className="user-icon" icon={faUser} />
                            {comment.user_id}
                            <FontAwesomeIcon className="dot-icon" icon={faCircle} />
                            {formatDate(comment.created_at)}
                        </p>
                        <div className="comment-content">
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
};

export default SingleVideoCommentsList;