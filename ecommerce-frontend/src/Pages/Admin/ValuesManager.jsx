import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaTrash, FaPlus, FaAward } from "react-icons/fa";

const ValuesManager = ({ theme, setTheme, token, BASE_URL }) => {
  const [values, setValues] = useState([]);

  // Mevcut Değerleri Yükle
  useEffect(() => {
    if (theme?.corporateValues) {
      try {
        const parsed = typeof theme.corporateValues === "string" 
          ? JSON.parse(theme.corporateValues) 
          : theme.corporateValues;
        setValues(Array.isArray(parsed) ? parsed : []);
      } catch (e) { 
        setValues([]);
      }
    }
  }, [theme?.corporateValues]);

  const updateField = (index, field, value) => {
    const newValues = [...values];
    newValues[index][field] = value;
    setValues(newValues);
  };

  const addCard = () => {
    if (values.length >= 5) return alert("En fazla 5 kurumsal değer ekleyebilirsiniz.");
    setValues([...values, { title: "", description: "" }]);
  };

  // --- KRİTİK DÜZELTME: 400 HATASINI ÖNLEYEN KAYIT MANTIĞI ---
  const handleSaveSingleValue = async (index) => {
    try {
      // Backend'in (C#) beklediği gibi tüm karmaşık alanları stringify yapıyoruz
      const payload = {
        ...theme,
        corporateValues: JSON.stringify(values),
        navLinks: typeof theme.navLinks === 'object' ? JSON.stringify(theme.navLinks) : (theme.navLinks || "[]"),
        heroSliderImages: typeof theme.heroSliderImages === 'object' ? JSON.stringify(theme.heroSliderImages) : (theme.heroSliderImages || "[]"),
        footerData: typeof theme.footerData === 'object' ? JSON.stringify(theme.footerData) : (theme.footerData || "{}")
      };

      // 405 hatasını önlemek için PUT metodu kullanılır
      await axios.put(`${BASE_URL}/api/Theme`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTheme({ ...theme, corporateValues: JSON.stringify(values) });
      alert(`Kart #${index + 1} başarıyla kaydedildi!`); 
    } catch (err) { 
      console.error("Hata Detayı:", err.response?.data);
      alert("Hata: Kaydedilemedi. (400 Bad Request)"); 
    }
  };

  const handleDeleteCard = async (index) => {
    if (!window.confirm("Bu değeri silmek istediğinize emin misiniz?")) return;
    
    const newValues = values.filter((_, i) => i !== index);
    setValues(newValues);

    try {
      const payload = {
        ...theme,
        corporateValues: JSON.stringify(newValues),
        navLinks: typeof theme.navLinks === 'object' ? JSON.stringify(theme.navLinks) : (theme.navLinks || "[]"),
        heroSliderImages: typeof theme.heroSliderImages === 'object' ? JSON.stringify(theme.heroSliderImages) : (theme.heroSliderImages || "[]"),
        footerData: typeof theme.footerData === 'object' ? JSON.stringify(theme.footerData) : (theme.footerData || "{}")
      };

      await axios.put(`${BASE_URL}/api/Theme`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTheme({ ...theme, corporateValues: JSON.stringify(newValues) });
      alert("Değer başarıyla silindi.");
    } catch (err) { 
      alert("Hata: Silme işlemi kaydedilemedi."); 
    }
  };

  return (
    <div className="p-3 text-start bg-white rounded shadow-sm text-dark">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h6 className="fw-bold mb-0">
          <FaAward className="me-2 text-primary" /> Kurumsal Değerler
        </h6>
        <button className="btn btn-outline-primary btn-sm fw-bold" onClick={addCard}>
          <FaPlus className="me-1" /> YENİ KART EKLE
        </button>
      </div>

      <div className="row g-3">
        {values.map((v, idx) => (
          <div key={idx} className="col-12 mb-3">
            <div className="p-3 border rounded bg-light shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold small text-muted text-uppercase">Kart #{idx + 1}</span>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-success btn-sm fw-bold shadow-sm d-flex align-items-center gap-1" 
                    onClick={() => handleSaveSingleValue(idx)}
                  >
                    <FaSave size={12} /> KAYDET
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm shadow-sm" 
                    onClick={() => handleDeleteCard(idx)}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              
              <div className="mb-2">
                <label className="form-label small fw-bold opacity-75">Başlık</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm border-2 shadow-none" 
                  value={v.title} 
                  onChange={(e) => updateField(idx, "title", e.target.value)} 
                />
              </div>
              
              <div>
                <label className="form-label small fw-bold opacity-75">Açıklama</label>
                <textarea 
                  className="form-control form-control-sm border-2 shadow-none" 
                  rows="2" 
                  value={v.description} 
                  onChange={(e) => updateField(idx, "description", e.target.value)} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {values.length === 0 && (
        <div className="text-center py-4 opacity-50 small italic">
          Kayıtlı kurumsal değer bulunamadı.
        </div>
      )}
    </div>
  );
};

export default ValuesManager;