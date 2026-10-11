import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Contact = () => {
    const [theme, setTheme] = useState(null);
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({ 
        name: '', phone: '', email: '', interestedProject: '', message: '' 
    });
    const BASE_URL = "https://localhost:7137";

    useEffect(() => {
        axios.get(`${BASE_URL}/api/Theme`).then(res => setTheme(res.data));
        axios.get(`${BASE_URL}/api/Projects`).then(res => setProjects(res.data));
    }, []);

    const parsedFooter = theme?.footerData ? JSON.parse(theme.footerData) : {};
    
    const defaultPhone = "+90 540 100 5838";
    const defaultEmail = "satis@leyalmedya.com";
    const defaultAddress = "Yıldırımbeyazıt Mah. Ankara Bul. No:23A Kahramankazan / ANKARA";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/Contact`, formData);
            alert("Mesajınız başarıyla iletildi!");
            setFormData({ name: '', phone: '', email: '', interestedProject: '', message: '' });
        } catch (err) { alert("Bir hata oluştu."); }
    };

    if (!theme) return null;

    return (
        <div className="min-vh-100 d-flex flex-column text-start" style={{ backgroundColor: '#f4f6f9' }}>
            <Navbar theme={theme} />
            
            <main style={{ paddingTop: '120px' }} className="flex-grow-1">
                {/* İLETİŞİM BİLGİ KARTLARI */}
                <div className="container py-4 shadow" style={{ backgroundColor: '#1a2b4c', color: 'white', borderRadius: '15px' }}>
                    <div className="row align-items-center px-3 g-4">
                        <div className="col-lg-2">
                            <h2 className="fw-bold m-0" style={{ color: '#c5a059' }}>İletişim</h2>
                        </div>
                        
                        <div className="col-lg-10">
                            <div className="row g-3 align-items-center">
                                <div className="col-md-4">
                                    <a href={`tel:${(parsedFooter.phone || defaultPhone).replace(/\s/g, '')}`} className="text-white text-decoration-none d-flex align-items-center gap-3">
                                        <div className="rounded-circle border d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', minWidth: '45px' }}>
                                            <FaPhoneAlt size={18} />
                                        </div>
                                        <span className="fw-bold">{parsedFooter.phone || defaultPhone}</span>
                                    </a>
                                </div>
                                
                                <div className="col-md-4">
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsedFooter.address || defaultAddress)}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-white text-decoration-none d-flex align-items-center gap-3"
                                    >
                                        <div className="rounded-circle border d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', minWidth: '45px' }}>
                                            <FaMapMarkerAlt size={18} />
                                        </div>
                                        <span className="fw-bold" style={{ fontSize: '0.85rem' }}>
                                            {parsedFooter.address || defaultAddress}
                                        </span>
                                    </a>
                                </div>

                                <div className="col-md-4">
                                    <a href={`mailto:${parsedFooter.email || defaultEmail}`} className="text-white text-decoration-none d-flex align-items-center gap-3">
                                        <div className="rounded-circle border d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', minWidth: '45px' }}>
                                            <FaEnvelope size={18} />
                                        </div>
                                        <span className="fw-bold">{parsedFooter.email || defaultEmail}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* YENİ HARİTA ALANI */}
                <div className="container mt-5 p-0 shadow-sm border overflow-hidden bg-white" style={{ height: '450px', borderRadius: '15px' }}>
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3047.5379409517323!2d32.6895027!3d40.1970953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x408271aa54d1d251%3A0x295ba88a0e47b97f!2zWcSxbGTEsXLEsW1iZXlhesSxdCwgQW5rYXJhIEJsdi4gTm86MjMsIDA2OTgwIEthaHJhbWFua2F6YW4vQW5rYXJh!5e0!3m2!1str!2str!4v1770640193117!5m2!1str!2str" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ofis Konumu"
                    ></iframe>
                </div>

                {/* FORM ALANI */}
                <div className="container py-5 mt-5 bg-light rounded shadow-sm">
                    <form onSubmit={handleSubmit} className="p-4">
                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold small opacity-75 text-uppercase">Ad Soyad *</label>
                                <input type="text" className="form-control p-3 border-0 shadow-sm" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold small opacity-75 text-uppercase">Telefon *</label>
                                <input type="text" className="form-control p-3 border-0 shadow-sm" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold small opacity-75 text-uppercase">E-Posta</label>
                                <input type="email" className="form-control p-3 border-0 shadow-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold small opacity-75 text-uppercase">İlgilendiğiniz Proje</label>
                                <select className="form-select p-3 border-0 shadow-sm" value={formData.interestedProject} onChange={e => setFormData({...formData, interestedProject: e.target.value})}>
                                    <option value="">-Proje Seçiniz-</option>
                                    {projects.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold small opacity-75 text-uppercase">Mesajınız *</label>
                                <textarea className="form-control p-3 border-0 shadow-sm" rows="4" required placeholder="Size nasıl yardımcı olabiliriz?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="form-check mb-2">
                                <input className="form-check-input" type="checkbox" required />
                                <label className="form-check-label small"><span className="text-danger fw-bold">KVKK Aydınlatma Metni'ni</span> okudum, onaylıyorum.</label>
                            </div>
                        </div>

                        <div className="text-end">
                            <button type="submit" className="btn px-5 py-3 fw-bold text-white shadow" style={{ backgroundColor: '#1a2b4c', letterSpacing: '1px' }}>GÖNDER</button>
                        </div>
                    </form>
                </div>
            </main>
            
            <Footer theme={theme} />
        </div>
    );
};

export default Contact;