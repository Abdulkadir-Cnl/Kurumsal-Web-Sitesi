import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaChevronRight } from "react-icons/fa";
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [theme, setTheme] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = "https://localhost:7137";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, bRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/Theme`),
          axios.get(`${BASE_URL}/api/Blog`) // Tüm blogları çeker
        ]);
        setTheme(tRes.data);
        setBlogs(bRes.data || []);
      } catch (err) { console.error("Veriler yüklenemedi:", err); }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  if (!theme) return <div className="p-5 text-center">Yükleniyor...</div>;

  return (
    <div className="min-vh-100 d-flex flex-column bg-white overflow-x-hidden">
      <Navbar theme={theme} />
      
      <main className="flex-grow-1" style={{ paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="fw-bold display-4 text-dark mb-3">Blog & Haberler</h1>
            <div className="mx-auto" style={{ width: '80px', height: '4px', backgroundColor: '#c5a059' }}></div>
          </div>

          <div className="row g-4">
            {blogs
              .filter(blog => blog.isVisible) // KRİTİK: Sadece yayındaki blogları gösterir
              .map(blog => (
                <div key={blog.id} className="col-lg-4 col-md-6">
                  <div 
                    className="card h-100 border-0 shadow-sm blog-card-premium" 
                    onClick={() => navigate(`/blog/${blog.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                      <img 
                        src={`${BASE_URL}${blog.imageUrl}`} 
                        className="card-img-top w-100 h-100 object-fit-cover transition-transform" 
                        alt={blog.title} 
                      />
                    </div>
                    <div className="card-body p-4 text-start">
                      <div className="d-flex align-items-center gap-3 text-muted small mb-2">
                        <span><FaCalendarAlt style={{color: '#c5a059'}} className="me-1" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span><FaUser style={{color: '#c5a059'}} className="me-1" /> {blog.author}</span>
                      </div>
                      <h5 className="fw-bold text-dark mb-3">{blog.title}</h5>
                      <div className="fw-bold small d-flex align-items-center" style={{color: '#c5a059'}}>
                        DEVAMINI OKU <FaChevronRight className="ms-2" size={10} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {blogs.filter(b => b.isVisible).length === 0 && (
            <div className="text-center py-5"><p className="text-muted">Henüz yayınlanmış bir yazı bulunmuyor.</p></div>
          )}
        </div>
      </main>

      <Footer theme={theme} />
      <style>{`.blog-card-premium:hover { transform: translateY(-10px); transition: 0.3s; }`}</style>
    </div>
  );
};

export default Blogs;