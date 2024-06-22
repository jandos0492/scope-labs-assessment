import React from "react";
import ReactPlayer from "react-player";
import "./VideoComponent.css";

const VideoComponent = ({ video }) => {
    const { title, video_url, description } = video;

    return (
        <div className="video-card">
            <ReactPlayer
                url={video_url}
                controls
                width="100%"
                height="300px"
            />
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export default VideoComponent;