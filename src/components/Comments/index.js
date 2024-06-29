import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircle, faComment } from "@fortawesome/free-solid-svg-icons";

const Comments = ({ videoId }) => {
    const [commentsData, setCommentsData] = useState([]);
    const [commentsQty, setCommentsQty] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentsDataRes = await fetch(`/api/videos/comments?video_id=${videoId}`);
                const commentsDataResult = await commentsDataRes.json();
                if (commentsDataResult && commentsDataResult.comments) {
                    setCommentsData(commentsDataResult.comments);
                    setCommentsQty(commentsDataResult.comments.length);
                }
            } catch (err) {
                console.error("Error fetching the comments data.", err);
            }
        };
        fetchData();
    }, [videoId]);

    const latestComment = commentsData[0]

    const getLatestCommentDate = () => {
        if (!latestComment) return null;
        const commentDate = new Date(latestComment.created_at);
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
            return commentDate.toDateString();
        }
    };

    return (
        <div className="comments-section">
            {latestComment && (
                <>
                    <p>
                        <FontAwesomeIcon className="user-icon" icon={faUser} />
                        {latestComment.user_id}
                        <FontAwesomeIcon className="dot-icon" icon={faCircle} />
                        {getLatestCommentDate()}
                    </p>
                    <div className="comments-qty">
                        <p><FontAwesomeIcon className="comment-icon" icon={faComment} /> {commentsQty} Comments</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Comments;