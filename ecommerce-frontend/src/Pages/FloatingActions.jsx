import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingActions = ({ theme }) => {
    // 1. Veri kontrolü: theme veya footerData yoksa varsayılan obje kullan
    let footerData = {};
    if (theme?.footerData) {
        try {
            footerData = typeof theme.footerData === 'string' 
                ? JSON.parse(theme.footerData) 
                : theme.footerData;
        } catch (e) {
            console.error("WhatsApp numarası ayrıştırılamadı:", e);
        }
    }

    // 2. Telefon numarası kontrolü: replace hatasını önlemek için string olduğundan emin ol
    const rawPhone = String(footerData?.phone || "905401005838");
    const cleanPhone = rawPhone.replace(/\s+/g, '').replace('+', '');
    const whatsappLink = `https://wa.me/${cleanPhone}`;

    return (
        <>
            {/* WhatsApp Butonu */}
            <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noreferrer" 
                className="whatsapp-btn-float d-flex align-items-center gap-2 px-3 py-2 text-white text-decoration-none shadow-lg"
            >
                <FaWhatsapp size={24} />
                <span className="fw-bold small d-none d-md-inline">Whatsapp İletişim</span>
            </a>

            {/* Bize Ulaşın Butonu */}
            <Link 
                to="/iletisim" 
                className="contact-side-btn-float text-white text-decoration-none shadow-lg d-flex align-items-center justify-content-center fw-bold"
            >
                Bize Ulaşın
            </Link>

            <style>{`
                .whatsapp-btn-float {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background-color: #0c6b1d;
                    border-radius: 8px;
                    z-index: 9999;
                    transition: 0.3s;
                }
                .whatsapp-btn-float:hover { background-color: #0a5216; transform: scale(1.05); }
                
                .contact-side-btn-float {
                    position: fixed;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%) rotate(-90deg);
                    transform-origin: right bottom;
                    background-color: #14213d;
                    padding: 12px 25px;
                    border-radius: 8px 8px 0 0;
                    z-index: 9998;
                    white-space: nowrap;
                    font-size: 14px;
                    letter-spacing: 1px;
                }
                @media (max-width: 768px) {
                    .whatsapp-btn-float { bottom: 20px; right: 20px; }
                }
            `}</style>
        </>
    );
};

export default FloatingActions;