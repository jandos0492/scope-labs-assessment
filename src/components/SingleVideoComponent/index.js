import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { InfinitySpin } from "react-loader-spinner";
import UploadModal from "../UploadModal";
import EditVideoModal from "../EditVideoModal";
import Comments from "../Comments";
import VideoMetaInfo from "../VideoMetaInfo";
import ReactPlayer from "react-player";
import logo from "../../assets/FULL_LOGO_DARK.png";
import "./SingleVideoComponent.css";
import SingleVideoComments from "../SingleVideoComments";

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
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { id } = useParams();

    window.scrollTo({ top: 0, behavior: 'smooth' });

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
                const response = await fetch("/api/videos?user_id=jandos_arinovv");
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

    const isYouTubeUrl = (url) => {
        const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
        return isYouTube;
    };

    const addNewVideo = (newVideo) => {
        setRestVideos((prevVideos) => [newVideo, ...prevVideos]);
    };

    const updateVideoDetails = (updatedVideo) => {
        setTitle(updatedVideo.title);
        setDescription(updatedVideo.description);
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
                <Link to="/" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <Link to="/">
                    <img className="logo" src={logo} alt="Logo" />
                </Link>
                <button className="modal-button" onClick={() => setIsUploadModalOpen(true)}>Upload</button>
            </header>
            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} addNewVideo={addNewVideo} />
            <EditVideoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                videoId={id}
                currentTitle={title}
                currentDescription={description}
                updateVideoDetails={updateVideoDetails}
            />
            <div className="single-video-page">
                <div className="main-video">
                    <ReactPlayer
                        url={videoUrl}
                        width="100%"
                        height="450px"
                        controls
                    />
                    <div className="title-edit-container">
                        <h2 className="video-title">{title}</h2>
                        <button className="edit-button" onClick={() => setIsEditModalOpen(true)}>Edit video</button>
                    </div>
                    <p className="video-description">{description}</p>
                    <VideoMetaInfo videoId={id} userId={userId} createdAt={createdAt} />
                    <SingleVideoComments videoId={id} />
                </div>
                <div className="rest-videos">
                    {restVideos.length > 0 && (
                        restVideos.map((video, index) => (
                            <Link className="single-video-link" key={video.id} to={`/${video.id}`}>
                                <div className="rest-video-item">
                                    <div className="video-wrapper">
                                        <ReactPlayer
                                            ref={(element) => { playerRefs.current[index] = element; }}
                                            url={video.video_url}
                                            width="100%"
                                            height="200px"
                                            onReady={() => handleReady(index)}
                                            light={isYouTubeUrl(video.video_url)}
                                            controls={false}
                                        />
                                        <div className="video-overlay"></div>
                                    </div>
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
