namespace ECommerceData.Entities
{
    public class Gallery
    {
        public int Id { get; set; }
        public string? ImageUrl { get; set; }
        // YENİ: Fotoğrafın hangi projeye ait olduğunu tutar
        public int ProjectId { get; set; }
    }
}