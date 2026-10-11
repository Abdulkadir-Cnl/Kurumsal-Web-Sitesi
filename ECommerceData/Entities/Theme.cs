namespace ECommerceData.Entities
{
    public class Theme
    {
        public int Id { get; set; }
        public string LogoUrl { get; set; } = "";
        public string NavLinks { get; set; } = "[]";
        public string HeroSliderImages { get; set; } = "[]";
        public string ProjectCount { get; set; } = "60+";
        public string CustomerCount { get; set; } = "6500+";
        public string ExperienceYear { get; set; } = "+25";
        public string TeamCount { get; set; } = "1100";
        public string CorporateValues { get; set; } = "[]"; // Burası ana sayfadaki kartlar olarak kalmalı
        public string FooterData { get; set; } = "{}";
        public string? SatisfactionText { get; set; } // Hakkımızda metni
        public string? Mission { get; set; } // YENİ
        public string? Vision { get; set; }  // YENİ
        public string? CatalogText { get; set; } // YENİ
        public string? MediaGalleryImage { get; set; }
        public string? MediaVideoImage { get; set; }
    }
}