import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faComment } from "@fortawesome/free-solid-svg-icons";
import "./VideoMetaInfo.css";

const VideoMetaInfo = ({ videoId, userId, createdAt }) => {
    const [commentsQty, setCommentsQty] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentsDataRes = await fetch(`/api/videos/comments?video_id=${videoId}`);
                const commentsDataResult = await commentsDataRes.json();
                if (commentsDataResult && commentsDataResult.comments) {
                    setCommentsQty(commentsDataResult.comments.length);
                }
            } catch (err) {
                console.error("Error fetching the comments data.", err);
            }
        };
        fetchData();
    }, [videoId]);

    const videoUploadedDate = new Date(createdAt);

    return (
        <div className="video-meta-info-container">
            <p>
                {userId}
                <FontAwesomeIcon className="dot-icon" icon={faCircle} />
                Uploaded
                {` ${videoUploadedDate.toDateString()}`}
            </p>
            {commentsQty > 0 && (
                <p><FontAwesomeIcon className="comment-icon" icon={faComment} /> {commentsQty} Comments</p>
            )}
        </div>
    )
}

export default VideoMetaInfo;