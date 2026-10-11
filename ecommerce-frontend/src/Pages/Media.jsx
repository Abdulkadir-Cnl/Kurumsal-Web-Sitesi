import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Media = () => {
    const [theme, setTheme] = useState(null);
    const navigate = useNavigate();
    const BASE_URL = "https://localhost:7137";

    useEffect(() => {
        axios.get(`${BASE_URL}/api/Theme`).then(res => setTheme(res.data));
    }, []);

    if (!theme) return null;

    return (
        <div className="bg-white min-vh-100 d-flex flex-column text-start">
            <Navbar theme={theme} />
            <main style={{ paddingTop: '140px' }} className="container flex-grow-1 pb-5 text-center">
                <div className="d-flex flex-column align-items-center mb-5">
                    <div style={{ width: '2px', height: '60px', backgroundColor: '#c5a059' }} className="mb-3"></div>
                    <h1 className="fw-bold text-dark text-uppercase display-5" style={{ letterSpacing: '3px' }}>MEDYA</h1>
                </div>

                <div className="row g-4 justify-content-center">
                    <div className="col-md-5">
                        <div className="media-card-container" onClick={() => navigate('/galeri')}>
                            <img src={theme.mediaGalleryImage ? `${BASE_URL}${theme.mediaGalleryImage}` : "/default-gallery.jpg"} className="media-bg-img" alt="Galeri" />
                            <div className="media-card-overlay"><h2 className="text-white fw-bold">GALERİ</h2></div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        {/* DÜZELTİLEN KISIM: Burası artık /video rotasına gidiyor */}
                        <div className="media-card-container" onClick={() => navigate('/video')}>
                            <img src={theme.mediaVideoImage ? `${BASE_URL}${theme.mediaVideoImage}` : "/default-video.jpg"} className="media-bg-img" alt="Video" />
                            <div className="media-card-overlay"><h2 className="text-white fw-bold">VİDEO</h2></div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer theme={theme} />
            <style>{`
                .media-card-container { position: relative; height: 400px; border-radius: 15px; overflow: hidden; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: 0.4s; }
                .media-card-container:hover { transform: translateY(-10px); }
                .media-bg-img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
                .media-card-container:hover .media-bg-img { transform: scale(1.1); }
                .media-card-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(26, 43, 76, 0.5); display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .media-card-overlay h2 { letter-spacing: 5px; border-bottom: 3px solid #c5a059; padding-bottom: 10px; }
            `}</style>
        </div>
    );
};
export default Media;