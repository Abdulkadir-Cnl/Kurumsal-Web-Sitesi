using Microsoft.EntityFrameworkCore;
using ECommerceData.Entities;
using System.Collections.Generic;

namespace ECommerceData.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Veritabanında "Projects" isimli bir tablo oluşturur
        public DbSet<Project> Projects { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Theme> Themes { get; set; }
        public DbSet<CmsItem> CmsItems { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<Gallery> Galleries { get; set; }
        public DbSet<Catalog> Catalogs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                Username = "admin@gmail.com",
                PasswordHash = "Admin123.", // Gerçek projede bu şifrelenmiş olmalı
                Role = "Admin"
            });
        }
    }
}