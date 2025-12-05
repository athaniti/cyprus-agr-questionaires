using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;

namespace CyprusAgriculture.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThemesController : ControllerBase
{
    private readonly CyprusAgricultureDbContext _context;
    private readonly ILogger<ThemesController> _logger;

    public ThemesController(CyprusAgricultureDbContext context, ILogger<ThemesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<Theme>>> Index()
    {
        try
        {
            var themes = await _context.Themes.ToListAsync();

            return Ok(themes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching themes");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Theme>> Get(Guid id)
    {
        try
        {
            var theme = await _context.Themes.FindAsync(id);

            return Ok(theme);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching themes");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
    
    [HttpPost]
    public async Task<ActionResult<Theme>> CreateTheme([FromBody] Theme theme)
    {
        try
        {
            if (theme.IsDefault)
            {
                var defaultThemes = await _context.Themes.Where(t => t.IsDefault).ToListAsync();
                foreach (var defTheme in defaultThemes)
                {
                    defTheme.IsDefault = false;
                }
            }
            
            theme.Id = Guid.NewGuid();
            theme.CreatedAt = DateTime.UtcNow;

            _context.Themes.Add(theme);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = theme.Id }, theme);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating theme");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Theme>> UpdateTheme(Guid id, [FromBody] Theme theme)
    {
        try
        {
            var existingTheme = await _context.Themes.FindAsync(id);
            if (existingTheme == null)
            {
                return NotFound(new { success = false, message = "Theme not found" });
            }

            if (theme.IsDefault)
            {
                var defaultThemes = await _context.Themes.Where(t => t.IsDefault).ToListAsync();
                foreach (var defTheme in defaultThemes)
                {
                    defTheme.IsDefault = false;
                }
            }

            existingTheme.BackgroundColor = theme.BackgroundColor;
            existingTheme.BodyFont = theme.BodyFont;
            existingTheme.BodyFontSize = theme.BodyFontSize;
            existingTheme.Description = theme.Description;
            existingTheme.HeaderFont = theme.HeaderFont;
            existingTheme.HeaderFontSize = theme.HeaderFontSize;
            existingTheme.LogoImageBase64 = theme.LogoImageBase64;
            existingTheme.LogoPosition = theme.LogoPosition;
            existingTheme.Name = theme.Name;
            existingTheme.PrimaryColor = theme.PrimaryColor;
            existingTheme.SecondaryColor = theme.SecondaryColor;
            existingTheme.TextColor = theme.TextColor;
            existingTheme.IsDefault = theme.IsDefault;
            existingTheme.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(existingTheme);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating theme");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTheme(Guid id)
    {
        try
        {
            var existingTheme = await _context.Themes.FindAsync(id);
            if (existingTheme!.IsDefault == true) throw new Exception("Cannot delete default theme");
            _context.Themes.Remove(existingTheme!);

            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting theme");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}

