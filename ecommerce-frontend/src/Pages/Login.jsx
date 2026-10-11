import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserLock, FaLock, FaUser, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://localhost:7137/api/Auth/login', {
        username: email,
        passwordHash: password
      });
      
      // Token'ı kaydet
      localStorage.setItem('token', response.data.token);
      
      // KRİTİK: Dashboard'a 'fromLogin' bilgisini göndererek yönlendir
      navigate('/admin', { state: { fromLogin: true }, replace: true }); 
      
    } catch (error) {
      alert("Hatalı kullanıcı adı veya şifre!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 bg-dark d-flex align-items-center justify-content-center">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ width: '400px' }}>
        <div className="p-4 bg-primary text-white text-center">
          <FaUserLock size={40} className="mb-2" />
          <h4 className="fw-bold mb-0">Yönetici Girişi</h4>
        </div>
        <div className="card-body p-4 bg-white">
          <form onSubmit={handleLogin}>
            <div className="mb-3 text-start">
              <label className="form-label small fw-bold text-dark">E-Posta / Kullanıcı Adı</label>
              <div className="input-group border rounded-3 overflow-hidden">
                <span className="input-group-text bg-light border-0"><FaUser className="text-muted" /></span>
                <input 
                  type="text" 
                  className="form-control border-0 shadow-none" 
                  placeholder="Kullanıcı adınızı girin"
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div className="mb-4 text-start">
              <label className="form-label small fw-bold text-dark">Şifre</label>
              <div className="input-group border rounded-3 overflow-hidden">
                <span className="input-group-text bg-light border-0"><FaLock className="text-muted" /></span>
                <input 
                  type="password" 
                  className="form-control border-0 shadow-none" 
                  placeholder="Şifrenizi girin"
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <button className="btn btn-primary w-100 fw-bold py-2 shadow" disabled={loading}>
              {loading ? "Giriş Yapılıyor..." : "GİRİŞ YAP"}
            </button>
          </form>

          <button onClick={() => navigate('/')} className="btn btn-link text-muted text-decoration-none small w-100 mt-3">
             <FaArrowLeft className="me-2" /> Siteye Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;