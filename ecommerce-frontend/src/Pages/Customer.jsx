import React, { useEffect, useState } from 'react';
import axios from 'axios'; // "react-each" hatası düzeltildi
import { FaPlayCircle, FaTimes } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [theme, setTheme] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const BASE_URL = "https://localhost:7137";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vRes, tRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/Videos`),
                    axios.get(`${BASE_URL}/api/Theme`)
                ]);
                
                // KESİN FİLTRE: Sadece 'Satisfaction' olanları göster
                const filtered = (vRes.data || []).filter(v => v.category === 'Satisfaction');
                setCustomers(filtered);
                setTheme(tRes.data);
            } catch (err) { 
                console.error("Müşteri videoları yükleme hatası:", err); 
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    const getYoutubeId = (url) => {
        if (!url) return null;
        const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (!theme) return null;

    return (
        <div className="bg-white min-vh-100 d-flex flex-column text-start">
            <Navbar theme={theme} />
            <main style={{ paddingTop: '140px' }} className="container flex-grow-1 pb-5">
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-5 text-dark text-uppercase">MÜŞTERI MEMNUNIYETI</h1>
                    <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>{theme.satisfactionText}</p>
                    <div style={{ width: '60px', height: '4px', backgroundColor: '#aec90b' }} className="mx-auto mt-3"></div>
                </div>

                <div className="row g-4 justify-content-center">
                    {customers.length === 0 ? (
                        <p className="text-muted text-center">Henüz müşteri videosu bulunmamaktadır.</p>
                    ) : (
                        customers.map((c) => (
                            <div key={c.id} className="col-lg-4 col-md-6 text-center">
                                <div className="video-card rounded-4 shadow-sm border overflow-hidden" style={{ cursor: 'pointer' }} onClick={() => setSelectedVideo(c)}>
                                    <div className="position-relative">
                                        <img src={`https://img.youtube.com/vi/${getYoutubeId(c.youtubeUrl)}/maxresdefault.jpg`} className="w-100" style={{ height: '220px', objectFit: 'cover' }} alt={c.title} />
                                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25">
                                            <FaPlayCircle size={50} className="text-white opacity-75" />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-light"><h6 className="fw-bold mb-0 text-dark">{c.title}</h6></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {selectedVideo && (
                <div className="video-lightbox-overlay" onClick={() => setSelectedVideo(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="w-100 position-relative" style={{ maxWidth: '900px' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedVideo(null)} className="btn text-white position-absolute" style={{ top: '-40px', right: 0 }}><FaTimes size={24}/></button>
                        <div className="ratio ratio-16x9 rounded-4 overflow-hidden bg-black shadow-lg">
                            <iframe src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.youtubeUrl)}?autoplay=1`} allowFullScreen title="customer-video"></iframe>
                        </div>
                    </div>
                </div>
            )}
            <Footer theme={theme} />
        </div>
    );
};
export default Customer;