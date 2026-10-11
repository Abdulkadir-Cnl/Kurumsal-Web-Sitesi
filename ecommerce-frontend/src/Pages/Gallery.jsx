import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [projects, setProjects] = useState([]);
    const [theme, setTheme] = useState(null);
    const [activeProjectId, setActiveProjectId] = useState(null);
    // Lightbox için state: Seçili resmin indeksi, null ise kapalı
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const BASE_URL = "https://localhost:7137";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gRes, pRes, tRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/Gallery`),
                    axios.get(`${BASE_URL}/api/Projects`),
                    axios.get(`${BASE_URL}/api/Theme`)
                ]);
                setImages(gRes.data || []);
                setProjects(pRes.data || []);
                setTheme(tRes.data);
                if (pRes.data?.length > 0) setActiveProjectId(pRes.data[0].id);
            } catch (err) { console.error(err); }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    // Lightbox'ı kapatma fonksiyonu
    const closeLightbox = () => setSelectedImageIndex(null);

    // Önceki/Sonraki resme geçme fonksiyonları
    const prevImage = (e) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
    };
    const nextImage = (e) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
    };

    // Klavye ile gezinme desteği (Escape, Sol Ok, Sağ Ok)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedImageIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage(e);
            if (e.key === 'ArrowRight') nextImage(e);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex]);

    const filteredImages = images.filter(img => img.projectId === activeProjectId);
    const activeTitle = projects.find(p => p.id === activeProjectId)?.title || "GALERİ";

    if (!theme) return null;

    return (
        <div className="bg-white min-vh-100 d-flex flex-column text-start">
            <Navbar theme={theme} />
            <main style={{ paddingTop: '140px' }} className="flex-grow-1 pb-5">
                {/* SEKMELER */}
                <div className="container-fluid p-0 mb-5 border-bottom border-top bg-light">
                    <div className="container p-0 d-flex flex-wrap justify-content-center">
                        {projects.map(p => (
                            <button key={p.id} onClick={() => setActiveProjectId(p.id)} className={`gallery-tab-btn ${activeProjectId === p.id ? 'active' : ''}`}>
                                {p.title.toUpperCase()}
                                {activeProjectId === p.id && <div className="tab-arrow"></div>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GÖRSELLER */}
                <div className="container">
                    <h2 className="fw-bold text-center mb-5 text-primary text-uppercase" style={{letterSpacing: '2px'}}>{activeTitle} GALERİ</h2>
                    <div className="row g-3">
                        {filteredImages.map((img, index) => (
                            <div key={img.id} className="col-lg-4 col-md-6 col-6">
                                <div 
                                    className="gallery-card overflow-hidden rounded shadow-sm"
                                    onClick={() => setSelectedImageIndex(index)} // Tıklanan görselin indeksini kaydet
                                >
                                    <img src={`${BASE_URL}${img.imageUrl}`} className="img-fluid w-100 h-100 object-fit-cover" alt="" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* TAM EKRAN LIGHTBOX (MODAL) */}
            {selectedImageIndex !== null && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close-btn" onClick={closeLightbox}><FaTimes /></button>
                    
                    {/* Sol Ok */}
                    {filteredImages.length > 1 && (
                        <button className="lightbox-nav-btn prev" onClick={prevImage}><FaChevronLeft /></button>
                    )}
                    
                    {/* Seçili Görsel */}
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={`${BASE_URL}${filteredImages[selectedImageIndex].imageUrl}`} 
                            alt="Tam Ekran Galeri" 
                            className="lightbox-img shadow-lg rounded"
                        />
                    </div>

                    {/* Sağ Ok */}
                    {filteredImages.length > 1 && (
                        <button className="lightbox-nav-btn next" onClick={nextImage}><FaChevronRight /></button>
                    )}
                </div>
            )}

            <Footer theme={theme} />
            <style>{`
                .gallery-tab-btn { padding: 15px 30px; border: 1px solid #eee; background: white; color: #c5a059; font-weight: bold; position: relative; transition: 0.3s; cursor: pointer; }
                .gallery-tab-btn.active { background-color: #14213d; color: #c5a059; border-color: #14213d; }
                .tab-arrow { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid #14213d; }
                .gallery-card { height: 300px; transition: 0.4s; cursor: zoom-in; }
                .gallery-card:hover { transform: translateY(-5px); }
                .text-primary { color: #1a3b6e !important; }

                /* LIGHTBOX CSS */
                .lightbox-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; }
                .lightbox-content { max-width: 90vw; max-height: 90vh; position: relative; }
                .lightbox-img { max-width: 100%; max-height: 90vh; object-fit: contain; }
                .lightbox-close-btn { position: absolute; top: 20px; right: 30px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer; transition: 0.3s; z-index: 10001; }
                .lightbox-close-btn:hover { color: #c5a059; transform: scale(1.1); }
                .lightbox-nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: none; border: none; color: white; font-size: 3rem; cursor: pointer; transition: 0.3s; z-index: 10001; opacity: 0.7; }
                .lightbox-nav-btn:hover { color: #c5a059; opacity: 1; transform: translateY(-50%) scale(1.1); }
                .lightbox-nav-btn.prev { left: 30px; }
                .lightbox-nav-btn.next { right: 30px; }
                @media (max-width: 768px) { .lightbox-nav-btn { font-size: 2rem; } .lightbox-nav-btn.prev { left: 10px; } .lightbox-nav-btn.next { right: 10px; } .gallery-card { height: 200px; } }
            `}</style>
        </div>
    );
};

export default Gallery;