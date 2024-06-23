import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import Comments from "../Comments";
import "./Videos.css";

const Videos = ({ video }) => {
    const { title, video_url } = video;
    const playerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isReady && playerRef.current) {
            const timeToStart = 7.5;
            playerRef.current.seekTo(timeToStart, 'seconds');
        }
    }, [isReady]);

    const handleReady = () => {
        setIsReady(true);
    };

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
                    <Comments videoId={video.id} />
                </div>
            </Link>
        </div>
    );
};

export default Videos;