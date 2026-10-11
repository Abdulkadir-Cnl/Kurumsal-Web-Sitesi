using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ECommerceData.Data;     //
using ECommerceData.Entities; //

namespace ECommerceData.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatalogController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CatalogController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetCatalogs()
        {
            var catalogs = await _context.Catalogs.OrderByDescending(c => c.Id).ToListAsync();
            return Ok(catalogs);
        }

        // Rota hatasını önlemek için "add" ismini ekliyoruz
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> UploadCatalog([FromForm] string title, IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Dosya seçilmedi.");

            var extension = Path.GetExtension(file.FileName).ToLower();
            if (extension != ".pdf") return BadRequest("Sadece PDF dosyaları yüklenebilir.");

            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads/catalogs");
            if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

            var fileName = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var catalog = new Catalog
            {
                Title = title,
                PdfUrl = "/uploads/catalogs/" + fileName
            };

            _context.Catalogs.Add(catalog);
            await _context.SaveChangesAsync();

            return Ok(catalog);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCatalog(int id)
        {
            var catalog = await _context.Catalogs.FindAsync(id);
            if (catalog == null) return NotFound();

            var fullPath = Path.Combine(_env.WebRootPath, catalog.PdfUrl.TrimStart('/'));
            if (System.IO.File.Exists(fullPath)) System.IO.File.Delete(fullPath);

            _context.Catalogs.Remove(catalog);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}