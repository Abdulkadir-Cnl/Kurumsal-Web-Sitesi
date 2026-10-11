import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaPhone, FaMapMarkerAlt, FaEnvelope, FaShareAlt } from "react-icons/fa";

const FooterManager = ({ theme, setTheme, token, BASE_URL }) => {
  const [footerData, setFooterData] = useState({
    phone: "444 55 87",
    email: "bilgi@trinvest.com.tr",
    address: "Çamlıca Mah. 151 Cad. No: 2 Yenimahalle / Ankara",
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: ""
  });

  useEffect(() => {
    if (theme?.footerData) {
      try {
        const parsed = typeof theme.footerData === "string" 
          ? JSON.parse(theme.footerData) 
          : theme.footerData;
        setFooterData({ ...footerData, ...parsed });
      } catch (e) { console.error("Footer verisi ayrıştırılamadı."); }
    }
  }, [theme?.footerData]);

  // --- KRİTİK DÜZELTME: 400 HATASINI ÖNLEYEN KAYIT FONKSİYONU ---
  const handleSave = async () => {
    try {
      // Backend (C#) tarafı navLinks, heroSliderImages vb. alanları string bekliyor.
      // 400 Bad Request hatasını önlemek için tüm JSON alanlarını stringify yapıyoruz.
      const payload = {
        ...theme,
        footerData: JSON.stringify(footerData),
        navLinks: typeof theme.navLinks === 'object' ? JSON.stringify(theme.navLinks) : (theme.navLinks || "[]"),
        heroSliderImages: typeof theme.heroSliderImages === 'object' ? JSON.stringify(theme.heroSliderImages) : (theme.heroSliderImages || "[]"),
        corporateValues: typeof theme.corporateValues === 'object' ? JSON.stringify(theme.corporateValues) : (theme.corporateValues || "[]")
      };

      await axios.put(`${BASE_URL}/api/Theme`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Global state'i güncelle (footerData'yı yeni haliyle set et)
      setTheme({ ...theme, footerData: JSON.stringify(footerData) });
      alert("Footer ayarları başarıyla kaydedildi!");
    } catch (err) {
      console.error("Footer Kayıt Hatası:", err.response?.data);
      alert("Hata: Kaydedilemedi. (400 Bad Request)");
    }
  };

  return (
    <div className="p-3 text-start bg-white rounded shadow-sm">
      <h6 className="fw-bold mb-4 border-bottom pb-2 text-dark">Footer İletişim & Sosyal Medya</h6>
      
      <div className="row g-3 text-dark">
        {/* İletişim Bilgileri */}
        <div className="col-12 mb-2">
          <label className="form-label small fw-bold"><FaPhone className="me-1"/> Telefon</label>
          <input type="text" className="form-control form-control-sm border-2" value={footerData.phone} onChange={(e) => setFooterData({...footerData, phone: e.target.value})} />
        </div>
        <div className="col-12 mb-2">
          <label className="form-label small fw-bold"><FaEnvelope className="me-1"/> E-Posta</label>
          <input type="text" className="form-control form-control-sm border-2" value={footerData.email} onChange={(e) => setFooterData({...footerData, email: e.target.value})} />
        </div>
        <div className="col-12 mb-2">
          <label className="form-label small fw-bold"><FaMapMarkerAlt className="me-1"/> Adres</label>
          <textarea className="form-control form-control-sm border-2" rows="2" value={footerData.address} onChange={(e) => setFooterData({...footerData, address: e.target.value})} />
        </div>

        {/* Sosyal Medya */}
        <h6 className="fw-bold mt-4 mb-1 small text-primary"><FaShareAlt className="me-1"/> Sosyal Medya Kullanıcı Adları</h6>
        <div className="col-md-6 mb-2">
          <label className="small fw-bold">Instagram</label>
          <input type="text" className="form-control form-control-sm border-2" value={footerData.instagram} onChange={(e) => setFooterData({...footerData, instagram: e.target.value})} />
        </div>
        <div className="col-md-6 mb-2">
          <label className="small fw-bold">Facebook</label>
          <input type="text" className="form-control form-control-sm border-2" value={footerData.facebook} onChange={(e) => setFooterData({...footerData, facebook: e.target.value})} />
        </div>
        <div className="col-md-6 mb-2">
          <label className="small fw-bold">Youtube</label>
          <input type="text" className="form-control form-control-sm border-2" value={footerData.youtube} onChange={(e) => setFooterData({...footerData, youtube: e.target.value})} />
        </div>
        <div className="col-md-6 mb-2">
          <label className="small fw-bold">Linkedin</label>
          <input type="text" className="form-control form-control-sm border-2" value={footerData.linkedin} onChange={(e) => setFooterData({...footerData, linkedin: e.target.value})} />
        </div>

        <div className="col-12 mt-4">
          <button className="btn btn-primary w-100 fw-bold shadow-sm" onClick={handleSave}>
            <FaSave className="me-2" /> FOOTER AYARLARINI KAYDET
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterManager;