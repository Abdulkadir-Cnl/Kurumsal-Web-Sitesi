using System;

namespace ECommerceData.Entities
{
    public class Catalog
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string PdfUrl { get; set; } = string.Empty;

        // DateTime.Now yerine DateTime.UtcNow kullanın
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}