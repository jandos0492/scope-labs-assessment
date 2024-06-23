import React, { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import logo from "../../assets/FULL_LOGO_DARK.png";
import Videos from "../Videos";
import Comments from "../Comments";
import UploadModal from "../UploadModal";
import "./Home.css";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [videoData, setVideoData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoDataRes = await fetch("/api/videos?user_id=zhandos_aarinov");
                const videoDataResult = await videoDataRes.json();
                setVideoData(videoDataResult.videos);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching the video data.", err);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const addNewVideo = (newVideo) => {
        setVideoData((prevVideoData) => [newVideo, ...prevVideoData])
    }

    if (loading) {
        return (
            <div className="loading">
                <InfinitySpin width="200" color="black" />
            </div>
        );
    }

    return (
        <div className="home-container">
            <header className="header">
                <img className="logo" src={logo} alt="Logo" />
                <button className="upload-button modal-button" onClick={() => setIsModalOpen(true)}>Upload</button>
            </header>
            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} addNewVideo={addNewVideo} />
            <div className="video-grid">
                {videoData.length > 0 && (
                    videoData.map((video, index) => (
                        <Videos
                            key={index}
                            video={video}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;