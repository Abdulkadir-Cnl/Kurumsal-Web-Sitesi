import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaChevronRight } from 'react-icons/fa';

const Footer = ({ theme }) => {
  const BASE_URL = "https://localhost:7137";
  
  let footer = { phone: "+90 540 100 5838", email: "satis@leyalmedya.com", address: "Yıldırımbeyazıt Mah. Ankara Bul. No:23A Kahramankazan / ANKARA", instagram: "leyalmedya", facebook: "leyalmedya", youtube: "leyalmedya", linkedin: "leyalmedya" };

  if (theme?.footerData) {
    try { 
      const parsedFooter = typeof theme.footerData === 'string' ? JSON.parse(theme.footerData) : theme.footerData;
      footer = { ...footer, ...parsedFooter }; 
    } catch (e) { console.error("Footer verisi ayrıştırılamadı."); }
  }

  // --- HATA GİDERİLEN KISIM ---
  // Statik localhost linki yerine doğrudan App.jsx'teki rotayı kullanıyoruz
  const kurumsalUrl = "/s/kurumsal"; 

  const getSocialUrl = (platform, username) => {
    if (!username) return "#";
    const baseUrls = { ig: "https://instagram.com/", fb: "https://facebook.com/", yt: "https://youtube.com/@", li: "https://linkedin.com/in/" };
    return username.startsWith('http') ? username : `${baseUrls[platform]}${username}`;
  };

  return (
    <footer className="text-white position-relative overflow-hidden" style={{ backgroundColor: '#14213d', paddingTop: '70px', paddingBottom: '40px' }}>
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row g-5 text-start">
          <div className="col-lg-3 col-md-6">
            <img src={theme?.logoUrl ? `${BASE_URL}${theme.logoUrl}` : "/logo.png"} alt="Logo" style={{ maxHeight: '90px', filter: 'brightness(1.2)' }} />
            <p className="mt-3" style={{ color: '#c5a059', fontStyle: 'italic' }}>" Kazandıran Projeler "</p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-4 text-primary">Hızlı Erişim</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small fw-bold">
              <li><Link to={kurumsalUrl} className="text-white text-decoration-none opacity-75"><FaChevronRight className="me-1 text-primary" size={10} /> Kurumsal</Link></li>
              <li><Link to="/projeler" className="text-white text-decoration-none opacity-75"><FaChevronRight className="me-1 text-primary" size={10} /> Projeler</Link></li>
              <li><Link to="/iletisim" className="text-white text-decoration-none opacity-75"><FaChevronRight className="me-1 text-primary" size={10} /> Bize Ulaşın</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-4 text-primary">İletişim</h6>
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3"><div className="footer-circle-icon"><FaPhone /></div><span className="small fw-bold">{footer.phone}</span></div>
              <div className="d-flex align-items-start gap-3"><div className="footer-circle-icon mt-1"><FaMapMarkerAlt /></div><span className="small fw-bold">{footer.address}</span></div>
              <div className="d-flex align-items-center gap-3"><div className="footer-circle-icon"><FaEnvelope /></div><span className="small fw-bold">{footer.email}</span></div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-4 text-primary">Bizi Takip Edin</h6>
            <div className="row g-0">
              <div className="col-6 d-flex flex-column gap-3">
                <a href={getSocialUrl('ig', footer.instagram)} target="_blank" rel="noreferrer" className="social-link d-flex align-items-center gap-2 text-white"><div className="footer-circle-icon sm social-icon"><FaInstagram /></div><span style={{ fontSize: '11px' }}>Instagram</span></a>
                <a href={getSocialUrl('fb', footer.facebook)} target="_blank" rel="noreferrer" className="social-link d-flex align-items-center gap-2 text-white"><div className="footer-circle-icon sm social-icon"><FaFacebookF /></div><span style={{ fontSize: '11px' }}>Facebook</span></a>
              </div>
              <div className="col-6 d-flex flex-column gap-3">
                <a href={getSocialUrl('yt', footer.youtube)} target="_blank" rel="noreferrer" className="social-link d-flex align-items-center gap-2 text-white"><div className="footer-circle-icon sm social-icon"><FaYoutube /></div><span style={{ fontSize: '11px' }}>Youtube</span></a>
                <a href={getSocialUrl('li', footer.linkedin)} target="_blank" rel="noreferrer" className="social-link d-flex align-items-center gap-2 text-white"><div className="footer-circle-icon sm social-icon"><FaLinkedinIn /></div><span style={{ fontSize: '11px' }}>Linkedin</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`.text-primary { color: #c5a059 !important; } .footer-circle-icon { width: 45px; height: 45px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; } .footer-circle-icon.sm { width: 35px; height: 35px; } .social-link { text-decoration: none; }`}</style>
    </footer>
  );
};

export default Footer;