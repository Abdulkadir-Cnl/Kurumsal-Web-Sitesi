import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaEnvelopeOpenText, FaUser, FaPhoneAlt, FaEnvelope, 
  FaProjectDiagram, FaTimes, FaSearchPlus, FaTrash 
} from 'react-icons/fa';

const MessageManager = ({ token }) => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const BASE_URL = "https://localhost:7137";

    const fetchMessages = () => {
        axios.get(`${BASE_URL}/api/Contact`, { headers: { Authorization: `Bearer ${token}` }})
             .then(res => setMessages(res.data));
    };

    useEffect(() => { fetchMessages(); }, [token]);

    // --- SİLME FONKSİYONU ---
    const handleDelete = async (id) => {
        if (!window.confirm("Bu mesajı kalıcı olarak silmek istediğinize emin misiniz?")) return;

        try {
            await axios.delete(`${BASE_URL}/api/Contact/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Mesaj başarıyla silindi.");
            fetchMessages(); // Listeyi güncelle
            if (selectedMessage?.id === id) setSelectedMessage(null); // Modal açıksa kapat
        } catch (err) {
            alert("Silme işlemi sırasında bir hata oluştu.");
        }
    };

    const closeModal = () => setSelectedMessage(null);

    return (
        <div className="p-3 bg-white text-start">
            <h6 className="fw-bold mb-4 border-bottom pb-2">
                <FaEnvelopeOpenText className="me-2 text-primary" /> Gelen Müşteri Mesajları
            </h6>

            <div className="table-responsive">
                <table className="table table-hover border small align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th style={{width: '150px'}}>Tarih</th>
                            <th>Müşteri</th>
                            <th>İlgilendiği Proje</th>
                            <th>Mesaj Özeti</th>
                            <th className="text-center">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map(m => (
                            <tr key={m.id}>
                                <td className="small text-muted">{new Date(m.createdAt).toLocaleString()}</td>
                                <td>
                                    <div className="fw-bold">{m.name}</div>
                                    <div className="text-muted small">{m.phone}</div>
                                </td>
                                <td><span className="badge bg-primary opacity-75">{m.interestedProject || "Genel"}</span></td>
                                <td className="text-muted">
                                    {m.message.length > 30 ? m.message.substring(0, 30) + "..." : m.message}
                                </td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center gap-2">
                                        <button 
                                            className="btn btn-outline-primary btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm"
                                            onClick={() => setSelectedMessage(m)}
                                            title="Detayları Gör"
                                        >
                                            <FaSearchPlus />
                                        </button>
                                        {/* SİLME BUTONU */}
                                        <button 
                                            className="btn btn-outline-danger btn-sm shadow-sm"
                                            onClick={() => handleDelete(m.id)}
                                            title="Mesajı Sil"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {messages.length === 0 && (
                <div className="text-center p-5 opacity-50 border rounded bg-light">
                    Henüz bir mesaj bulunmuyor.
                </div>
            )}

            {/* MESAJ DETAY MODALI */}
            {selectedMessage && (
                <div 
                    className="fixed-top vw-100 vh-100 d-flex align-items-center justify-content-center" 
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2100, backdropFilter: 'blur(4px)' }}
                    onClick={closeModal}
                >
                    <div 
                        className="bg-white rounded-4 shadow-lg overflow-hidden animate__animated animate__zoomIn" 
                        style={{ width: '90%', maxWidth: '600px' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-3 bg-dark text-white d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <FaEnvelopeOpenText className="text-primary" /> Mesaj Detayları
                            </h6>
                            <button className="btn btn-link text-white p-0" onClick={closeModal}><FaTimes /></button>
                        </div>

                        <div className="p-4 text-dark text-start">
                            <div className="row g-3">
                                <div className="col-12 border-bottom pb-2">
                                    <div className="small text-muted fw-bold mb-1"><FaUser className="me-1"/> AD SOYAD</div>
                                    <div className="fw-bold fs-5 text-primary">{selectedMessage.name}</div>
                                </div>
                                <div className="col-md-6 border-bottom pb-2">
                                    <div className="small text-muted fw-bold mb-1"><FaPhoneAlt className="me-1"/> TELEFON</div>
                                    <div className="fw-bold">{selectedMessage.phone}</div>
                                </div>
                                <div className="col-md-6 border-bottom pb-2">
                                    <div className="small text-muted fw-bold mb-1"><FaEnvelope className="me-1"/> E-POSTA</div>
                                    <div className="fw-bold text-truncate">{selectedMessage.email || "-"}</div>
                                </div>
                                <div className="col-12 border-bottom pb-2">
                                    <div className="small text-muted fw-bold mb-1"><FaProjectDiagram className="me-1"/> İLGİLENDİĞİ PROJE</div>
                                    <div className="badge bg-primary fs-6">{selectedMessage.interestedProject || "Genel"}</div>
                                </div>
                                <div className="col-12 bg-light p-3 rounded border">
                                    <div className="small text-muted fw-bold mb-2">MESAJ İÇERİĞİ</div>
                                    <div className="lh-lg" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-light d-flex justify-content-between align-items-center">
                            <button className="btn btn-danger btn-sm fw-bold px-3" onClick={() => handleDelete(selectedMessage.id)}>
                                <FaTrash className="me-2" /> BU MESAJI SİL
                            </button>
                            <button className="btn btn-secondary btn-sm px-4 fw-bold" onClick={closeModal}>KAPAT</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageManager;