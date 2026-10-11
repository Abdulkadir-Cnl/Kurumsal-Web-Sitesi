import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilePdf, FaTrash, FaCloudUploadAlt, FaEdit } from 'react-icons/fa';

const CatalogManager = ({ theme, setTheme, token, BASE_URL }) => {
    const [catalogs, setCatalogs] = useState([]);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => { 
        fetchCatalogs(); 
    }, []);

    const fetchCatalogs = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/Catalog`);
            setCatalogs(res.data || []);
        } catch (error) {
            setCatalogs([]);
        }
    };

    const handleUpload = async () => {
        if (!title || !file) return alert("Başlık ve PDF dosyası seçin!");
        
        setUploading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        try {
            await axios.post(`${BASE_URL}/api/Catalog/add`, formData, {
                headers: { 
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "multipart/form-data" 
                }
            });
            setTitle(""); 
            setFile(null); 
            const fileInput = document.getElementById('catalogFileInput');
            if (fileInput) fileInput.value = '';
            
            await fetchCatalogs();
            alert("Katalog yüklendi.");
        } catch (err) { 
            alert("Yükleme hatası!"); 
        } finally {
            setUploading(false);
        }
    };

    const deleteCatalog = async (id) => {
        if (!window.confirm("Silinsin mi?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/Catalog/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setCatalogs(prev => prev.filter(c => c.id !== id));
        } catch { 
            alert("Silinemedi."); 
        }
    };

    // --- HATA ÖNLEYİCİ KONTROL ---
    // Eğer theme henüz Dashboard'dan gelmediyse beyaz ekran vermemesi için yükleme yazısı gösterir.
    if (!theme) {
        return <div className="p-4 text-center text-muted">Veriler hazırlanıyor...</div>;
    }

    return (
        <div className="p-3 text-start text-dark">
            {/* 1. TANITIM METNİ ALANI */}
            <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <FaEdit className="text-primary" /> Katalog Sayfası Tanıtım Metni
                </h6>
                <textarea 
                    className="form-control mb-2" 
                    rows="3"
                    placeholder="Kataloglar sayfasındaki açıklama..."
                    // theme?.catalogText kullanımı ile undefined hatası engellenir
                    value={theme?.catalogText || ""} 
                    onChange={(e) => setTheme({ ...theme, catalogText: e.target.value })}
                ></textarea>
                <small className="text-muted">* Değişiklik sonrası <b>GENEL KAYDET</b>'e basın.</small>
            </div>

            <hr className="my-4" />

            {/* 2. PDF YÜKLEME FORMU */}
            <div className="bg-light p-3 rounded-4 shadow-sm mb-4 border">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <FaFilePdf className="text-danger" /> Yeni Katalog (PDF) Ekle
                </h6>
                <input 
                    type="text" 
                    className="form-control mb-2" 
                    placeholder="Katalog Başlığı" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                />
                <input 
                    id="catalogFileInput"
                    type="file" 
                    className="form-control mb-3" 
                    accept=".pdf" 
                    onChange={e => setFile(e.target.files[0])} 
                />
                <button 
                    onClick={handleUpload} 
                    disabled={uploading}
                    className="btn btn-primary w-100 fw-bold border-0 py-2 shadow-sm" 
                    style={{ backgroundColor: '#aec90b' }}
                >
                    {uploading ? "Yükleniyor..." : "KATALOĞU SİSTEME YÜKLE"}
                </button>
            </div>

            {/* 3. LİSTELEME */}
            <div className="overflow-auto border rounded bg-white shadow-sm" style={{ maxHeight: '350px' }}>
                <p className="small text-muted p-2 mb-0 fw-bold border-bottom bg-light text-dark">
                    YÜKLÜ KATALOGLAR ({catalogs.length})
                </p>
                {catalogs.length === 0 ? (
                    <div className="p-4 text-center text-muted small">Katalog bulunamadı.</div>
                ) : (
                    catalogs.map(c => (
                        <div key={c.id} className="d-flex justify-content-between align-items-center p-3 border-bottom text-dark">
                            <div className="d-flex align-items-center gap-3 overflow-hidden">
                                <FaFilePdf className="text-danger fs-4 flex-shrink-0" />
                                <small className="fw-bold text-truncate">{c.title}</small>
                            </div>
                            <button onClick={() => deleteCatalog(c.id)} className="btn btn-outline-danger btn-sm border-0">
                                <FaTrash />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CatalogManager;