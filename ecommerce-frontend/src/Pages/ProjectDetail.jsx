import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaGlobe, FaArrowLeft, FaInfoCircle, FaLink } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [theme, setTheme] = useState(null);
    const BASE_URL = "https://localhost:7137";

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const [pRes, tRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/Projects/${id}`),
                    axios.get(`${BASE_URL}/api/Theme`)
                ]);
                setProject(pRes.data);
                setTheme(tRes.data);
            } catch (err) { console.error("Veri çekme hatası:", err); }
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [id]);

    if (!project || !theme) return <div className="p-5 text-center text-dark fw-bold">Yükleniyor...</div>;

    const projectExternalUrl = project.url || project.Url || "";

    return (
        <div className="bg-white text-start text-dark min-vh-100 d-flex flex-column">
            <Navbar theme={theme} />
            
            <main style={{ paddingTop: '140px' }} className="flex-grow-1 container pb-5">
                <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-muted mb-4 p-0 d-flex align-items-center shadow-none">
                    <FaArrowLeft className="me-2" /> Projelere Geri Dön
                </button>

                <div className="row g-5">
                    <div className="col-lg-7">
                        <div className="position-relative">
                            <img src={`${BASE_URL}${project.imageUrl}`} className="img-fluid rounded-4 shadow-lg w-100" alt={project.title} />
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="mb-2 text-primary fw-bold d-flex align-items-center">
                            <FaMapMarkerAlt className="me-2" /> {project.location?.toUpperCase()}
                        </div>
                        <h1 className="fw-bold display-5 mb-4">{project.title}</h1>
                        
                        <div className="p-4 bg-light rounded-4 mb-4 border shadow-sm">
                            <h5 className="fw-bold mb-3 d-flex align-items-center">
                                <FaInfoCircle className="me-2 text-primary" /> Proje Detayları
                            </h5>
                            <p className="lh-lg opacity-75" style={{ whiteSpace: 'pre-wrap' }}>
                                {project.description}
                            </p>
                        </div>

                        {projectExternalUrl ? (
                            <a 
                                href={projectExternalUrl.startsWith('http') ? projectExternalUrl : `https://${projectExternalUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-dark btn-lg w-100 fw-bold py-3 shadow d-flex align-items-center justify-content-center gap-2"
                            >
                                <FaGlobe /> PROJE WEB SİTESİNİ GÖRÜNTÜLE
                            </a>
                        ) : (
                            <div className="alert alert-secondary small py-2 text-center opacity-75">
                                <FaLink className="me-2" /> Bu proje için harici bir URL eklenmemiş.
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer theme={theme} />
        </div>
    );
};

export default ProjectDetail;