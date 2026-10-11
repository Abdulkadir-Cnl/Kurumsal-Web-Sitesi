import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 
import { FaPlus, FaSave, FaTrash, FaPenNib, FaImage, FaNewspaper, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";

const BlogManager = ({ token }) => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [isVisible, setIsVisible] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [currentImg, setCurrentImg] = useState("");
  
  const BACKEND_URL = "https://localhost:7137";
  const ACCEPTED_IMAGE_TYPES = "image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif";

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const cleanBase = BACKEND_URL.endsWith("/") ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/Blog`);
      setBlogs(res.data);
    } catch (err) { console.error("Bloglar yüklenemedi", err); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setContent(blog.content);
    setAuthor(blog.author);
    setIsVisible(blog.isVisible);
    setCurrentImg(blog.imageUrl);
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); setEditingId(null);
    setTitle(""); setContent(""); setAuthor("Admin"); setIsVisible(true); setImageFile(null);
    setCurrentImg("");
  };

  const saveBlog = async () => {
    const fd = new FormData();
    fd.append("Title", title);
    fd.append("Content", content);
    fd.append("Author", author);
    fd.append("IsVisible", isVisible);
    if (imageFile) fd.append("ImageFile", imageFile);

    try {
      const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };
      if (editingId) await axios.put(`${BACKEND_URL}/api/Blog/${editingId}`, fd, config);
      else await axios.post(`${BACKEND_URL}/api/Blog`, fd, config);
      closeModal(); fetchBlogs();
    } catch (err) { alert("Hata oluştu."); }
  };

  return (
    <div className="p-3 bg-white text-start shadow-sm rounded">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h6 className="fw-bold mb-0 text-dark"><FaNewspaper className="me-2" /> Blog Yazıları</h6>
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm fw-bold"><FaPlus className="me-1" /> YENİ BLOG EKLE</button>
      </div>

      <div className="list-group list-group-flush">
        {blogs.map((b) => (
          <div key={b.id} className="list-group-item d-flex justify-content-between align-items-center py-2 border-bottom">
            <div className="d-flex align-items-center">
              <img src={getFullUrl(b.imageUrl)} className="rounded me-3 shadow-sm" style={{width: '50px', height: '50px', objectFit: 'cover'}} alt="" />
              <div className="fw-bold text-dark">{b.title}</div>
            </div>
            <div className="d-flex gap-2">
              <button onClick={() => handleEdit(b)} className="btn btn-light btn-sm text-success border"><FaEdit /></button>
              <button onClick={() => axios.delete(`${BACKEND_URL}/api/Blog/${b.id}`, {headers:{Authorization:`Bearer ${token}`}}).then(fetchBlogs)} className="btn btn-light btn-sm text-danger border"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed-top vw-100 vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, backdropFilter: 'blur(5px)' }}>
          <div className="bg-white rounded-4 shadow-lg d-flex flex-column" style={{ width: '95%', maxWidth: '1000px', height: '90vh' }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-4">
              <h5 className="mb-0 fw-bold">Blog Yazısını Düzenle</h5>
              <button onClick={closeModal} className="btn-close shadow-none"></button>
            </div>
            <div className="p-4 flex-grow-1 overflow-auto bg-white">
              <div className="row g-4">
                <div className="col-lg-4 text-start">
                  <div className="mb-3"><label className="form-label fw-bold small">Başlık</label><input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                  <div className="mb-3 text-start">
                    <label className="form-label fw-bold small"><FaImage /> Kapak Fotoğrafı (Her Format)</label>
                    <div className="mb-2 border rounded bg-light d-flex align-items-center justify-content-center" style={{height:'150px'}}>
                        {imageFile ? <img src={URL.createObjectURL(imageFile)} className="h-100 object-fit-contain" /> : (currentImg && <img src={getFullUrl(currentImg)} className="h-100 object-fit-contain" />)}
                    </div>
                    <input type="file" accept={ACCEPTED_IMAGE_TYPES} className="form-control" onChange={(e) => setImageFile(e.target.files[0])} />
                  </div>
                </div>
                <div className="col-lg-8 text-start">
                  <label className="form-label fw-bold small">İçerik</label>
                  <div style={{ height: '400px' }}><ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} className="h-100" /></div>
                </div>
              </div>
            </div>
            <div className="p-3 border-top bg-light d-flex justify-content-end gap-3 rounded-bottom-4">
              <button onClick={closeModal} className="btn btn-secondary px-4 fw-bold shadow-none">İptal</button>
              <button onClick={saveBlog} className="btn btn-success px-5 fw-bold shadow-sm">KAYDET</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;