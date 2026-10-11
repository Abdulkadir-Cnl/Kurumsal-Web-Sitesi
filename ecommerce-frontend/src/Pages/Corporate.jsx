import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Corporate = () => {
  const [theme, setTheme] = useState(null);
  const BASE_URL = "https://localhost:7137";

  useEffect(() => {
    axios.get(`${BASE_URL}/api/Theme`).then(res => setTheme(res.data));
    window.scrollTo(0, 0);
  }, []);

  if (!theme) return null;

  return (
    <div className="min-vh-100 d-flex flex-column bg-white text-center">
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&display=swap" rel="stylesheet" />
      <Navbar theme={theme} />
      <main style={{ paddingTop: '160px', paddingBottom: '100px' }} className="container">
        <div className="d-flex flex-column align-items-center mb-5">
          <div style={{ width: '40px', height: '4px', backgroundColor: '#c5a059', marginBottom: '20px' }}></div>
          <h2 className="fw-bold mb-4" style={{ color: '#14213d' }}>HAKKIMIZDA</h2>
          <p className="col-lg-10 lh-lg text-muted fs-5">{theme.satisfactionText}</p>
        </div>

        <div className="row mt-5 g-5">
          <div className="col-md-6 text-start px-4">
            <h3 className="script-title">Misyonumuz</h3>
            <p className="text-muted">{theme.mission}</p>
          </div>
          <div className="col-md-6 text-end px-4">
            <h3 className="script-title">Vizyonumuz</h3>
            <p className="text-muted">{theme.vision}</p>
          </div>
        </div>
      </main>
      <Footer theme={theme} />
      <style>{`.script-title { font-family: 'Dancing Script', cursive; font-size: 3.5rem; color: #1a3b6e; }`}</style>
    </div>
  );
};

export default Corporate;