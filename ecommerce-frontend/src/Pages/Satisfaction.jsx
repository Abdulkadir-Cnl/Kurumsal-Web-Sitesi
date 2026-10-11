import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaTimes, FaPlayCircle } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Satisfaction = () => {
  const [videos, setVideos] = useState([]);
  const [theme, setTheme] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null); 
  const BASE_URL = "https://localhost:7137";

  useEffect(() => {
    // SADECE 'Satisfaction' kategorisindeki videoları çek ve filtrele
    axios.get(`${BASE_URL}/api/Videos`).then(res => {
      const filtered = (res.data || []).filter(v => v.category === 'Satisfaction');
      setVideos(filtered);
    });
    axios.get(`${BASE_URL}/api/Theme`).then(res => setTheme(res.data));
  }, []);

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnail = (url) => `https://img.youtube.com/vi/${getYoutubeId(url)}/hqdefault.jpg`;

  const nextVideo = () => setSelectedIdx((selectedIdx + 1) % videos.length);
  const prevVideo = () => setSelectedIdx((selectedIdx - 1 + videos.length) % videos.length);

  if (!theme) return null;

  return (
    <div className="bg-white min-vh-100 d-flex flex-column text-start">
      <Navbar theme={theme} />
      <main style={{ paddingTop: '120px' }} className="container pb-5 flex-grow-1">
        <h2 className="fw-bold text-center mb-5" style={{ color: '#aec90b' }}>Müşteri Memnuniyeti</h2>
        
        <div className="row g-4">
          {videos.length === 0 ? (
            <p className="text-muted text-center">Bu kategoride video bulunmamaktadır.</p>
          ) : (
            videos.map((v, index) => (
              <div key={v.id} className="col-md-6 col-lg-4 text-center">
                <div 
                  className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 video-card-hover" 
                  onClick={() => setSelectedIdx(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="position-relative">
                    <img src={getThumbnail(v.youtubeUrl)} className="w-100" style={{ height: '220px', objectFit: 'cover' }} alt={v.title} />
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <FaPlayCircle size={50} className="text-white opacity-75" />
                    </div>
                  </div>
                  <div className="card-body bg-white border-top">
                    <h6 className="mb-0 fw-bold">{v.title}</h6>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL KISMI (AYNI KALACAK) */}
      {selectedIdx !== null && (
        <div className="video-modal-overlay" onClick={() => setSelectedIdx(null)}>
          <div className="video-modal-container bg-white shadow-lg rounded-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="ratio ratio-16x9">
              <iframe 
                src={`https://www.youtube.com/embed/${getYoutubeId(videos[selectedIdx].youtubeUrl)}?autoplay=1`} 
                title={videos[selectedIdx].title} 
                allowFullScreen
                allow="autoplay"
              ></iframe>
            </div>
            <div className="d-flex justify-content-between align-items-center p-3 bg-white">
              <div className="d-flex align-items-center gap-3">
                <button onClick={prevVideo} className="btn btn-light rounded-circle shadow-sm p-2"><FaChevronLeft /></button>
                <button onClick={nextVideo} className="btn btn-light rounded-circle shadow-sm p-2"><FaChevronRight /></button>
                <span className="small fw-bold text-muted">{selectedIdx + 1} / {videos.length}</span>
              </div>
              <button onClick={() => setSelectedIdx(null)} className="btn btn-light rounded-circle shadow-sm p-2 text-danger">
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer theme={theme} />
    </div>
  );
};

export default Satisfaction;