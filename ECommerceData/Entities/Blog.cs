namespace ECommerceData.Entities
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty; // Blog yazısının ana metni
        public string Author { get; set; } = "Admin";       // Yazar adı
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsVisible { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}