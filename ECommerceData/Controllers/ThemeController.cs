using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerceData.Data;
using ECommerceData.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ECommerceData.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThemeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ThemeController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetTheme()
        {
            var theme = await _context.Themes.FirstOrDefaultAsync();
            return Ok(theme ?? new Theme());
        }

        // --- YENİ: LOGO YÜKLEME METODU ---
        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> UploadLogo(IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Dosya seçilmedi.");

            string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads/logo");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { path = "/uploads/logo/" + fileName });
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateTheme([FromBody] Theme themeData)
        {
            var existingTheme = await _context.Themes.FirstOrDefaultAsync();

            if (existingTheme == null)
            {
                _context.Themes.Add(themeData);
            }
            else
            {
                // Logo URL dahil tüm alanları güncelle
                existingTheme.LogoUrl = themeData.LogoUrl;
                existingTheme.NavLinks = themeData.NavLinks;
                existingTheme.HeroSliderImages = themeData.HeroSliderImages;
                existingTheme.CorporateValues = themeData.CorporateValues;
                existingTheme.FooterData = themeData.FooterData;
                existingTheme.ProjectCount = themeData.ProjectCount;
                existingTheme.CustomerCount = themeData.CustomerCount;
                existingTheme.ExperienceYear = themeData.ExperienceYear;
                existingTheme.TeamCount = themeData.TeamCount;
                existingTheme.SatisfactionText = themeData.SatisfactionText;
                existingTheme.MediaGalleryImage = themeData.MediaGalleryImage;
                existingTheme.MediaVideoImage = themeData.MediaVideoImage;
                existingTheme.Mission = themeData.Mission;
                existingTheme.Vision = themeData.Vision;   
                existingTheme.CatalogText = themeData.CatalogText; 

                _context.Themes.Update(existingTheme);
            }

            await _context.SaveChangesAsync();
            return Ok(existingTheme ?? themeData);
        }
    }
}