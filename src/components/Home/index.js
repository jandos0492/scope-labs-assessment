import React, { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import logo from "../../assets/FULL_LOGO_DARK.png";
import Videos from "../Videos";
import UploadModal from "../UploadModal";
import "./Home.css";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [videoData, setVideoData] = useState([]);
    const [filteredVideoData, setFilteredVideoData] = useState([]);
    const [searchVideo, setSearchVideo] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // fetching the video data for user jandos_arinovv on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoDataRes = await fetch("https://take-home-assessment-423502.uc.r.appspot.com/api/videos?user_id=jandos_arinovv");
                const videoDataResult = await videoDataRes.json();
                setVideoData(videoDataResult.videos);
                setFilteredVideoData(videoDataResult.videos);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching the video data.", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Updating the filteredVideoData based on searchVideo input.
    useEffect(() => {
        if (searchVideo === "") {
            setFilteredVideoData(videoData);
        } else {
            const filteredData = videoData.filter(video =>
                video.title.toLowerCase().includes(searchVideo.toLowerCase())
            );
            setFilteredVideoData(filteredData);
        }
    }, [searchVideo, videoData]);

    // logic to add new video to both videoData and filteredVideoData.
    const addNewVideo = (newVideo) => {
        setVideoData((prevVideoData) => [newVideo, ...prevVideoData]);
        setFilteredVideoData((prevVideoData) => [newVideo, ...prevVideoData]);
    };

    // Shows the loading infinity spin while the data fetches from Rest API
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
                <input
                    type="text"
                    placeholder="Search videos"
                    value={searchVideo}
                    onChange={(e) => setSearchVideo(e.target.value)}
                    className="search-videos"
                />
                <img className="logo" src={logo} alt="Logo" />
                <button className="modal-button" onClick={() => setIsModalOpen(true)}>Upload</button>
            </header>
            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} addNewVideo={addNewVideo} />
            <div className="video-grid">
                {filteredVideoData.length > 0 ? (
                    filteredVideoData.map((video, index) => (
                        <Videos
                            key={index}
                            video={video}
                        />
                    ))
                ) : (
                    searchVideo !== "" && (
                        <div className="no-videos">
                            <p>No videos found</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default Home;