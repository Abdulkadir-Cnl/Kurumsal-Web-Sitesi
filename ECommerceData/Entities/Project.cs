namespace ECommerceData.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty; // Proje Adı
        public string Description { get; set; } = string.Empty; // Açıklama
        public string Location { get; set; } = string.Empty; // Bölge
        public string ImageUrl { get; set; } = string.Empty; // Kapak Fotoğrafı Linki
        public string? Url { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}