import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaYoutube, FaEdit } from 'react-icons/fa';

const CustomerManager = ({ theme, setTheme, token, BASE_URL }) => {
    const [customers, setCustomers] = useState([]);
    const [newCustomer, setNewCustomer] = useState({ 
        title: '', 
        youtubeUrl: '', 
        category: 'Satisfaction' 
    });

    useEffect(() => { 
        fetchCustomers(); 
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/Videos`);
            // Sadece 'Satisfaction' kategorisinde olanları filtrele
            const filtered = (res.data || []).filter(v => v.category === 'Satisfaction');
            setCustomers(filtered);
        } catch (error) { 
            console.error("Videolar yüklenemedi:", error);
            setCustomers([]); 
        }
    };

    const handleAddCustomer = async () => {
        if (!newCustomer.youtubeUrl || !newCustomer.title) return alert("Hata! Alanları doldurun.");
        try {
            // Kayıt sırasında kategoriyi Satisfaction olarak mühürlüyoruz
            await axios.post(`${BASE_URL}/api/Videos`, { ...newCustomer, category: 'Satisfaction' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewCustomer({ title: '', youtubeUrl: '', category: 'Satisfaction' });
            fetchCustomers();
            alert("Müşteri videosu eklendi.");
        } catch { 
            alert("Ekleme başarısız."); 
        }
    };

    const deleteCustomer = async (id) => {
        if (!window.confirm("Silinsin mi?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/Videos/${id}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setCustomers(prev => prev.filter(c => c.id !== id));
        } catch { 
            alert("Silinemedi."); 
        }
    };

    return (
        <div className="p-3 text-start text-dark">
            {/* --- GERİ GETİRİLEN YAZI DÜZENLEME ALANI --- */}
            <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <FaEdit className="text-primary" /> Müşteri Memnuniyeti Tanıtım Metni
                </h6>
                <textarea 
                    className="form-control mb-2" 
                    rows="3"
                    placeholder="Sayfanın üst kısmında görünecek açıklamayı buraya yazın..."
                    value={theme.satisfactionText || ""}
                    onChange={(e) => setTheme({ ...theme, satisfactionText: e.target.value })}
                ></textarea>
                <small className="text-muted italic">
                    * Yazıyı güncelledikten sonra panelin üstündeki <strong>GENEL KAYDET</strong> butonuna basmayı unutmayın.
                </small>
            </div>

            <hr className="my-4" />

            {/* --- VİDEO EKLEME FORMU --- */}
            <div className="bg-light p-3 rounded-4 shadow-sm mb-4 border">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <FaYoutube className="text-danger" /> Yeni Müşteri Videosu Ekle
                </h6>
                <input 
                    type="text" 
                    className="form-control mb-2" 
                    placeholder="Müşteri Adı" 
                    value={newCustomer.title} 
                    onChange={e => setNewCustomer({...newCustomer, title: e.target.value})} 
                />
                <input 
                    type="text" 
                    className="form-control mb-2" 
                    placeholder="YouTube URL" 
                    value={newCustomer.youtubeUrl} 
                    onChange={e => setNewCustomer({...newCustomer, youtubeUrl: e.target.value})} 
                />
                <button 
                    onClick={handleAddCustomer} 
                    className="btn btn-primary w-100 fw-bold border-0" 
                    style={{ backgroundColor: '#aec90b' }}
                >
                    MÜŞTERİ LİSTESİNE EKLE
                </button>
            </div>

            {/* --- LİSTELEME ALANI --- */}
            <div className="video-list overflow-auto border rounded bg-white" style={{ maxHeight: '300px' }}>
                <p className="small text-muted p-2 mb-0 fw-bold border-bottom bg-light">
                    MÜŞTERİ YORUMLARI ({customers.length})
                </p>
                {customers.length === 0 ? (
                    <div className="p-3 text-center text-muted small">Gösterilecek video bulunamadı.</div>
                ) : (
                    customers.map(v => (
                        <div key={v.id} className="d-flex justify-content-between align-items-center p-3 border-bottom">
                            <div className="text-truncate me-2 text-start">
                                <small className="fw-bold d-block">{v.title}</small>
                                <small className="text-muted small d-block">{v.youtubeUrl}</small>
                            </div>
                            <button 
                                onClick={() => deleteCustomer(v.id)} 
                                className="btn btn-outline-danger btn-sm border-0"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerManager;