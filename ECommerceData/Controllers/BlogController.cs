using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerceData.Data;
using ECommerceData.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ECommerceData.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public BlogController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet] // Admin ve kullanıcı için tüm liste
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _context.Blogs.OrderByDescending(x => x.CreatedAt).ToListAsync();
            return Ok(blogs);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromForm] BlogCreateDto dto)
        {
            var blog = new Blog
            {
                Title = dto.Title,
                Content = dto.Content,
                Author = dto.Author,
                IsVisible = dto.IsVisible, // Eklendi
                CreatedAt = DateTime.UtcNow
            };

            if (dto.ImageFile != null) blog.ImageUrl = await SaveFile(dto.ImageFile);
            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return Ok(blog);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] BlogCreateDto dto)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return NotFound();

            blog.Title = dto.Title;
            blog.Content = dto.Content;
            blog.Author = dto.Author;
            blog.IsVisible = dto.IsVisible; // Güncellendi

            if (dto.ImageFile != null) blog.ImageUrl = await SaveFile(dto.ImageFile);
            await _context.SaveChangesAsync();
            return Ok(blog);
        }
        [HttpPatch("{id}/toggle-visibility")]
        [Authorize]
        public async Task<IActionResult> ToggleVisibility(int id)
        {
            // Veritabanında bloğu bul
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return NotFound("Blog bulunamadı.");

            // Durumu tersine çevir
            blog.IsVisible = !blog.IsVisible;

            // Değişiklikleri kaydet ve sonucu dön
            await _context.SaveChangesAsync();
            return Ok(new { id = blog.Id, isVisible = blog.IsVisible });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return NotFound();
            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Silindi" });
        }

        private async Task<string> SaveFile(IFormFile file)
        {
            string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads/blog");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            string uniqueName = Guid.NewGuid().ToString() + "_" + file.FileName;
            string filePath = Path.Combine(uploadsFolder, uniqueName);
            using (var stream = new FileStream(filePath, FileMode.Create)) { await file.CopyToAsync(stream); }
            return "/uploads/blog/" + uniqueName;
        }
    }
}