namespace ECommerceData.Entities
{
    public class BlogCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = "Admin";
        public bool IsVisible { get; set; } = true;
        public IFormFile? ImageFile { get; set; } // Resim dosyası
    }
}