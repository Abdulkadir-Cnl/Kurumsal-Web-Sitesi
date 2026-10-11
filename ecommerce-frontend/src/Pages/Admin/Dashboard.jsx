import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaDesktop, FaMobileAlt, FaEye, FaSignOutAlt, FaChevronDown,
  FaImages, FaBuilding, FaBars, FaFileAlt, FaAward, FaCogs,
  FaNewspaper, FaSave, FaEnvelopeOpenText, FaVideo, FaPhotoVideo, FaTh
} from "react-icons/fa";

// Yönetim Bileşenleri
import SliderManager from './SliderManager';
import ProjectManager from './ProjectManager';
import NavManager from './NavManager';
import CmsManager from './CmsManager';
import FooterManager from './FooterManager';
import BlogManager from './BlogManager';
import MessageManager from './MessageManager';
import CustomerManager from './CustomerManager'; 
import VideoManager from './VideoManager'; 
import MediaManager from './MediaManager'; 
import GalleryManager from './GalleryManager'; 
import CatalogManager from './CatalogManager';
import CorporateManager from './CorporateManager';
import ValuesManager from './ValuesManager';
import Home from '../Home';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [theme, setTheme] = useState({
    logoUrl: '', navLinks: '[]', heroSliderImages: '[]',
    corporateValues: '[]', footerData: '{}',
    projectCount: '0', customerCount: '0', experienceYear: '0', teamCount: '0',
    satisfactionText: '', mission: '', vision: '', catalogText: ''
  });

  const [activeTab, setActiveTab] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', location: '', description: '', url: '', imageFile: null });

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const BASE_URL = "https://localhost:7137";

  useEffect(() => {
    // KRİTİK GÜVENLİK: Linkten manuel /admin yazılırsa direkt login'e atar
    if (!location.state?.fromLogin) {
      localStorage.removeItem('token'); // Güvenlik için varsa token'ı temizle
      navigate('/login', { replace: true });
    } else {
      fetchData();
    }
  }, [location, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, pRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/Theme`),
        axios.get(`${BASE_URL}/api/Projects`)
      ]);
      setTheme(tRes.data);
      setProjects(pRes.data || []);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const safeParse = (data, fallback = []) => {
    if (!data) return fallback;
    if (typeof data === 'object') return data;
    try { return JSON.parse(data); } catch { return fallback; }
  };

  const handleSaveAllTheme = async () => {
    try {
      const payload = {
        ...theme,
        navLinks: typeof theme.navLinks === 'object' ? JSON.stringify(theme.navLinks) : (theme.navLinks || "[]"),
        heroSliderImages: typeof theme.heroSliderImages === 'object' ? JSON.stringify(theme.heroSliderImages) : (theme.heroSliderImages || "[]"),
        corporateValues: typeof theme.corporateValues === 'object' ? JSON.stringify(theme.corporateValues) : (theme.corporateValues || "[]"),
        footerData: typeof theme.footerData === 'object' ? JSON.stringify(theme.footerData) : (theme.footerData || "{}")
      };
      await axios.put(`${BASE_URL}/api/Theme`, payload, { 
        headers: { "Authorization": `Bearer ${token}` } 
      });
      alert("Ayarlar kaydedildi!");
      fetchData();
    } catch { alert("Hata."); }
  };

  const handleSaveProject = async () => {
    const fd = new FormData();
    fd.append("Title", formData.title);
    fd.append("Location", formData.location);
    fd.append("Description", formData.description);
    fd.append("Url", formData.url || "");
    if (formData.imageFile) fd.append("ImageFile", formData.imageFile);

    try {
      const config = { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" } };
      if (editingId) await axios.put(`${BASE_URL}/api/Projects/${editingId}`, fd, config);
      else await axios.post(`${BASE_URL}/api/Projects`, fd, config);
      setFormData({ title: '', location: '', description: '', url: '', imageFile: null });
      setEditingId(null);
      fetchData();
    } catch { alert("Hata."); }
  };

  const toggleTab = (name) => setActiveTab(prev => prev === name ? null : name);

  if (loading || !theme) return <div className="vh-100 d-flex align-items-center justify-content-center bg-light fw-bold text-primary">Yükleniyor...</div>;

  return (
    <div className="container-fluid vh-100 p-0 overflow-hidden bg-light text-start text-dark">
      <div className="row g-0 h-100">
        <div className="col-md-5 bg-white border-end h-100 overflow-auto shadow-sm">
          <div className="p-3 bg-white d-flex justify-content-between align-items-center sticky-top shadow-sm" style={{ zIndex: 1050 }}>
            <img src={"Leyal.svg"} alt="Logo" style={{ maxHeight: '55px' }} />
            <div className="d-flex align-items-center gap-2">
              <button onClick={handleSaveAllTheme} className="btn btn-primary btn-sm fw-bold px-3 shadow-sm border-0 rounded-pill">
                <FaSave className="me-2" /> GENEL KAYDET
              </button>
              <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2">
                <FaSignOutAlt />
              </button>
            </div>
          </div>

          <div className="p-3">
            {/* 1- KURUMSAL ÖZEL SAYFA */}
            <Section icon={<FaAward />} title="1- Kurumsal Özel Sayfa" active={activeTab === 'corporate'} onClick={() => toggleTab('corporate')}>
              <CorporateManager theme={theme} setTheme={setTheme} token={token} BASE_URL={BASE_URL} />
            </Section>

            {/* 2- ANASAYFA TASARIM (Menü, Sayaçlar ve Kurumsal Değerler) */}
            <Section icon={<FaDesktop />} title="2- Anasayfa Tasarım" active={activeTab === 'nav'} onClick={() => toggleTab('nav')}>
              <div className="p-3 bg-light border-bottom">
                <h6 className="fw-bold small text-primary mb-3 text-uppercase">Menü ve Sayaç Ayarları</h6>
                <NavManager theme={theme} setTheme={setTheme} token={token} BASE_URL={BASE_URL} view="design" />
              </div>
              <div className="p-3">
                <h6 className="fw-bold small text-primary mb-3 text-uppercase">Kurumsal Değerler (Kartlar)</h6>
                <ValuesManager theme={theme} setTheme={setTheme} token={token} BASE_URL={BASE_URL} />
              </div>
            </Section>

            {/* 3- SLIDER YÖNETİMİ */}
            <Section icon={<FaImages />} title="3- Slider Yönetimi" active={activeTab === 'slider'} onClick={() => toggleTab('slider')}>
              <SliderManager heroImages={safeParse(theme.heroSliderImages)} setHeroImages={(imgs) => setTheme({ ...theme, heroSliderImages: imgs })} token={token} BASE_URL={BASE_URL} />
            </Section>

            {/* 4- SAYFALAR (CMS) */}
            <Section icon={<FaFileAlt />} title="4- Sayfalar (CMS)" active={activeTab === 'cms'} onClick={() => toggleTab('cms')}>
              <CmsManager token={token} />
            </Section>

            {/* 5- PROJE YÖNETİMİ */}
            <Section icon={<FaBuilding />} title="5- Proje Yönetimi" active={activeTab === 'projects'} onClick={() => toggleTab('projects')}>
              <ProjectManager projects={projects} formData={formData} setFormData={setFormData} handleSave={handleSaveProject}
                startEdit={(p) => { setEditingId(p.id); setFormData({ ...p, imageFile: null }); setActiveTab('projects'); }}
                handleDelete={(id) => window.confirm("Emin misiniz?") && axios.delete(`${BASE_URL}/api/Projects/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(fetchData)}
                editingId={editingId} BASE_URL={BASE_URL} token={token} fetchData={fetchData} />
            </Section>

            {/* 6- BLOG YÖNETİMİ */}
            <Section icon={<FaNewspaper />} title="6- Blog Yönetimi" active={activeTab === 'blog'} onClick={() => toggleTab('blog')}>
              <BlogManager token={token} />
            </Section>

            {/* 7- GELEN MESAJLAR */}
            <Section icon={<FaEnvelopeOpenText />} title="7- Gelen Mesajlar" active={activeTab === 'messages'} onClick={() => toggleTab('messages')}>
              <MessageManager token={token} />
            </Section>

            {/* 8- FOOTER YÖNETİMİ */}
            <Section icon={<FaCogs />} title="8- Footer Yönetimi" active={activeTab === 'footer'} onClick={() => toggleTab('footer')}>
              <FooterManager theme={theme} setTheme={setTheme} token={token} BASE_URL={BASE_URL} />
            </Section>

            {/* DİĞERLERİ */}
            <Section icon={<FaPhotoVideo />} title="9- Medya Kapak Ayarları" active={activeTab === 'media-covers'} onClick={() => toggleTab('media-covers')}><MediaManager theme={theme} setTheme={setTheme} token={token} BASE_URL={BASE_URL} /></Section>
            <Section icon={<FaVideo />} title="10- Müşteri Memnuniyeti" active={activeTab === 'videos'} onClick={() => toggleTab('videos')}><CustomerManager theme={theme} setTheme={setTheme} token={token} BASE_URL={BASE_URL} /></Section>
            <Section icon={<FaVideo />} title="11- Video Sayfası Yönetimi" active={activeTab === 'video-page-manager'} onClick={() => toggleTab('video-page-manager')}><VideoManager token={token} BASE_URL={BASE_URL} /></Section>
            <Section icon={<FaFileAlt />} title="12- Katalog Yönetimi (PDF)" active={activeTab === 'catalogs'} onClick={() => toggleTab('catalogs')}><CatalogManager theme={theme} setTheme={setTheme} token={token} BASE_URL={BASE_URL} /></Section>
            <Section icon={<FaTh />} title="13- Galeri Yönetimi" active={activeTab === 'gallery'} onClick={() => toggleTab('gallery')}>
  <GalleryManager 
    token={token} 
    BASE_URL={BASE_URL} 
    projects={projects} // Mevcut projeleri galeri yöneticisine gönderiyoruz
  />
</Section></div>
        </div>

        <div className="col-md-7 bg-secondary bg-opacity-10 d-flex flex-column h-100 overflow-hidden text-center">
          <div className="p-2 bg-white border-bottom d-flex justify-content-between align-items-center px-4 shadow-sm">
            <span className="fw-bold small text-muted text-uppercase tracking-widest"><FaEye className="me-2" /> Canlı Önizleme</span>
            <div className="btn-group border rounded-pill bg-light p-1 shadow-sm">
              <button onClick={() => setPreviewMode("desktop")} className={`btn btn-sm border-0 rounded-pill px-3 transition-all ${previewMode === "desktop" ? "bg-white shadow-sm text-primary fw-bold" : "text-muted"}`}><FaDesktop className="me-2" />Masaüstü</button>
              <button onClick={() => setPreviewMode("mobile")} className={`btn btn-sm border-0 rounded-pill px-3 transition-all ${previewMode === "mobile" ? "bg-white shadow-sm text-primary fw-bold" : "text-muted"}`}><FaMobileAlt className="me-2" />Mobil</button>
            </div>
          </div>
          <div className="flex-grow-1 p-0 d-flex justify-content-center overflow-auto align-items-center bg-dark bg-opacity-10">
            <div className={`preview-container transition-all bg-white shadow-lg overflow-auto position-relative ${previewMode === "mobile" ? "preview-mobile-box my-4" : "w-100 h-100"}`}>
              <div style={{ zoom: previewMode === "mobile" ? '1' : '0.6', width: '100%', pointerEvents: 'none' }}>
                <Home theme={theme} projects={projects} isPreview={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`.preview-mobile-box { width: 375px; height: 667px; border: 12px solid #333; border-radius: 40px; } .text-primary { color: #aec90b !important; } .bg-primary { background-color: #aec90b !important; } .btn-primary { background-color: #aec90b !important; color: white !important; }`}</style>
    </div>
  );
};

const Section = ({ icon, title, active, onClick, children }) => (
  <div className="card mb-2 border-0 shadow-sm rounded-3 overflow-hidden">
    <div className={`card-header d-flex justify-content-between align-items-center py-2 px-3 transition-all ${active ? 'bg-primary text-white shadow' : 'bg-white'}`} style={{ cursor: 'pointer' }} onClick={onClick}>
      <h6 className="mb-0 fw-bold small d-flex align-items-center gap-2">{icon} <span>{title}</span></h6>
      <FaChevronDown style={{ transform: active ? 'rotate(180deg)' : 'none', transition: '0.3s', fontSize: '10px' }} />
    </div>
    {active && <div className="card-body p-0 border-top bg-white">{children}</div>}
  </div>
);

export default Dashboard;