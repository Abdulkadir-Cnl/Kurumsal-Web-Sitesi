import React from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaLink } from "react-icons/fa";

const ProjectManager = ({ projects, formData, setFormData, handleSave, startEdit, handleDelete, editingId, BASE_URL, token, fetchData }) => {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-3 text-start text-dark">
      <div className="card p-3 border-0 bg-light shadow-sm mb-4">
        <h6 className="fw-bold mb-3 border-bottom pb-2">Proje Ekle / Düzenle</h6>
        <div className="mb-3">
          <label className="form-label small fw-bold">Proje Başlığı</label>
          <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} placeholder="Proje adını giriniz..." />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold">Konum</label>
          <input type="text" name="location" className="form-control" value={formData.location} onChange={handleInputChange} placeholder="Örn: Ankara / Yenimahalle" />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold text-primary"><FaLink className="me-1"/> Proje Linki (Harici URL)</label>
          <input type="text" name="url" className="form-control" value={formData.url || ''} onChange={handleInputChange} placeholder="https://..." />
        </div>
        
        <div className="mb-3">
          <label className="form-label small fw-bold">Açıklama</label>
          <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleInputChange} placeholder="Proje detaylarını yazınız..." />
        </div>
        
        <div className="mb-3">
          <label className="form-label small fw-bold">Kapak Görseli</label>
          <input type="file" className="form-control" onChange={(e) => setFormData({...formData, imageFile: e.target.files[0]})} />
        </div>

        <button className={`btn w-100 fw-bold ${editingId ? 'btn-warning' : 'btn-success'} shadow-sm`} onClick={handleSave}>
          <FaSave className="me-2" /> {editingId ? "DEĞİŞİKLİKLERİ GÜNCELLE" : "YENİ PROJEYİ KAYDET"}
        </button>
      </div>

      <h6 className="fw-bold mb-3 border-bottom pb-2">Kayıtlı Projeler</h6>
      <div className="list-group shadow-sm">
        {projects.length === 0 ? (
          <div className="text-center p-4 opacity-50 small">Henüz proje eklenmemiş.</div>
        ) : projects.map(p => (
          <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center p-2 bg-white border">
            <div className="d-flex align-items-center">
              <img src={`${BASE_URL}${p.imageUrl}`} width="45" height="45" className="rounded me-2 object-fit-cover shadow-sm" alt="" />
              <div>
                <div className="fw-bold small">{p.title}</div>
              </div>
            </div>
            <div className="d-flex gap-1">
              <button className="btn btn-light btn-sm text-primary border p-1" onClick={() => startEdit(p)} title="Düzenle"><FaEdit size={14}/></button>
              <button className="btn btn-light btn-sm text-danger border p-1" onClick={() => handleDelete(p.id)} title="Sil"><FaTrash size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;