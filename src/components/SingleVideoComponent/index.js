import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import UploadModal from "../UploadModal";
import Comments from "../Comments";
import VideoMetaInfo from "../VideoMetaInfo";
import ReactPlayer from "react-player";
import logo from "../../assets/FULL_LOGO_DARK.png";
import "./SingleVideoComponent.css";

const SingleVideoComponent = () => {
    const playerRef = useRef(null);
    const playerRefs = useRef([]);
    const [isReady, setIsReady] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [restVideos, setRestVideos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        const fetchSingleVideoData = async () => {
            try {
                const response = await fetch(`/api/videos/single?video_id=${id}`);
                const result = await response.json();
                const { video } = result;

                setVideoUrl(video.video_url);
                setTitle(video.title);
                setDescription(video.description);
                setCreatedAt(video.created_at);
                setUserId(video.user_id);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the single video data.", error);
                setLoading(false);
            }
        };

        fetchSingleVideoData();
    }, [id]);

    useEffect(() => {
        const fetchAllVideos = async () => {
            try {
                const response = await fetch("/api/videos?user_id=zhandos_arinovv");
                const result = await response.json();
                const filteredVideos = result.videos.filter(video => video.id !== id);
                setRestVideos(filteredVideos);
            } catch (error) {
                console.error("Error fetching the Videos list data.", error);
            }
        };

        fetchAllVideos();
    }, [id]);

    useEffect(() => {
        if (isReady && playerRef.current) {
            const timeToStart = 7.5;
            playerRef.current.seekTo(timeToStart, 'seconds');
        }
    }, [isReady]);

    const handleReady = (index) => {
        setIsReady(true);
        const timeToStart = 7.5;
        if (playerRefs.current[index]) {
            playerRefs.current[index].seekTo(timeToStart, 'seconds');
        }
    };

    const addNewVideo = (newVideo) => {
        setRestVideos((prevVideos) => [newVideo, ...prevVideos]);
    };

    if (loading) {
        return (
            <div className="loading">
                <InfinitySpin width="200" color="black" />
            </div>
        );
    }

    return (
        <div className="single-video-container">
            <header className="header">
                <Link to="/">
                    <img className="logo" src={logo} alt="Logo" />
                </Link>
                <button className="modal-button" onClick={() => setIsModalOpen(true)}>Upload</button>
            </header>
            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} addNewVideo={addNewVideo} />
            <div className="single-video-page">
                <div className="main-video">
                    <ReactPlayer
                        url={videoUrl}
                        width="100%"
                        height="450px"
                        controls
                    />
                    <h2>{title}</h2>
                    <p className="video-description">{description}</p>
                    <VideoMetaInfo videoId={id} userId={userId} createdAt={createdAt} />
                </div>
                <div className="rest-videos">
                    {restVideos.length > 0 && (
                        restVideos.map((video, index) => (
                            <Link className="single-video-link" key={video.id} to={`/${video.id}`}>
                                <div className="rest-video-item">
                                    <ReactPlayer
                                        ref={(element) => { playerRefs.current[index] = element; }}
                                        url={video.video_url}
                                        width="100%"
                                        height="200px"
                                        onReady={() => handleReady(index)}
                                    />
                                    <div className="rest-video-text-content">
                                        <p className="rest-videos-title">{video.title}</p>
                                        <Comments videoId={video.id} />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleVideoComponent;