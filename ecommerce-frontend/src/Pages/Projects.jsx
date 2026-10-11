import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [theme, setTheme] = useState(null);
  const BASE_URL = "https://localhost:7137";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, pRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/Theme`),
          axios.get(`${BASE_URL}/api/Projects`)
        ]);
        setTheme(tRes.data);
        setProjects(pRes.data || []);
      } catch (err) { console.error("Veriler yüklenemedi", err); }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const handleProjectClick = (project) => {
    const targetUrl = project.url || project.Url;
    if (targetUrl) {
      const finalUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
      window.open(finalUrl, "_blank");
    } else {
      alert("Bu proje için henüz bir web sitesi adresi eklenmemiş.");
    }
  };

  if (!theme) return null;

  return (
    <div className="min-vh-100 d-flex flex-column bg-white text-start text-dark">
      <Navbar theme={theme} />
      <main className="flex-grow-1" style={{ paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="fw-bold display-4 mb-3">Projelerimiz</h1>
            <p className="text-muted">İncelemek istediğiniz projenin üzerine tıklayarak web sitesine gidebilirsiniz.</p>
          </div>

          <div className="row g-4">
            {projects.map(project => (
              <div key={project.id} className="col-lg-4 col-md-6">
                <div 
                  className="card h-100 border-0 shadow-sm project-card-direct" 
                  onClick={() => handleProjectClick(project)}
                  style={{ cursor: 'pointer', borderRadius: '15px', overflow: 'hidden' }}
                >
                  <div className="position-relative" style={{ height: '250px' }}>
                    <img src={`${BASE_URL}${project.imageUrl}`} className="w-100 h-100 object-fit-cover" alt={project.title} />
                  </div>
                  <div className="card-body p-4 border-top">
                    <div className="small text-muted mb-2"><FaMapMarkerAlt className="me-1 text-primary" /> {project.location}</div>
                    <h5 className="fw-bold mb-3">{project.title}</h5>
                    <div className="text-primary small fw-bold d-flex align-items-center gap-2">
                        WEB SİTESİNİ GÖR <FaExternalLinkAlt size={12} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer theme={theme} />
      <style>{`.project-card-direct:hover { transform: scale(1.02); transition: 0.3s ease; }`}</style>
    </div>
  );
};

export default Projects;