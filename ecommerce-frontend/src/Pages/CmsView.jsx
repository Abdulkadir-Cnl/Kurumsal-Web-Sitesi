import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const CmsView = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [theme, setTheme] = useState(null);
  const [projectImages, setProjectImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const BACKEND_URL = "https://localhost:7137";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. CMS İçeriği ve Tema Verilerini Çek
        const [cmsRes, themeRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/cms/${slug}`),
          axios.get(`${BACKEND_URL}/api/Theme`)
        ]);
        setItem(cmsRes.data);
        setTheme(themeRes.data);

        // 2. Proje ve Galeri Verilerini Çekerek Eşleştirme Yap
        const [projectsRes, galleryRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/Projects`),
          axios.get(`${BACKEND_URL}/api/Gallery`)
        ]);

        // URL (slug) ile Proje başlığını eşleştir
        const matchedProject = projectsRes.data.find(p => 
          p.title.toLowerCase().includes(slug.toLowerCase()) || 
          slug.toLowerCase().includes(p.title.toLowerCase())
        );

        if (matchedProject && galleryRes.data) {
          const filtered = galleryRes.data.filter(img => img.projectId === matchedProject.id);
          setProjectImages(filtered);
        } else {
          setProjectImages([]);
        }
      } catch (err) {
        console.error("Veri yükleme hatası:", err);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [slug]);

  // Lightbox Fonksiyonları
  const closeLightbox = () => setSelectedImageIndex(null);
  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1));
  };
  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === projectImages.length - 1 ? 0 : prev + 1));
  };

  // Klavye Kontrolleri
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

  if (!item || !theme) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Yükleniyor...</span></div>
    </div>
  );

  return (
    <div className="min-vh-100 d-flex flex-column bg-white overflow-x-hidden font-sans">
      <Navbar theme={theme} />

      {/* PARALAKS BAŞLIK */}
      <div className="position-relative" style={{ marginTop: '100px', height: '350px', background: 'linear-gradient(135deg, #1a2b4c, #2a4b7c)', overflow: 'hidden' }}>
        {item.imageUrl1 && (
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
            backgroundImage: `url(${BACKEND_URL}${item.imageUrl1})`, 
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.3', filter: 'blur(4px)' 
          }}></div>
        )}
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center px-4" style={{ background: 'rgba(26, 43, 76, 0.5)' }}>
          <h1 className="display-3 fw-bold mb-3" style={{ color: '#c5a059', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
            {item.title}
          </h1>
        </div>
      </div>

      <main className="flex-grow-1 py-5 position-relative" style={{ marginTop: '-80px', zIndex: '10' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="bg-white p-5 shadow-lg rounded-4">
                
                {/* İKİLİ GÖRSEL SUNUMU */}
                {(item.imageUrl1 || item.imageUrl2) && (
                  <div className="row g-4 mb-5">
                    {item.imageUrl1 && (
                      <div className={item.imageUrl2 ? "col-md-6" : "col-12"}>
                        <div className="card border-0 shadow-sm overflow-hidden h-100 rounded-3 img-hover-zoom" style={{ border: '2px solid #c5a059' }}>
                          <img src={`${BACKEND_URL}${item.imageUrl1}`} className="img-fluid w-100 object-fit-cover" style={{ maxHeight: '400px' }} alt="Görsel" />
                        </div>
                      </div>
                    )}
                    {item.imageUrl2 && (
                      <div className="col-md-6">
                        <div className="card border-0 shadow-sm overflow-hidden h-100 rounded-3 img-hover-zoom" style={{ border: '2px solid #c5a059' }}>
                          <img src={`${BACKEND_URL}${item.imageUrl2}`} className="img-fluid w-100 object-fit-cover" style={{ maxHeight: '400px' }} alt="Görsel" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CMS İÇERİK METNİ */}
                <div 
                  className="cms-content fs-5 text-dark lh-lg mb-5"
                  style={{ color: '#2d2d2d', wordWrap: 'break-word', overflowWrap: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: item.body }} 
                />

                {/* DİNAMİK PROJE GALERİSİ */}
                {projectImages.length > 0 && (
                  <div className="mt-5 pt-4 border-top">
                    <h3 className="fw-bold mb-4 text-center" style={{ color: '#1a2b4c', letterSpacing: '1px' }}>PROJE GALERİSİ</h3>
                    <div className="row g-3">
                      {projectImages.map((img, index) => (
                        <div key={index} className="col-md-4 col-6">
                          <div 
                            className="gallery-item-wrapper rounded-3 overflow-hidden shadow-sm shadow-hover"
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img 
                              src={`${BACKEND_URL}${img.imageUrl}`} 
                              className="img-fluid w-100 h-100 object-fit-cover" 
                              style={{ height: '220px', transition: '0.4s' }}
                              alt={`Galeri ${index}`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* TAM EKRAN LIGHTBOX MODAL */}
      {selectedImageIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close-btn" onClick={closeLightbox}><FaTimes /></button>
          {projectImages.length > 1 && (
            <button className="lightbox-nav-btn prev" onClick={prevImage}><FaChevronLeft /></button>
          )}
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={`${BACKEND_URL}${projectImages[selectedImageIndex].imageUrl}`} 
              alt="Tam Ekran" 
              className="lightbox-img shadow-lg rounded"
            />
          </div>
          {projectImages.length > 1 && (
            <button className="lightbox-nav-btn next" onClick={nextImage}><FaChevronRight /></button>
          )}
        </div>
      )}

      <Footer theme={theme} />

      <style>{`
        .bg-primary { background-color: #c5a059 !important; }
        .text-primary { color: #c5a059 !important; }
        .tracking-wider { letter-spacing: 0.1em; }
        .cms-content p { margin-bottom: 1.5rem; }
        .cms-content h2, .cms-content h3 { color: #1a2b4c; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; }
        
        /* Editörden Eklenen Resimlerin Düzenlenmesi */
        .cms-content img { 
          max-width: 100%; 
          height: auto !important; 
          display: block; 
          margin: 2rem auto; 
          border-radius: 12px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
        }

        .cms-content a { color: #c5a059; text-decoration: none; font-weight: 600; transition: color 0.3s; }
        .cms-content a:hover { color: #1a2b4c; text-decoration: underline; }
        .cms-content ul, .cms-content ol { padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .cms-content li { margin-bottom: 0.5rem; }
        .img-hover-zoom img { transition: transform 0.5s ease; }
        .img-hover-zoom:hover img { transform: scale(1.05); }
        .gallery-item-wrapper { cursor: pointer; background: #f8f9fa; }
        .gallery-item-wrapper:hover img { transform: scale(1.1); filter: brightness(0.8); }
        
        /* Lightbox Stilleri */
        .lightbox-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; }
        .lightbox-content { max-width: 90vw; max-height: 90vh; }
        .lightbox-img { max-width: 100%; max-height: 90vh; object-fit: contain; }
        .lightbox-close-btn { position: absolute; top: 20px; right: 30px; background: none; border: none; color: white; font-size: 2.5rem; cursor: pointer; z-index: 10001; }
        .lightbox-nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: none; border: none; color: white; font-size: 3rem; cursor: pointer; opacity: 0.7; transition: 0.3s; z-index: 10001; }
        .lightbox-nav-btn:hover { color: #c5a059; opacity: 1; }
        .lightbox-nav-btn.prev { left: 30px; }
        .lightbox-nav-btn.next { right: 30px; }
        @media (max-width: 768px) { .lightbox-nav-btn { font-size: 2rem; } .lightbox-nav-btn.prev { left: 10px; } .lightbox-nav-btn.next { right: 10px; } }
      `}</style>
    </div>
  );
};

export default CmsView;