import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaCloudUploadAlt, FaImages, FaFolderOpen, FaFilter } from 'react-icons/fa';

const GalleryManager = ({ token, BASE_URL, projects }) => {
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(""); // Seçili proje ID'si

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/Gallery`);
            setImages(res.data || []);
        } catch (err) {
            console.error("Galeri çekilemedi:", err);
        }
    };

    // --- FİLTRELEME MANTIĞI ---
    // Seçili proje varsa ona göre süz, yoksa boş dizi döndür (veya istersen hepsini göster)
    const filteredImages = selectedProjectId 
        ? images.filter(img => img.projectId === parseInt(selectedProjectId)) 
        : [];

        const handleMultipleUpload = async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0 || !selectedProjectId) return;
        
            setIsUploading(true);
            const formData = new FormData();
            files.forEach(file => formData.append("files", file));
            // Backend'in beklediği "projectId" isminde veriyi ekliyoruz
            formData.append("projectId", selectedProjectId); 
        
            try {
                await axios.post(`${BASE_URL}/api/Gallery`, formData, {
                    headers: { 
                        "Authorization": `Bearer ${token}`, 
                        "Content-Type": "multipart/form-data" 
                    }
                });
                fetchGallery();
                alert("Yükleme başarılı!");
            } catch (err) {
                alert("Hata oluştu.");
            } finally {
                setIsUploading(false);
            }
        };

    const deleteImage = async (id) => {
        if (!window.confirm("Bu fotoğrafı galeriden silmek istediğinize emin misiniz?")) return;
        
        try {
            await axios.delete(`${BASE_URL}/api/Gallery/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchGallery();
        } catch (err) {
            alert("Silme işlemi başarısız.");
        }
    };

    return (
        <div className="p-3 text-start">
            {/* PROJE SEÇİM VE FİLTRELEME ALANI */}
            <div className="mb-3 p-3 bg-light rounded-3 border">
                <label className="form-label small fw-bold text-primary d-flex align-items-center gap-2">
                    <FaFolderOpen /> PROJE SEÇİMİ VE FİLTRELEME
                </label>
                <select 
                    className="form-select border-primary shadow-sm"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                    <option value="">-- Görselleri Görmek ve Yüklemek İçin Proje Seçin --</option>
                    {projects && projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>
                {selectedProjectId && (
                    <div className="mt-2 small text-muted">
                        <FaFilter className="me-1" /> Şu an <b>{projects.find(p => p.id === parseInt(selectedProjectId))?.title}</b> projesine ait görselleri yönetiyorsunuz.
                    </div>
                )}
            </div>

            {/* YÜKLEME ALANI */}
            <div className={`mb-4 border-dashed rounded-4 p-4 text-center ${!selectedProjectId ? 'opacity-50' : 'bg-white shadow-sm'}`} style={{ border: '2px dashed #aec90b' }}>
                <input 
                    type="file" 
                    multiple 
                    id="bulkGallery" 
                    hidden 
                    onChange={handleMultipleUpload} 
                    disabled={isUploading || !selectedProjectId} 
                />
                <label htmlFor="bulkGallery" className={selectedProjectId ? "cursor-pointer w-100" : "w-100"}>
                    <FaCloudUploadAlt size={45} className={`${selectedProjectId ? 'text-primary' : 'text-secondary'} mb-3`} />
                    <h6 className="fw-bold mb-1">{isUploading ? 'Yükleniyor...' : 'Fotoğrafları Buraya Yükle'}</h6>
                    <p className="small text-muted mb-0">
                        {selectedProjectId ? 'Dosyaları seçmek için tıklayın.' : 'Yükleme yapabilmek için önce bir proje seçmelisiniz.'}
                    </p>
                </label>
            </div>

            {/* FİLTRELENMİŞ FOTOĞRAF LİSTESİ */}
            <div className="row g-2 overflow-auto" style={{ maxHeight: '450px' }}>
                {!selectedProjectId ? (
                    <div className="col-12 text-center py-5 text-muted border rounded-3 bg-white">
                        <FaFolderOpen size={40} className="mb-2 opacity-20" />
                        <p>Lütfen görselleri listelemek için yukarıdan bir proje seçin.</p>
                    </div>
                ) : filteredImages.length > 0 ? (
                    filteredImages.map((img) => (
                        <div key={img.id} className="col-4 position-relative gallery-admin-item">
                            <div className="ratio ratio-1x1 border rounded-3 overflow-hidden shadow-sm">
                                <img src={`${BASE_URL}${img.imageUrl}`} className="object-fit-cover w-100 h-100" alt="Galeri" />
                            </div>
                            <button 
                                onClick={() => deleteImage(img.id)}
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 shadow-sm p-1 rounded-circle"
                                title="Sil"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5 text-muted border rounded-3 bg-white">
                        <FaImages size={40} className="mb-2 opacity-50" />
                        <p>Bu projeye ait henüz bir fotoğraf bulunamadı.</p>
                    </div>
                )}
            </div>

            <style>{`
                .cursor-pointer { cursor: pointer; }
                .gallery-admin-item:hover img { filter: brightness(0.7); transition: 0.3s; }
                .opacity-20 { opacity: 0.2; }
            `}</style>
        </div>
    );
};

export default GalleryManager;