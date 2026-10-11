import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  FaPlus, FaTrash, FaSave, FaEdit, FaCheck, FaTimes,
  FaImage, FaBars, FaLevelDownAlt, FaChartBar, FaAward 
} from "react-icons/fa";

const NavManager = ({ theme, setTheme, token, BASE_URL, view }) => {
  const [localLinks, setLocalLinks] = useState([]);
  const [localValues, setLocalValues] = useState([]);
  const [newPage, setNewPage] = useState({ label: "", url: "" });
  const [subPage, setSubPage] = useState({ parentIndex: null, label: "", url: "" });
  const [isUploading, setIsUploading] = useState(false);

  const [editMainIndex, setEditMainIndex] = useState(null);
  const [editSubIndex, setEditSubIndex] = useState({ parent: null, child: null });
  const [tempEdit, setTempEdit] = useState({ label: "", url: "" });

  // Verinin sadece bir kez yüklenmesini sağlamak için ref kullanıyoruz
  const isLoaded = useRef(false);

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  };

  // İLK YÜKLEME: Veritabanından gelen verileri sadece bir kez state'e al
  useEffect(() => {
    if (theme && !isLoaded.current) {
      if (theme.navLinks) {
        try {
          const parsed = typeof theme.navLinks === "string" ? JSON.parse(theme.navLinks) : theme.navLinks;
          if (Array.isArray(parsed)) setLocalLinks(parsed);
        } catch { setLocalLinks([]); }
      }
      if (theme.corporateValues) {
        try {
          const parsed = typeof theme.corporateValues === "string" ? JSON.parse(theme.corporateValues) : theme.corporateValues;
          if (Array.isArray(parsed)) setLocalValues(parsed);
        } catch { setLocalValues([]); }
      }
      isLoaded.current = true;
    }
  }, [theme]);

  // Yardımcı fonksiyon: Her değişiklikte hem yerel listeyi hem de ana 'theme' objesini günceller.
  // Bu sayede "GENEL KAYDET" butonuna bastığınızda verileriniz asla silinmez.
  const updateGlobalAndLocal = (type, newData) => {
    if (type === 'nav') {
      setLocalLinks(newData);
      setTheme(prev => ({ ...prev, navLinks: newData }));
    } else if (type === 'corp') {
      setLocalValues(newData);
      setTheme(prev => ({ ...prev, corporateValues: newData }));
    }
  };

  const saveToBackend = async (dataToUpdate) => {
    try {
      const combined = { ...theme, ...dataToUpdate };
      
      const safeStringify = (val) => {
        if (typeof val === 'string') return val;
        return JSON.stringify(val || []);
      };

      const payload = {
        ...combined,
        navLinks: safeStringify(combined.navLinks),
        heroSliderImages: safeStringify(combined.heroSliderImages),
        corporateValues: safeStringify(combined.corporateValues),
        footerData: typeof combined.footerData === 'object' ? JSON.stringify(combined.footerData) : (combined.footerData || "{}")
      };

      await axios.put(`${BASE_URL}/api/Theme`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTheme(payload);
      alert("Değişiklikler başarıyla kaydedildi!");
    } catch (err) { 
      alert("Hata: Kaydedilemedi."); 
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post(`${BASE_URL}/api/Theme/upload`, fd, { headers: { Authorization: `Bearer ${token}` } });
      setTheme({ ...theme, logoUrl: res.data.path });
      alert("Logo yüklendi! Lütfen Üstteki GENEL KAYDET butonuna basarak kalıcı hale getirin.");
    } catch { alert("Yükleme hatası."); } finally { setIsUploading(false); }
  };

  // ANA MENÜ EKLEME FONKSİYONU (DÜZELTİLDİ)
  const addMainPage = () => {
    if (!newPage.label || newPage.label.trim() === "") {
        alert("Lütfen bir menü adı girin.");
        return;
    }
    // URL boşsa varsayılan olarak "/" ekliyoruz
    const newItem = { 
        label: newPage.label.trim(), 
        url: newPage.url.trim() === "" ? "/" : newPage.url.trim(), 
        subLinks: [] 
    };
    const updated = [...localLinks, newItem];
    updateGlobalAndLocal('nav', updated);
    setNewPage({ label: "", url: "" }); // Formu temizle
  };

  // ALT MENÜ EKLEME FONKSİYONU (DÜZELTİLDİ)
  const addSubPage = (index) => {
    if (!subPage.label || subPage.label.trim() === "") return;
    const updated = [...localLinks];
    if (!updated[index].subLinks) updated[index].subLinks = [];
    
    updated[index].subLinks.push({ 
        label: subPage.label.trim(), 
        url: subPage.url.trim() === "" ? "/" : subPage.url.trim() 
    });
    
    updateGlobalAndLocal('nav', updated);
    setSubPage({ parentIndex: null, label: "", url: "" });
  };

  const deleteMainPage = (index) => {
    const updated = localLinks.filter((_, idx) => idx !== index);
    updateGlobalAndLocal('nav', updated);
  };

  const deleteSubPage = (mainIdx, subIdx) => {
    const updated = [...localLinks];
    updated[mainIdx].subLinks.splice(subIdx, 1);
    updateGlobalAndLocal('nav', updated);
  };

  const saveEditMain = (index) => {
    const updated = [...localLinks];
    updated[index] = { ...updated[index], ...tempEdit };
    updateGlobalAndLocal('nav', updated);
    setEditMainIndex(null);
  };

  const saveEditSub = (mainIdx, subIdx) => {
    const updated = [...localLinks];
    updated[mainIdx].subLinks[subIdx] = { ...tempEdit };
    updateGlobalAndLocal('nav', updated);
    setEditSubIndex({ parent: null, child: null });
  };

  return (
    <div className="nav-admin-wrapper p-2 text-start text-dark">
      {view === "design" && (
        <>
          {/* LOGO YÖNETİMİ */}
          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-header bg-white fw-bold small border-bottom d-flex justify-content-between align-items-center">
                <span><FaImage className="me-2" /> LOGO YÖNETİMİ</span>
                <button className="btn btn-success btn-sm fw-bold px-3" onClick={() => saveToBackend({ logoUrl: theme.logoUrl })}>KAYDET</button>
            </div>
            <div className="p-3 d-flex align-items-center justify-content-between bg-white rounded-bottom">
                <div className="border p-2 rounded bg-light d-flex align-items-center justify-content-center" style={{minWidth: '150px', minHeight: '60px', textAlign: 'center'}}>
                    {theme?.logoUrl ? (
                      <img 
                        src={getFullUrl(theme.logoUrl)} 
                        height="45" 
                        style={{ maxWidth: '100%', objectFit: 'contain' }} 
                        alt="Logo" 
                        onError={(e) => { e.target.onerror = null; e.target.src="/logo-fallback.png"; }} 
                      />
                    ) : <span className="small opacity-50">Logo Seçilmedi</span>}
                </div>
                <label className="btn btn-dark btn-sm fw-bold shadow-sm">
                    {isUploading ? 'Yükleniyor...' : 'Yeni Logo Seç'}
                    <input 
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                        disabled={isUploading} 
                    />
                </label>
            </div>
          </div>

          {/* SAYAÇLAR */}
          <div className="card p-3 border-0 shadow-sm mb-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h6 className="fw-bold mb-0 small"><FaChartBar className="me-2"/> SAYAÇLAR</h6>
                <button className="btn btn-primary btn-sm fw-bold px-3" onClick={() => saveToBackend({
                    projectCount: theme.projectCount, customerCount: theme.customerCount,
                    experienceYear: theme.experienceYear, teamCount: theme.teamCount
                })}>KAYDET</button>
            </div>
            <div className="row g-2">
              {['projectCount', 'customerCount', 'experienceYear', 'teamCount'].map(f => (
                <div key={f} className="col-md-6 mb-1">
                  <label className="form-label small fw-bold text-muted">{f}</label>
                  <input type="text" className="form-control form-control-sm" value={theme[f] || ''} onChange={e => setTheme({...theme, [f]: e.target.value})} />
                </div>
              ))}
            </div>
          </div>

          {/* NAVİGASYON MENÜSÜ */}
          <div className="card mb-3 border-0 shadow-sm overflow-hidden">
            <div className="card-header text-white fw-bold small d-flex justify-content-between align-items-center" style={{backgroundColor: '#c5a059'}}>
                <span><FaBars className="me-2" /> NAVİGASYON MENÜSÜ</span>
                <button className="btn btn-light btn-sm fw-bold px-4" style={{color: '#c5a059'}} onClick={() => saveToBackend({ navLinks: localLinks })}>YAYINLA</button>
            </div>
            <div className="p-3 bg-white">
              {/* EKLEME FORMU */}
              <div className="input-group input-group-sm mb-3 shadow-sm">
                <input 
                    className="form-control fw-bold" 
                    placeholder="Menü Adı" 
                    value={newPage.label} 
                    onChange={e => setNewPage({...newPage, label: e.target.value})} 
                />
                <input 
                    className="form-control" 
                    placeholder="/link" 
                    value={newPage.url} 
                    onChange={e => setNewPage({...newPage, url: e.target.value})} 
                />
                <button className="btn btn-success" type="button" onClick={addMainPage}><FaPlus /></button>
              </div>

              {/* LİSTELEME */}
              <div className="menu-list">
                {localLinks.map((link, i) => (
                  <div key={i} className="border rounded mb-3 bg-white shadow-sm overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center p-2 bg-light border-bottom">
                      {editMainIndex === i ? (
                        <div className="d-flex gap-1 flex-grow-1">
                          <input className="form-control form-control-sm fw-bold" value={tempEdit.label} onChange={e => setTempEdit({...tempEdit, label: e.target.value})} />
                          <input className="form-control form-control-sm" value={tempEdit.url} onChange={e => setTempEdit({...tempEdit, url: e.target.value})} />
                          <button className="btn btn-success btn-sm" onClick={() => saveEditMain(i)}><FaCheck/></button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditMainIndex(null)}><FaTimes/></button>
                        </div>
                      ) : (
                        <span className="fw-bold small">{link.label} <span className="text-muted fw-normal ms-1" style={{fontSize:'9px'}}>({link.url})</span></span>
                      )}
                      <div className="d-flex gap-1">
                        <button className="btn btn-link text-dark p-0" onClick={() => { setEditMainIndex(i); setTempEdit({label: link.label, url: link.url}); }}><FaEdit size={12}/></button>
                        <button className="btn btn-outline-primary btn-xs py-0" style={{fontSize: '10px'}} onClick={() => setSubPage({ parentIndex: i, label: "", url: "" })}>+ ALT</button>
                        <button className="btn btn-link text-danger p-0 shadow-none" onClick={() => deleteMainPage(i)}><FaTrash size={12}/></button>
                      </div>
                    </div>

                    {subPage.parentIndex === i && (
                      <div className="p-2 bg-light border-bottom d-flex gap-1">
                        <input className="form-control form-control-sm" placeholder="Alt Menü" value={subPage.label} onChange={e => setSubPage({...subPage, label: e.target.value})} />
                        <input className="form-control form-control-sm" placeholder="/url" value={subPage.url} onChange={e => setSubPage({...subPage, url: e.target.value})} />
                        <button className="btn btn-primary btn-sm" onClick={() => addSubPage(i)}><FaPlus /></button>
                      </div>
                    )}

                    {link.subLinks?.map((sub, j) => (
                      <div key={j} className="d-flex justify-content-between align-items-center py-2 ps-4 pe-2 bg-white border-top border-start border-4 border-primary">
                        {editSubIndex.parent === i && editSubIndex.child === j ? (
                          <div className="d-flex gap-1 flex-grow-1">
                            <input className="form-control form-control-sm" value={tempEdit.label} onChange={e => setTempEdit({...tempEdit, label: e.target.value})} />
                            <input className="form-control form-control-sm" value={tempEdit.url} onChange={e => setTempEdit({...tempEdit, url: e.target.value})} />
                            <button className="btn btn-success btn-sm" onClick={() => saveEditSub(i, j)}><FaCheck/></button>
                          </div>
                        ) : (
                          <span className="small text-dark"><FaLevelDownAlt className="me-2 opacity-50" style={{transform: 'scaleX(-1)'}}/> {sub.label}</span>
                        )}
                        <div className="d-flex gap-1">
                          <button className="btn btn-link text-primary p-0" onClick={() => { setEditSubIndex({parent: i, child: j}); setTempEdit({label: sub.label, url: sub.url}); }}><FaEdit size={12}/></button>
                          <button className="btn btn-link text-danger p-0 shadow-none" onClick={() => deleteSubPage(i, j)}><FaTrash size={10}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* KURUMSAL DEĞERLER */}
      {view === "corporate" && (
        <div className="card mb-2 border-0 shadow-sm overflow-hidden">
          <div className="card-header bg-dark text-white fw-bold small d-flex justify-content-between align-items-center">
              <span><FaAward className="me-2" /> KURUMSAL DEĞERLER</span>
              <div className="d-flex gap-2">
                  <button className="btn btn-light btn-sm fw-bold" style={{fontSize: '10px'}} onClick={() => {
                      if (localValues.length >= 5) return alert("En fazla 5 değer eklenebilir.");
                      const updated = [...localValues, { title: "", description: "" }];
                      updateGlobalAndLocal('corp', updated);
                  }}>+ EKLE</button>
                  <button className="btn btn-success btn-sm fw-bold px-3" onClick={() => saveToBackend({ corporateValues: localValues })}>KAYDET</button>
              </div>
          </div>
          <div className="p-3 bg-white">
              {localValues.map((v, idx) => (
                  <div key={idx} className="border rounded p-2 mb-2 bg-light position-relative">
                      <button className="btn btn-link text-danger p-0 position-absolute top-0 end-0 me-2 mt-1" onClick={() => {
                          const updated = localValues.filter((_, i) => i !== idx);
                          updateGlobalAndLocal('corp', updated);
                      }}>
                          <FaTrash size={12}/>
                      </button>
                      <input className="form-control form-control-sm fw-bold mb-1 border-0 bg-transparent" placeholder="Başlık" value={v.title} onChange={e => { 
                          const updated = [...localValues]; 
                          updated[idx].title = e.target.value; 
                          updateGlobalAndLocal('corp', updated); 
                      }} />
                      <textarea className="form-control form-control-sm border-0 bg-transparent" rows="2" placeholder="Açıklama" value={v.description} onChange={e => { 
                          const updated = [...localValues]; 
                          updated[idx].description = e.target.value; 
                          updateGlobalAndLocal('corp', updated); 
                      }} />
                  </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavManager;