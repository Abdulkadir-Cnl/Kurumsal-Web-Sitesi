using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerceData.Data;
using ECommerceData.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ECommerceData.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public GalleryController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Gallery (Tüm resimleri getirir)
        [HttpGet]
        public async Task<IActionResult> GetGallery()
        {
            return Ok(await _context.Galleries.ToListAsync());
        }

        // POST: api/Gallery (Çoklu resim yükler)
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UploadImages([FromForm] List<IFormFile> files, [FromForm] int projectId)
        {
            if (files == null || files.Count == 0) return BadRequest("Dosya seçilmedi.");

            var uploadedImages = new List<Gallery>();
            string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads/gallery");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            foreach (var file in files)
            {
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                string filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // ProjectId artık burada kaydediliyor
                var galleryItem = new Gallery
                {
                    ImageUrl = "/uploads/gallery/" + fileName,
                    ProjectId = projectId
                };
                _context.Galleries.Add(galleryItem);
                uploadedImages.Add(galleryItem);
            }

            await _context.SaveChangesAsync();
            return Ok(uploadedImages);
        }

        // DELETE: api/Gallery/5 (Resim siler)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _context.Galleries.FindAsync(id);
            if (image == null) return NotFound();

            _context.Galleries.Remove(image);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("clear-all")]
        [Authorize]
        public async Task<IActionResult> ClearAllGallery()
        {
            // 1. Veritabanındaki tüm galeri kayıtlarını getir
            var allImages = await _context.Galleries.ToListAsync();

            if (allImages.Count == 0)
            {
                return Ok(new { message = "Galeri zaten boş." });
            }

            // 2. Fiziksel dosyaları klasörden sil
            foreach (var image in allImages)
            {
                if (!string.IsNullOrEmpty(image.ImageUrl))
                {
                    // Slaş işaretlerini temizleyerek tam yolu oluştur
                    string filePath = Path.Combine(_env.WebRootPath, image.ImageUrl.TrimStart('/'));

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
            }

            // 3. Veritabanı kayıtlarını toplu olarak sil
            _context.Galleries.RemoveRange(allImages);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tüm galeri kayıtları ve dosyaları başarıyla temizlendi." });
        }
    }
}