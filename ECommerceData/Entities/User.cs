namespace ECommerceData.Entities

{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // Şifreyi açık yazmayacağız, maskeleyeceğiz
        public string Role { get; set; } = "Admin"; // Rol yönetimi için
    }
}