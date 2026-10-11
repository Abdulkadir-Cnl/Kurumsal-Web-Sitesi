import React, { useEffect } from "react";

const Hero = ({ images }) => {
  const BASE_URL = "https://localhost:7137";

  let sliderList = [];
  try {
    sliderList = typeof images === "string" ? JSON.parse(images || "[]") : (images || []);
  } catch (e) { sliderList = []; }

  useEffect(() => {
    if (window.bootstrap && sliderList.length > 0) {
      const element = document.getElementById("mainSlider");
      if (element) {
        new window.bootstrap.Carousel(element, { interval: 4000, ride: 'carousel' });
      }
    }
  }, [sliderList]);

  if (sliderList.length === 0) return null;

  return (
    <div id="mainSlider" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{ marginTop: '0' }}>
      <div className="carousel-inner">
        {sliderList.map((img, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <img
              src={img.startsWith("http") ? img : `${BASE_URL}${img}`}
              className="d-block w-100 hero-img"
              alt="Slide"
            />
          </div>
        ))}
      </div>
      
      {sliderList.length > 1 && (
        <>
          <button className="carousel-control-prev" type="button" data-bs-target="#mainSlider" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#mainSlider" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </>
      )}

      <style>{`
        /* MASAÜSTÜ: Ekranı tam kapla */
        .hero-img {
          height: calc(100vh);
          object-fit: cover;
          object-position: center top;
        }

        /* MOBİL: Görseldeki gibi (image_1883df.jpg) resmin tamamını göster */
        @media (max-width: 768px) {
          .carousel-item, .hero-img {
            height: auto !important; /* Yükseklik zorlamasını kaldır */
            min-height: 0 !important;
          }
          .hero-img {
            object-fit: contain !important; /* Resmin tamamı görünür, kesilmez */
            background-color: #f8f9fa;
          }
          /* Navbar payını mobilde de hesaba katmak istersen paddingTop eklenebilir */
          .carousel { margin-top: 100px; } 
        }
      `}</style>
    </div>
  );
};

export default Hero;