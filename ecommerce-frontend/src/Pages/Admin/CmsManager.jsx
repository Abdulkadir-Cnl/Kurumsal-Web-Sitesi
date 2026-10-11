import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 
import { FaPlus, FaSave, FaLink, FaExternalLinkAlt, FaFileAlt, FaGlobe, FaImage, FaTrash, FaEdit } from "react-icons/fa";

const CmsManager = ({ token }) => {
  const [pages, setPages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [currentImgs, setCurrentImgs] = useState({ img1: "", img2: "" });
  
  const SITE_URL = window.location.origin; 
  const BACKEND_URL = "https://localhost:7137"; 

  // Kabul edilen tüm resim formatları
  const ACCEPTED_IMAGE_TYPES = "image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif";

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path; // blob: önizleme için eklendi
    const cleanBase = BACKEND_URL.endsWith("/") ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const fetchPages = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/cms`);
      setPages(res.data);
    } catch (err) { console.error("Sayfalar yüklenemedi", err); }
  };

  useEffect(() => { fetchPages(); }, []);

  const handleEdit = (page) => {
    setEditingId(page.id);
    setTitle(page.title);
    setBody(page.body);
    setCurrentImgs({ img1: page.imageUrl1, img2: page.imageUrl2 });
    setImg1(null); setImg2(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); setEditingId(null);
    setTitle(""); setBody(""); setImg1(null); setImg2(null);
    setCurrentImgs({ img1: "", img2: "" });
  };

  const savePage = async () => {
    if (!title) return alert("Başlık boş olamaz");
    const fd = new FormData();
    fd.append("title", title);
    fd.append("slug", title.toLowerCase().trim().replace(/\s+/g, "-"));
    fd.append("body", body);
    if (img1) fd.append("image1", img1);
    if (img2) fd.append("image2", img2);

    try {
      const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };
      if (editingId) await axios.put(`${BACKEND_URL}/cms/${editingId}`, fd, config);
      else await axios.post(`${BACKEND_URL}/cms`, fd, config);
      closeModal(); fetchPages();
    } catch (err) { alert("Hata oluştu."); }
  };

  return (
    <div className="p-3 bg-white text-start shadow-sm rounded">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h6 className="fw-bold mb-0 text-dark"><FaFileAlt className="me-2 text-primary" /> Sayfa Yönetimi</h6>
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm fw-bold"><FaPlus className="me-1" /> YENİ EKLE</button>
      </div>

      <div className="list-group list-group-flush">
        {pages.map((p) => (
          <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center py-3 border-bottom">
            <div className="overflow-hidden pe-3" style={{ maxWidth: '70%' }}>
              <div className="fw-bold text-dark mb-1">{p.title}</div>
              <div className="text-muted small"><span>{SITE_URL}/s/{p.slug}</span></div>
            </div>
            <div className="d-flex gap-2">
              <button onClick={() => handleEdit(p)} className="btn btn-light btn-sm text-success border"><FaEdit /></button>
              <button onClick={() => axios.delete(`${BACKEND_URL}/cms/${p.id}`, {headers:{Authorization:`Bearer ${token}`}}).then(fetchPages)} className="btn btn-light btn-sm text-danger border"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed-top vw-100 vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, backdropFilter: 'blur(5px)' }}>
          <div className="bg-white rounded-4 shadow-lg d-flex flex-column" style={{ width: '95%', maxWidth: '1100px', height: '90vh' }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-4">
              <h5 className="mb-0 fw-bold">{editingId ? "Sayfayı Düzenle" : "Yeni Sayfa Ekle"}</h5>
              <button onClick={closeModal} className="btn-close shadow-none"></button>
            </div>
            <div className="p-4 flex-grow-1 overflow-auto bg-white">
              <div className="row g-4 text-start">
                <div className="col-lg-4">
                  <div className="mb-3"><label className="form-label fw-bold small text-dark">Sayfa Başlığı</label><input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                  
                  {/* Kapak Görseli - TÜM FORMATLAR */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted"><FaImage /> Kapak Görseli (Her Format)</label>
                    <div className="mb-2 border rounded bg-light d-flex align-items-center justify-content-center" style={{height:'100px'}}>
                        {img1 ? <img src={URL.createObjectURL(img1)} className="h-100 object-fit-contain" /> : (currentImgs.img1 && <img src={getFullUrl(currentImgs.img1)} className="h-100 object-fit-contain" />)}
                    </div>
                    <input type="file" accept={ACCEPTED_IMAGE_TYPES} className="form-control form-control-sm" onChange={(e) => setImg1(e.target.files[0])} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted"><FaImage /> Detay Görseli</label>
                    <div className="mb-2 border rounded bg-light d-flex align-items-center justify-content-center" style={{height:'100px'}}>
                        {img2 ? <img src={URL.createObjectURL(img2)} className="h-100 object-fit-contain" /> : (currentImgs.img2 && <img src={getFullUrl(currentImgs.img2)} className="h-100 object-fit-contain" />)}
                    </div>
                    <input type="file" accept={ACCEPTED_IMAGE_TYPES} className="form-control form-control-sm" onChange={(e) => setImg2(e.target.files[0])} />
                  </div>
                </div>
                <div className="col-lg-8">
                  <label className="form-label fw-bold small text-dark">Sayfa İçeriği</label>
                  <div style={{ height: '400px' }} className="text-dark"><ReactQuill theme="snow" value={body} onChange={setBody} modules={modules} className="h-100" /></div>
                </div>
              </div>
            </div>
            <div className="p-3 border-top bg-light d-flex justify-content-end gap-3 rounded-bottom-4">
              <button onClick={closeModal} className="btn btn-secondary px-4 fw-bold">İptal</button>
              <button onClick={savePage} className="btn btn-success px-5 fw-bold"><FaSave className="me-2" /> KAYDET</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsManager;