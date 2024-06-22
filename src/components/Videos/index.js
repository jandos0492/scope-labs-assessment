import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { InfinitySpin } from "react-loader-spinner";
import "./Videos.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircle, faComment } from "@fortawesome/free-solid-svg-icons";

const Videos = ({ video }) => {
    const { title, video_url } = video;
    const playerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [commentsData, setCommentsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentsQty, setCommentsQty] = useState(0);

    useEffect(() => {
        if (isReady && playerRef.current) {
            const timeToStart = 7.5;
            playerRef.current.seekTo(timeToStart, 'seconds');
        }
    }, [isReady]);

    const handleReady = () => {
        setIsReady(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentsDataRes = await fetch(`/api/videos/comments?video_id=${video.id}`);
                const commentsDataResult = await commentsDataRes.json();
                if (commentsDataResult && commentsDataResult.comments) {
                    setCommentsData(commentsDataResult);
                    setCommentsQty(commentsDataResult.comments.length);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching the comments data.", err);
                setLoading(false);
            }
        }
        fetchData();
    }, [video.id]);

    const latestComment = commentsData.comments?.reduce((latest, comment) => {
        return new Date(comment.created_at) > new Date(latest.created_at) ? comment : latest;
    }, commentsData.comments?.[0] || null);

    const getLatestCommentDate = () => {
        if (!latestComment) return null;
        const commentDate = new Date(latestComment.created_at);
        const now = new Date();
        const diffInMilliseconds = now - commentDate;
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else {
            return commentDate.toDateString();
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <InfinitySpin width="200" color="black" />
            </div>
        );
    }

    return (
        <div className="video-card">
            <Link className="video-link" to={`/${video.id}`}>
                <ReactPlayer
                    ref={playerRef}
                    url={video_url}
                    width="100%"
                    height="300px"
                    onReady={handleReady}
                />
                <div className="video-text-content">
                    <h3 className="video-title">{title}</h3>
                    {latestComment && (
                        <>
                            <p>
                                <FontAwesomeIcon className="user-icon" icon={faUser} />
                                {latestComment.user_id}
                                <FontAwesomeIcon className="dot-icon" icon={faCircle} />
                                {getLatestCommentDate()}
                            </p>
                            <p><FontAwesomeIcon className="comment-icon" icon={faComment} /> {commentsQty} Comments</p>
                        </>
                    )}
                </div>
            </Link>
        </div>
    );
}

export default Videos;