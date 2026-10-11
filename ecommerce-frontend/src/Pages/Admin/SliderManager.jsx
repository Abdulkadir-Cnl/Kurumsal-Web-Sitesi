// src/Pages/Admin/SliderManager.jsx
import React from 'react';
import axios from 'axios';
import { FaPlus, FaSave, FaTrash, FaInfoCircle } from "react-icons/fa";

const SliderManager = ({ heroImages, setHeroImages, token, BASE_URL }) => {
  
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // --- KRİTİK: 3 GÖRSEL SINIRI KONTROLÜ ---
    if (heroImages.length >= 3) {
      alert("En fazla 3 adet slider görseli ekleyebilirsiniz. Yeni eklemek için mevcutlardan birini silmelisiniz.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post(`${BASE_URL}/api/Theme/upload`, fd, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      setHeroImages([...heroImages, res.data.path]);
    } catch { alert("Yükleme hatası!"); }
  };

  const saveToDb = async () => {
    try {
      // Backend string beklediği için JSON.stringify yapıyoruz
      await axios.put(`${BASE_URL}/api/Theme`, { 
        heroSliderImages: JSON.stringify(heroImages) 
      }, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      alert("Slider başarıyla güncellendi!");
    } catch { alert("Kayıt hatası! Lütfen 400 hatası için veri formatını kontrol edin."); }
  };

  return (
    <div className="p-3 bg-light text-start text-dark">
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
         <h6 className="fw-bold mb-0 small">Görsel Havuzu ({heroImages.length} / 3)</h6>
         {heroImages.length >= 3 && (
           <span className="badge bg-warning text-dark small">
             <FaInfoCircle className="me-1"/> Kontenjan Dolu
           </span>
         )}
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {heroImages.map((img, i) => (
          <div key={i} className="position-relative border rounded p-1 bg-white shadow-sm">
            <img src={`${BASE_URL}${img}`} width="120" height="70" className="object-fit-cover rounded" alt={`Slide ${i+1}`} />
            <button 
              className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 shadow-sm" 
              style={{width:'24px', height:'24px', marginTop:'-5px', marginRight:'-5px', borderRadius:'50%'}} 
              onClick={() => setHeroImages(heroImages.filter((_, idx) => idx !== i))}
              title="Sil"
            >
              ×
            </button>
          </div>
        ))}

        {/* --- SINIRLI EKLEME BUTONU --- */}
        {heroImages.length < 3 ? (
          <label className="btn btn-outline-primary d-flex flex-column align-items-center justify-content-center transition-all" style={{width:'120px', height:'78px', borderStyle:'dashed'}}>
            <FaPlus className="mb-1"/><span style={{fontSize:'10px', fontWeight:'bold'}}>Görsel Ekle</span>
            <input type="file" hidden onChange={handleUpload} accept="image/*" />
          </label>
        ) : (
          <div className="d-flex align-items-center justify-content-center border rounded bg-white text-muted opacity-50" style={{width:'120px', height:'78px', borderStyle:'dashed', fontSize:'9px', textAlign:'center', padding:'5px'}}>
            Yeni eklemek için birini silin
          </div>
        )}
      </div>

      <button className="btn btn-primary w-100 fw-bold shadow-sm py-2" onClick={saveToDb} disabled={heroImages.length === 0}>
        <FaSave className="me-2"/> SLIDER AYARLARINI KAYDET
      </button>

      <style>{`
        .transition-all { transition: all 0.3s ease; }
        .btn-outline-primary:hover { border-style: solid !important; background: #c5a059 !important; border-color: #c5a059 !important; color: white !important; }
      `}</style>
    </div>
  );
};

export default SliderManager;