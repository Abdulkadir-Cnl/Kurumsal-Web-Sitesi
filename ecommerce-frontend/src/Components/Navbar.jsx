import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ theme, isPreview = false }) => {
  const BASE_URL = "https://localhost:7137";
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    if (!isPreview) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPreview]);

  // Veriyi güvenli çek: Eğer veri silindiyse boş dizi döner, böylece "TRinvest" yazısına düşmez
  const navLinks = React.useMemo(() => {
    if (!theme || !theme.navLinks) return [];
    try {
      const data = typeof theme.navLinks === "string" ? JSON.parse(theme.navLinks) : theme.navLinks;
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  }, [theme?.navLinks]);

  const toggleSubMenu = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  const navClasses = `navbar p-0 fixed-top transition-all ${scrolled || isPreview ? 'scrolled-nav shadow-lg' : 'default-nav'}`;

  return (
    <nav className={navClasses} style={{ zIndex: 1050 }}>
      <div className="container-fluid px-lg-5 px-3 d-flex align-items-center" style={{ height: '100px' }}>
        
        <div className="flex-grow-1" style={{ flexBasis: 0 }}>
          <Link className="navbar-brand d-inline-flex align-items-center text-decoration-none" to="/">
            {theme?.logoUrl ? (
              <img 
                src={theme.logoUrl.startsWith('http') ? theme.logoUrl : `${BASE_URL}${theme.logoUrl}`} 
                alt="Logo" 
                className="img-fluid logo-glow transition-all" 
                style={{ maxHeight: scrolled ? '55px' : '70px' }} 
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            {(!theme?.logoUrl) && (
                <div className="d-flex align-items-center text-white fw-bold fs-3"></div>
            )}
            {/* Logo yüklense bile bir hata olursa görünecek gizli text */}
            <div className="text-white fw-bold fs-3" style={{display: 'none'}}>Leyal Medya</div>
          </Link>
        </div>

        <div className="d-none d-lg-flex justify-content-center">
          <ul className="d-flex list-unstyled m-0 p-0 align-items-center gap-5">
            {navLinks.map((link, i) => {
              const hasSublinks = link.subLinks && link.subLinks.length > 0;
              return (
                <li key={i} className="nav-item-wrapper position-relative">
                  <Link
                    className="nav-custom-link text-white fw-bold text-uppercase text-decoration-none d-flex align-items-center"
                    style={{ fontSize: "15px", letterSpacing: "1px" }}
                    to={hasSublinks ? "#" : link.url}
                  >
                    {link.label}
                    {hasSublinks && <FaChevronDown className="ms-2 arrow-icon transition-all" size={10} />}
                  </Link>

                  {hasSublinks && (
                    <div className="dropdown-menu-custom">
                      <div className="dropdown-inner shadow-2xl">
                        <ul className="list-unstyled m-0 p-3">
                          {link.subLinks.map((sub, j) => (
                            <li key={j} className="mb-1">
                              <Link to={sub.url} className="dropdown-item-custom d-flex align-items-center px-3 py-2 rounded-3 text-decoration-none">
                                <span className="sub-line me-2"></span>
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex-grow-1 d-flex justify-content-end align-items-center" style={{ flexBasis: 0 }}>
            <button 
                className="d-lg-none btn text-white p-0 border-0 shadow-none" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ fontSize: '28px' }}
            >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
        </div>
      </div>

      <div className={`mobile-menu-overlay d-lg-none ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
              <ul className="list-unstyled p-4">
                  {navLinks.map((link, i) => {
                      const hasSublinks = link.subLinks && link.subLinks.length > 0;
                      const isOpen = activeSubMenu === i;
                      
                      return (
                          <li key={i} className="mb-3 border-bottom border-secondary pb-2">
                              <div className="d-flex justify-content-between align-items-center">
                                  <Link 
                                    to={hasSublinks ? "#" : link.url} 
                                    className="text-white fw-bold text-uppercase text-decoration-none fs-5 d-flex align-items-center justify-content-between w-100"
                                    onClick={(e) => {
                                      if (hasSublinks) {
                                        e.preventDefault();
                                        toggleSubMenu(i);
                                      } else {
                                        setIsMobileMenuOpen(false);
                                      }
                                    }}
                                  >
                                      {link.label}
                                      {hasSublinks && (
                                        <FaChevronDown 
                                          size={14} 
                                          style={{ 
                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                                            transition: '0.3s' 
                                          }} 
                                        />
                                      )}
                                  </Link>
                              </div>
                              
                              {hasSublinks && isOpen && (
                                  <ul className="list-unstyled ms-3 mt-3 border-start border-secondary ps-3">
                                      {link.subLinks.map((sub, j) => (
                                          <li key={j} className="mb-3">
                                              <Link 
                                                to={sub.url} 
                                                className="text-white-50 text-decoration-none fw-bold"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                              >
                                                  {sub.label}
                                              </Link>
                                          </li>
                                      ))}
                                  </ul>
                              )}
                          </li>
                      );
                  })}
              </ul>
          </div>
      </div>

      <style>{`
        .transition-all { transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .default-nav { background-color: #1a2b4c !important; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .scrolled-nav { background: rgba(15, 25, 45, 0.98) !important; backdrop-filter: blur(20px); height: 85px !important; border-bottom: 2px solid #c5a059; }
        .nav-custom-link { position: relative; padding: 10px 0; transition: color 0.3s; }
        .nav-custom-link:hover { color: #c5a059 !important; }
        .nav-custom-link::after { content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 2px; background: #c5a059; transition: all 0.3s ease; transform: translateX(-50%); }
        .nav-item-wrapper:hover .nav-custom-link::after { width: 100%; }
        .dropdown-menu-custom { position: absolute; top: 100%; left: 50%; min-width: 250px; transform: translateX(-50%) translateY(20px); opacity: 0; visibility: hidden; transition: all 0.4s ease; padding-top: 15px; }
        .nav-item-wrapper:hover .dropdown-menu-custom { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
        .dropdown-inner { background: #ffffff; border-radius: 12px; overflow: hidden; border-top: 4px solid #c5a059; box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
        .dropdown-item-custom { color: #1a2b4c; font-weight: 700; font-size: 13px; transition: all 0.2s; text-transform: uppercase; }
        .sub-line { width: 0; height: 2px; background: #c5a059; transition: all 0.3s; }
        .dropdown-item-custom:hover { background: #f4f6f9; color: #c5a059; padding-left: 20px !important; }
        .dropdown-item-custom:hover .sub-line { width: 12px; }
        .mobile-menu-overlay { position: fixed; top: 100px; left: 0; width: 100%; height: 0; background: #1a2b4c; overflow-y: auto; transition: height 0.4s ease; z-index: 1049; }
        .mobile-menu-overlay.active { height: calc(100vh - 100px); }
        .mobile-menu-content { opacity: 0; transition: opacity 0.3s ease; transition-delay: 0.2s; }
        .mobile-menu-overlay.active .mobile-menu-content { opacity: 1; }
        .logo-glow:hover { filter: drop-shadow(0 0 10px rgba(197, 160, 89, 0.4)); }
        .arrow-icon { margin-top: 2px; }
        .nav-item-wrapper:hover .arrow-icon { transform: rotate(180deg); color: #c5a059; }
      `}</style>
    </nav>
  );
};

export default Navbar;