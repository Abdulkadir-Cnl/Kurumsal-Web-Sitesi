import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FaCalendarAlt, FaUser, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [theme, setTheme] = useState(null);
  const navigate = useNavigate();
  const BACKEND_URL = "https://localhost:7137";

  useEffect(() => {
    // Blog ve Tema verilerini çek
    axios.get(`${BACKEND_URL}/api/Blog`).then(res => {
      const found = res.data.find(b => b.id.toString() === id);
      setBlog(found);
    });
    axios.get(`${BACKEND_URL}/api/Theme`).then(r => setTheme(r.data));
    window.scrollTo(0, 0);
  }, [id]);

  if (!blog || !theme) return <div className="p-5 text-center">Yükleniyor...</div>;

  return (
    <div className="min-vh-100 d-flex flex-column bg-white overflow-x-hidden">
      <Navbar theme={theme} />
      
      {/* Hero Header Bölümü */}
      <div className="position-relative" style={{ marginTop: '100px', height: '400px', backgroundColor: '#1a2b4c' }}>
        <img 
          src={`${BACKEND_URL}${blog.imageUrl}`} 
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-50" 
          alt={blog.title} 
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white px-4 text-center">
          <h1 className="display-3 fw-bold mb-3" style={{ color: '#c5a059' }}>{blog.title}</h1>
          <div className="d-flex align-items-center gap-3 small fw-bold text-uppercase tracking-wider">
             <span><FaCalendarAlt className="me-1"/> {new Date(blog.createdAt).toLocaleDateString()}</span>
             <span className="opacity-50">|</span>
             <span><FaUser className="me-1"/> {blog.author}</span>
          </div>
        </div>
      </div>

      <main className="container flex-grow-1 py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Geri Dön Butonu */}
            <button 
              onClick={() => navigate('/bloglar')} 
              className="btn btn-link text-primary p-0 mb-4 fw-bold text-decoration-none d-flex align-items-center"
            >
              <FaChevronLeft className="me-2" /> LİSTEYE GERİ DÖN
            </button>

            {/* İçerik */}
            <div 
              className="blog-content fs-5 text-dark lh-lg"
              style={{ wordWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
          </div>
        </div>
      </main>

      <Footer theme={theme} />
      
      <style>{`
        .blog-content img { max-width: 100%; height: auto; border-radius: 10px; margin: 20px 0; }
        .text-primary { color: #c5a059 !important; }
      `}</style>
    </div>
  );
};

export default BlogDetail;