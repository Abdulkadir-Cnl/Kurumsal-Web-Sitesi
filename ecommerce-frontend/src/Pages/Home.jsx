import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaBuilding, FaSmile, FaCalendarCheck, FaUsers, 
  FaChevronLeft, FaChevronRight 
} from "react-icons/fa";
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import Footer from '../Components/Footer';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const SlickSlider = Slider.default ? Slider.default : Slider;

const Home = ({ theme: propTheme, projects: propProjects, isPreview = false }) => {
  const [theme, setTheme] = useState(propTheme || null);
  const [projects, setProjects] = useState(propProjects || []);
  const BASE_URL = "https://localhost:7137";
  const navigate = useNavigate();

  useEffect(() => {
    if (!propTheme) {
      const fetchData = async () => {
        try {
          const tRes = await axios.get(`${BASE_URL}/api/Theme`);
          setTheme(tRes.data);
          const pRes = await axios.get(`${BASE_URL}/api/Projects`);
          setProjects(Array.isArray(pRes.data) ? pRes.data : []);
        } catch (err) { console.error("Veri çekme hatası:", err); }
      };
      fetchData();
    } else {
      setTheme(propTheme);
      setProjects(propProjects);
    }
  }, [propTheme, propProjects]);

  const SamplePrevArrow = ({ onClick }) => (
    <div className="custom-arrow prev-arrow d-none d-md-flex" onClick={onClick}><FaChevronLeft /></div>
  );
  const SampleNextArrow = ({ onClick }) => (
    <div className="custom-arrow next-arrow d-none d-md-flex" onClick={onClick}><FaChevronRight /></div>
  );

  const getSliderSettings = (count) => ({
    dots: true,
    infinite: count > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true, 
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, arrows: false } },
      { breakpoint: 768, settings: { slidesToShow: 1, arrows: false, dots: true } }
    ]
  });

  const ProjectCard = ({ p }) => {
    const handleNavigate = () => {
      const rawUrl = p.url?.trim() || p.Url?.trim();
      const isExternal = rawUrl && (/^https?:\/\//.test(rawUrl) || rawUrl.startsWith('www.'));
      if (isExternal) {
        window.open(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`, '_blank');
      } else {
        navigate(`/proje-detay/${p.id}`);
      }
    };

    return (
      <div className="px-2 py-3">
        <div className="card h-100 border-0 shadow-sm overflow-hidden position-relative project-card-clickable" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
          <img src={`${BASE_URL}${p.imageUrl}`} className="card-img-top" style={{ height: '250px', objectFit: 'cover' }} alt={p.title} />
          <div className="card-body p-4 d-flex flex-column text-start text-dark">
            <h6 className="fw-bold text-truncate">{p.title}</h6>
            <p className="text-muted small mb-3"><FaMapMarkerAlt className="text-primary me-1" /> {p.location}</p>
            <div className="btn btn-outline-dark btn-sm w-100 fw-bold mt-auto border-2 py-2">PROJEYİ İNCELE</div>
          </div>
        </div>
      </div>
    );
  };

  if (!theme) return null;

  return (
    <div className="bg-white min-vh-100 d-flex flex-column text-start overflow-x-hidden">
      {!isPreview && <Navbar theme={theme} />}
      
      <div className="hero-wrapper" style={{ paddingTop: isPreview ? '0' : '80px' }}>
        <Hero images={theme.heroSliderImages} />
      </div>

      {/* TÜM PROJELER SLIDER */}
      <section className="py-5 container slider-container-custom">
        <h2 className="fw-bold text-center mb-4 mb-md-5 text-dark section-title">Projelerimiz</h2>
        {projects.length > 0 ? (
          <SlickSlider {...getSliderSettings(projects.length)}>
            {projects.map(p => <ProjectCard key={p.id} p={p} />)}
          </SlickSlider>
        ) : <p className="text-center text-muted">Henüz proje bulunamadı.</p>}
      </section>

      {/* İstatistikler */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <FaBuilding className="fs-1 text-primary mb-2" />
              <h2 className="fw-bold text-dark h3 mb-0">{theme.projectCount || "60+"}</h2>
              <p className="small fw-bold text-muted text-uppercase mt-1">PROJE</p>
            </div>
            <div className="col-6 col-md-3">
              <FaSmile className="fs-1 text-primary mb-2" />
              <h2 className="fw-bold text-dark h3 mb-0">{theme.customerCount || "6500+"}</h2>
              <p className="small fw-bold text-muted text-uppercase mt-1">MUTLU MÜŞTERİ</p>
            </div>
            <div className="col-6 col-md-3">
              <FaCalendarCheck className="fs-1 text-primary mb-2" />
              <h2 className="fw-bold text-dark h3 mb-0">{theme.experienceYear || "+25"}</h2>
              <p className="small fw-bold text-muted text-uppercase mt-1">YILLIK TECRÜBE</p>
            </div>
            <div className="col-6 col-md-3">
              <FaUsers className="fs-1 text-primary mb-2" />
              <h2 className="fw-bold text-dark h3 mb-0">{theme.teamCount || "1100"}</h2>
              <p className="small fw-bold text-muted text-uppercase mt-1">Takım Arkadaşı</p>
            </div>
          </div>
        </div>
      </section>

      {/* Müşteri Memnuniyeti Banner */}
      <section className="satisfaction-banner-wrapper py-5 position-relative">
        <div className="satisfaction-slanted-bg shadow-lg">
          <div className="container h-100 d-flex align-items-center justify-content-end text-white py-5">
            <div className="row justify-content-end w-100">
              <div className="col-lg-8 text-end satisfaction-content">
                <div className="d-inline-block position-relative mb-4">
                  <h2 className="fw-bold display-6 m-0 text-uppercase" style={{ letterSpacing: '1px' }}>
                    Müşteri Memnuniyeti
                  </h2>
                  <div className="satisfaction-bracket"></div>
                </div>
                <p className="lh-lg mb-5 opacity-75 fs-5">
                  {theme.satisfactionText || "Leyal Medya müşteri memnuniyetini her zaman ön planda tutarak sunduğu hizmetlerle müşterilerinin beklentilerini aşmayı hedeflemektedir."}
                </p>
                <button 
                  onClick={() => navigate('/musteri-memnuniyeti')}
                  className="btn btn-light px-5 py-3 fw-bold rounded-0 transition-all border-0 shadow"
                  style={{ color: '#c5a059', letterSpacing: '1px' }}
                >
                  DETAYLI İNCELE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kurumsal Değerler - Çökme Hatası Giderildi */}
      <section style={{ backgroundColor: '#1a2b4c', padding: '60px 0' }} className="text-white text-center">
        <div className="container">
          <h2 className="fw-bold mb-5 section-title" style={{ letterSpacing: '2px' }}>KURUMSAL DEĞERLERİMİZ</h2>
          <div className="row g-3 g-md-4 justify-content-center">
            {(() => {
              try {
                const values = JSON.parse(theme.corporateValues || "[]");
                if (Array.isArray(values)) {
                  return values.map((item, idx) => (
                    <div key={idx} className="col-6 col-lg-2 col-md-4">
                      <div className="bg-white p-3 p-md-4 h-100 rounded shadow-sm text-dark d-flex flex-column align-items-center justify-content-center">
                        <h6 className="fw-bold mb-2 small-title">{item.title}</h6>
                        <p className="small text-muted mb-0" style={{ lineHeight: '1.3', fontSize: '0.8rem' }}>{item.description}</p>
                      </div>
                    </div>
                  ));
                }
                return null;
              } catch (e) {
                console.error("JSON Parse Hatası (CorporateValues):", e);
                return <p className="text-white-50">Değerler yüklenirken bir hata oluştu.</p>;
              }
            })()}
          </div>
        </div>
      </section>

      <Footer theme={theme} />

      <style>{`
        .project-card-clickable:hover { transform: translateY(-8px); transition: 0.3s; box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        .text-primary { color: #c5a059 !important; }
        
        .slider-container-custom { position: relative; padding: 0 50px; }
        
        .custom-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 100;
          width: 45px; height: 45px; background: #fff; border: 2px solid #1a2b4c;
          border-radius: 50%; display: flex !important; align-items: center; justify-content: center;
          cursor: pointer; color: #1a2b4c; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: 0.3s;
        }
        .custom-arrow:hover { background: #1a2b4c; color: #fff; }
        .prev-arrow { left: 0px; }
        .next-arrow { right: 0px; }
        .slick-dots { bottom: -35px; }

        .satisfaction-banner-wrapper { overflow: hidden; background: #fff; }
        .satisfaction-slanted-bg {
          background: linear-gradient(rgba(26, 43, 76, 0.95), rgba(26, 43, 76, 0.95)), 
                      url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'); 
          background-size: cover; background-position: center; min-height: 500px;
          clip-path: polygon(0 15%, 100% 0, 100% 85%, 0 100%); position: relative;
        }
        .satisfaction-bracket {
          position: absolute; top: -5px; right: -20px; width: 30px; height: 100%;
          border-right: 2px solid #fff; border-top: 2px solid #fff; border-bottom: 2px solid #fff; opacity: 0.5;
        }
        .btn-light:hover { background-color: #c5a059 !important; color: white !important; transform: translateY(-3px); }

        @media (max-width: 991px) {
          .satisfaction-content { text-align: center !important; }
          .satisfaction-slanted-bg { clip-path: none; padding: 50px 0; }
          .satisfaction-bracket { display: none; }
        }

        @media (max-width: 768px) {
          .hero-wrapper { padding-top: 60px !important; }
          .slider-container-custom { padding: 0 15px; }
          .section-title { font-size: 1.5rem !important; }
          .small-title { font-size: 0.9rem !important; }
          .card-img-top { height: 200px !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;