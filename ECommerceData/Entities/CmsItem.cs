namespace ECommerceData.Entities
{
    public class CmsItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;   // hakkimizda
        public string Body { get; set; } = string.Empty;   // HTML içerik
        public string? ImageUrl1 { get; set; }
        public string? ImageUrl2 { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
