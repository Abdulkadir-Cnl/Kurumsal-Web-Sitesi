using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerceData.Data;
using ECommerceData.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ECommerceData.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProjectsController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            return await _context.Projects.OrderByDescending(p => p.CreatedAt).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound(new { message = "Proje bulunamadı." });
            return project;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Project>> PostProject([FromForm] ProjectCreateDto projectDto)
        {
            string dbImageRelativePath = "";
            if (projectDto.ImageFile != null && projectDto.ImageFile.Length > 0)
            {
                string rootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                string uploadsFolder = Path.Combine(rootPath, "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + projectDto.ImageFile.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await projectDto.ImageFile.CopyToAsync(fileStream);
                }
                dbImageRelativePath = "/uploads/" + uniqueFileName;
            }

            var newProject = new Project
            {
                Title = projectDto.Title ?? "",
                Description = projectDto.Description ?? "",
                Location = projectDto.Location ?? "",
                ImageUrl = dbImageRelativePath,
                Url = projectDto.Url,
                CreatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(newProject);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProject), new { id = newProject.Id }, newProject);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(int id, [FromForm] ProjectCreateDto projectDto)
        {
            var existingProject = await _context.Projects.FindAsync(id);
            if (existingProject == null) return NotFound();

            existingProject.Title = projectDto.Title ?? existingProject.Title;
            existingProject.Description = projectDto.Description ?? existingProject.Description;
            existingProject.Location = projectDto.Location ?? existingProject.Location;
            existingProject.Url = projectDto.Url;

            if (projectDto.ImageFile != null && projectDto.ImageFile.Length > 0)
            {
                string rootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                if (!string.IsNullOrEmpty(existingProject.ImageUrl))
                {
                    var oldPath = Path.Combine(rootPath, existingProject.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);
                }

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + projectDto.ImageFile.FileName;
                string filePath = Path.Combine(rootPath, "uploads", uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await projectDto.ImageFile.CopyToAsync(fileStream);
                }
                existingProject.ImageUrl = "/uploads/" + uniqueFileName;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            if (!string.IsNullOrEmpty(project.ImageUrl))
            {
                string rootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var filePath = Path.Combine(rootPath, project.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Silindi" });
        }
    }
}