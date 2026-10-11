import React from 'react';
import axios from 'axios';
import { FaCloudUploadAlt, FaImage } from 'react-icons/fa';

const MediaManager = ({ theme, setTheme, token, BASE_URL }) => {
    
    const handleUpload = async (file, type) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            // ThemeController içindeki upload metodunu kullanıyoruz
            const res = await axios.post(`${BASE_URL}/api/Theme/upload`, formData, {
                headers: { 
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "multipart/form-data" 
                }
            });

            // Gelen dosya yolunu ilgili theme alanına atıyoruz
            const field = type === 'gallery' ? 'mediaGalleryImage' : 'mediaVideoImage';
            setTheme({ ...theme, [field]: res.data.path });
            alert("Kapak görseli başarıyla yüklendi. Genel Kaydet butonuna basmayı unutmayın.");
        } catch (err) {
            console.error("Yükleme hatası:", err);
            alert("Görsel yüklenemedi.");
        }
    };

    return (
        <div className="p-3">
            <div className="row g-4">
                {/* GALERİ KAPAK GÖRSELİ */}
                <div className="col-md-6 text-center">
                    <label className="fw-bold small mb-2 d-block text-muted text-uppercase">Galeri Kutusu Kapağı</label>
                    <div className="border rounded-3 p-2 bg-light shadow-sm mb-2" style={{ height: '150px' }}>
                        {theme.mediaGalleryImage ? (
                            <img src={`${BASE_URL}${theme.mediaGalleryImage}`} className="w-100 h-100 object-fit-cover rounded" alt="Galeri Kapak" />
                        ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted small"><FaImage size={30} /></div>
                        )}
                    </div>
                    <input type="file" id="galleryCover" hidden onChange={(e) => handleUpload(e.target.files[0], 'gallery')} />
                    <label htmlFor="galleryCover" className="btn btn-outline-primary btn-sm w-100 fw-bold"><FaCloudUploadAlt className="me-2" /> GÖRSEL SEÇ</label>
                </div>

                {/* VİDEO KAPAK GÖRSELİ */}
                <div className="col-md-6 text-center">
                    <label className="fw-bold small mb-2 d-block text-muted text-uppercase">Video Kutusu Kapağı</label>
                    <div className="border rounded-3 p-2 bg-light shadow-sm mb-2" style={{ height: '150px' }}>
                        {theme.mediaVideoImage ? (
                            <img src={`${BASE_URL}${theme.mediaVideoImage}`} className="w-100 h-100 object-fit-cover rounded" alt="Video Kapak" />
                        ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted small"><FaImage size={30} /></div>
                        )}
                    </div>
                    <input type="file" id="videoCover" hidden onChange={(e) => handleUpload(e.target.files[0], 'video')} />
                    <label htmlFor="videoCover" className="btn btn-outline-primary btn-sm w-100 fw-bold"><FaCloudUploadAlt className="me-2" /> GÖRSEL SEÇ</label>
                </div>
            </div>
        </div>
    );
};

export default MediaManager;