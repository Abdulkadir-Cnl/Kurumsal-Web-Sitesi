import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaDownload, FaFilePdf } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Catalogs = () => {
    const [catalogs, setCatalogs] = useState([]);
    const [theme, setTheme] = useState(null);
    const BASE_URL = "https://localhost:7137";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cRes, tRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/Catalog`),
                    axios.get(`${BASE_URL}/api/Theme`)
                ]);
                setCatalogs(cRes.data || []);
                setTheme(tRes.data);
            } catch (err) {
                console.error("Veri çekme hatası:", err);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    // PDF'i yeni sekmede açan fonksiyon
    const handleViewPdf = (pdfUrl) => {
        window.open(`${BASE_URL}${pdfUrl}`, "_blank");
    };

    if (!theme) return null;

    return (
        <div className="bg-white min-vh-100 d-flex flex-column text-start">
            <Navbar theme={theme} />
            
            <main style={{ paddingTop: '140px' }} className="container flex-grow-1 pb-5 text-center">
                <div className="mb-5">
                    <h1 className="fw-bold display-5 text-dark text-uppercase">KURUMSAL KATALOGLAR</h1>
                    <div style={{ width: '60px', height: '4px', backgroundColor: '#aec90b' }} className="mx-auto mt-3"></div>
                </div>

                <div className="row g-4 justify-content-center">
                    {catalogs.length === 0 ? (
                        <p className="text-muted">Henüz katalog yüklenmemiş.</p>
                    ) : (
                        catalogs.map(c => (
                            <div key={c.id} className="col-md-6 col-lg-4">
                                <div className="p-4 border rounded-4 shadow-sm bg-light h-100 d-flex flex-column align-items-center">
                                    <div className="bg-white p-4 rounded-circle mb-3 shadow-sm">
                                        <FaFilePdf size={50} className="text-danger" />
                                    </div>
                                    <h5 className="fw-bold text-dark mb-4">{c.title}</h5>
                                    <div className="mt-auto d-flex gap-2 w-100">
                                        {/* Yeni sekmede açma fonksiyonu buraya bağlandı */}
                                        <button 
                                            onClick={() => handleViewPdf(c.pdfUrl)} 
                                            className="btn btn-outline-dark flex-grow-1 fw-bold border-2"
                                        >
                                            <FaEye className="me-2" /> GÖRÜNTÜLE
                                        </button>
                                        <a href={`${BASE_URL}${c.pdfUrl}`} download className="btn btn-primary flex-grow-1 fw-bold border-0" style={{ backgroundColor: '#aec90b' }}>
                                            <FaDownload className="me-2" /> İNDİR
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            <Footer theme={theme} />
        </div>
    );
};

export default Catalogs;