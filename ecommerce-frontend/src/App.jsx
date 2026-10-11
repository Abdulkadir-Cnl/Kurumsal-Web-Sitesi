import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Sayfa Importları
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Admin/Dashboard";
import CmsView from "./Pages/CmsView";
import Projects from "./Pages/Projects";
import Blogs from "./Pages/Blogs";
import BlogDetail from "./Pages/BlogDetail";
import Contact from "./Pages/Contact";
import Satisfaction from './Pages/Satisfaction';
import Media from "./Pages/Media";
import Gallery from "./Pages/Gallery";
import Customer from "./Pages/Customer";
import Video from "./Pages/Video";
import Catalogs from "./Pages/Catalogs"; 
import Corporate from "./Pages/Corporate";
import FloatingActions from "./Pages/FloatingActions"; 

// Yardımcı Bileşen: Lokasyon takibi ve Buton Gizleme için
const AppContent = ({ theme }) => {
  const location = useLocation();
  
  // Yüzen butonların gizleneceği sayfalar: Admin paneli ve Login sayfası
  const isHidePath = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/s/:slug" element={<CmsView />} />
        <Route path="/projeler" element={<Projects />} />
        <Route path="/bloglar" element={<Blogs />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/musteri-memnuniyeti" element={<Satisfaction />} />
        <Route path="/hakkimizda" element={<Corporate />} />
        <Route path="/medya" element={<Media />} />
        <Route path="/musteri-videolari" element={<Customer />} />
        <Route path="/video" element={<Video />} />
        <Route path="/galeri" element={<Gallery />} />
        <Route path="/kataloglar" element={<Catalogs />} /> 
      </Routes>
      
      {/* Sadece tema yüklendiyse ve yasaklı yollarda değilsek butonları göster */}
      {theme && !isHidePath && <FloatingActions theme={theme} />}
    </>
  );
};

function App() {
  const [theme, setTheme] = useState(null); 
  const BASE_URL = "https://localhost:7137"; 

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/Theme`);
        setTheme(res.data);
      } catch (err) {
        console.error("Tema verisi çekilemedi:", err);
      }
    };
    fetchTheme();
  }, []);

  return (
    <Router>
      <AppContent theme={theme} />
    </Router>
  );
}

export default App;