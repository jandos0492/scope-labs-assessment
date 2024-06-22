import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { InfinitySpin } from "react-loader-spinner";
import "./Videos.css";
import { Link } from "react-router-dom";

const Videos = ({ video }) => {
    const { title, video_url } = video;
    const playerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [commentsData, setCommentsData] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setCommentsData(commentsDataResult);
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
    }, commentsData.comments ? commentsData.comments[0] : null);

    const getLatestCommentDate = (comment) => {
        const commentDate = new Date(comment.created_at);
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
                <h3>{title}</h3>
                {latestComment && (
                    <>
                        <p>Author: {latestComment.user_id}</p>
                        <p>Date: {getLatestCommentDate(latestComment)}</p>
                    </>
                )}
            </Link>
        </div>
    );
}

export default Videos;