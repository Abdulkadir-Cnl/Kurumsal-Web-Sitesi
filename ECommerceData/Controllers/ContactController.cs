using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerceData.Data;
using ECommerceData.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ECommerceData.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        // 1. MESAJLARI LİSTELE (Admin için)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await _context.ContactMessages
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
            return Ok(messages);
        }

        // 2. MESAJ GÖNDER (Kullanıcı için)
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ContactMessage message)
        {
            if (message == null) return BadRequest();

            message.CreatedAt = DateTime.UtcNow;
            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Mesaj iletildi." });
        }

        // --- 3. YENİ: MESAJI SİL (Hatanızı çözen kısım) ---
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null)
            {
                // Eğer mesaj bulunamazsa yine 404 döner, ancak artık bu endpoint mevcut.
                return NotFound("Mesaj veritabanında bulunamadı.");
            }

            _context.ContactMessages.Remove(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Mesaj başarıyla silindi." });
        }
    }
}