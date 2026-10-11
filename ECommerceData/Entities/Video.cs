namespace ECommerceData.Entities
{
    public class Video
    {
        public int Id { get; set; }
        public string? Category { get; set; }
        public string? Title { get; set; } // Nullable yapıldı
        public string? YoutubeUrl { get; set; } // Nullable yapıldı
    }
}