import React, { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import logo from "../../assets/FULL_LOGO_DARK.png";
import Videos from "../Videos";
import Comments from "../Comments";
import "./Home.css";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [videoData, setVideoData] = useState([]);

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
            </header>
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