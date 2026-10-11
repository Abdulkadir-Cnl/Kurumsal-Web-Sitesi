namespace ECommerceData.Entities
{
    public class ProjectCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? Url { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}