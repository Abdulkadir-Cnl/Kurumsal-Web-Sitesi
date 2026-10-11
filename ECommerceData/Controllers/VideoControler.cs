using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerceData.Data;
using ECommerceData.Entities;

namespace ECommerceData.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideosController : ControllerBase // İsim standartlara uygun yapıldı
    {
        private readonly AppDbContext _context;

        public VideosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Videos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Video>>> GetVideos()
        {
            return await _context.Videos.ToListAsync();
        }

        // POST: api/Videos
        [HttpPost]
        public async Task<ActionResult<Video>> PostVideo(Video video)
        {
            _context.Videos.Add(video);
            // HATA DÜZELTİLDİ: UpdateAsync yerine SaveChangesAsync kullanıldı
            await _context.SaveChangesAsync();
            return Ok(video);
        }

        // DELETE: api/Videos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVideo(int id)
        {
            var video = await _context.Videos.FindAsync(id);
            if (video == null) return NotFound();

            _context.Videos.Remove(video);
            // HATA DÜZELTİLDİ: UpdateAsync yerine SaveChangesAsync kullanıldı
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}