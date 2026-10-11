using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerceData.Data;
using ECommerceData.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ECommerceData.Controllers
{
    [ApiController]
    [Route("cms")]
    public class CmsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CmsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _context.CmsItems.OrderByDescending(x => x.CreatedAt).ToListAsync();
            return Ok(items);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> Get(string slug)
        {
            var item = await _context.CmsItems.FirstOrDefaultAsync(x => x.Slug == slug);
            return item == null ? NotFound() : Ok(item);
        }

        // SAYFA SİLME
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCmsPage(int id)
        {
            var page = await _context.CmsItems.FindAsync(id);
            if (page == null) return NotFound("Sayfa bulunamadı.");

            _context.CmsItems.Remove(page);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Sayfa başarıyla silindi." });
        }

        // YENİ SAYFA OLUŞTURMA
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromForm] string title, [FromForm] string slug, [FromForm] string body, IFormFile? image1, IFormFile? image2)
        {
            if (await _context.CmsItems.AnyAsync(x => x.Slug == slug))
                return BadRequest("Bu URL zaten kullanımda.");

            var newItem = new CmsItem { Title = title, Slug = slug, Body = body };
            newItem.ImageUrl1 = await SaveFile(image1);
            newItem.ImageUrl2 = await SaveFile(image2);

            _context.CmsItems.Add(newItem);
            await _context.SaveChangesAsync();
            return Ok(newItem);
        }

        // SAYFA GÜNCELLEME (YENİ EKLENDİ)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] string title, [FromForm] string slug, [FromForm] string body, IFormFile? image1, IFormFile? image2)
        {
            var item = await _context.CmsItems.FindAsync(id);
            if (item == null) return NotFound();

            if (await _context.CmsItems.AnyAsync(x => x.Slug == slug && x.Id != id))
                return BadRequest("Bu URL başka bir sayfada kullanımda.");

            item.Title = title;
            item.Slug = slug;
            item.Body = body;

            if (image1 != null) item.ImageUrl1 = await SaveFile(image1);
            if (image2 != null) item.ImageUrl2 = await SaveFile(image2);

            await _context.SaveChangesAsync();
            return Ok(item);
        }

        private async Task<string?> SaveFile(IFormFile? file)
        {
            if (file == null || file.Length == 0) return null;
            string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads/cms");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            string uniqueName = Guid.NewGuid().ToString() + "_" + file.FileName;
            string filePath = Path.Combine(uploadsFolder, uniqueName);
            using (var stream = new FileStream(filePath, FileMode.Create)) { await file.CopyToAsync(stream); }
            return "/uploads/cms/" + uniqueName;
        }
    }
}