using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;
using CyprusAgriculture.API.Models.DTOs;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<LocationsController> _logger;

        public LocationsController(CyprusAgricultureDbContext context, ILogger<LocationsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/locations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetLocations([FromQuery] string? type = null)
        {
            try
            {
                var query = _context.Locations.Where(l => l.IsActive);

                if (!string.IsNullOrEmpty(type))
                {
                    query = query.Where(l => l.Type == type);
                }

                var locations = await query
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Type,
                        l.ParentName,
                        l.ParentId,
                        l.Code,
                        l.Latitude,
                        l.Longitude
                    })
                    .ToListAsync();

                return Ok(locations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving locations");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/regions
        [HttpGet("regions")]
        public async Task<ActionResult<IEnumerable<object>>> GetRegions()
        {
            try
            {
                var regions = await _context.Locations
                    .Where(l => l.Type == "region" && l.IsActive)
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Code,
                        l.Latitude,
                        l.Longitude
                    })
                    .ToListAsync();

                return Ok(regions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving regions");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/{id}/children
        [HttpGet("{id}/children")]
        public async Task<ActionResult<IEnumerable<object>>> GetLocationChildren(Guid id)
        {
            try
            {
                var children = await _context.Locations
                    .Where(l => l.ParentId == id && l.IsActive)
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Type,
                        l.Code,
                        l.Latitude,
                        l.Longitude
                    })
                    .ToListAsync();

                return Ok(children);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving location children for {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/hierarchy
        [HttpGet("hierarchy")]
        public async Task<ActionResult<object>> GetLocationHierarchy()
        {
            try
            {
                var provinces = await _context.Locations
                    .Where(l => l.Type == "region" && l.IsActive)
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        Type = "Επαρχία",
                        Municipalities = _context.Locations
                            .Where(m => m.ParentId == l.Id && m.Type == "municipality" && m.IsActive)
                            .OrderBy(m => m.Name)
                            .Select(m => new
                            {
                                m.Id,
                                m.Name,
                                Type = "Δήμος",
                                Province = l.Name,
                                Communities = _context.Locations
                                    .Where(c => c.ParentId == m.Id && c.Type == "community" && c.IsActive)
                                    .OrderBy(c => c.Name)
                                    .Select(c => new
                                    {
                                        c.Id,
                                        c.Name,
                                        Type = "Κοινότητα",
                                        Province = l.Name,
                                        Municipality = m.Name,
                                        Locations = _context.Locations
                                            .Where(loc => loc.ParentId == c.Id && loc.Type == "location" && loc.IsActive)
                                            .OrderBy(loc => loc.Name)
                                            .Select(loc => new
                                            {
                                                loc.Id,
                                                loc.Name,
                                                Type = "Τοποθεσία",
                                                Province = l.Name,
                                                Municipality = m.Name,
                                                Community = c.Name
                                            })
                                            .ToList()
                                    })
                                    .ToList()
                            })
                            .ToList()
                    })
                    .ToListAsync();

                return Ok(provinces);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving location hierarchy");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/locations
        [HttpPost]
        public async Task<ActionResult<Location>> CreateLocation([FromBody] CreateLocationRequest request)
        {
            try
            {
                Guid? parentId = null;
                string? parentName = null;

                // Determine parent based on type and hierarchy
                switch (request.Type.ToLower())
                {
                    case "province":
                    case "region":
                        // No parent needed for provinces
                        break;

                    case "municipality":
                        if (string.IsNullOrEmpty(request.Province))
                        {
                            return BadRequest("Η επαρχία είναι υποχρεωτική για δήμο");
                        }

                        var province = await _context.Locations
                            .FirstOrDefaultAsync(l => l.Name == request.Province && l.Type == "region" && l.IsActive);
                        
                        if (province == null)
                        {
                            return BadRequest($"Η επαρχία '{request.Province}' δεν βρέθηκε");
                        }

                        parentId = province.Id;
                        parentName = province.Name;
                        break;

                    case "community":
                        if (string.IsNullOrEmpty(request.Municipality))
                        {
                            return BadRequest("Ο δήμος είναι υποχρεωτικός για κοινότητα");
                        }

                        var municipality = await _context.Locations
                            .FirstOrDefaultAsync(l => l.Name == request.Municipality && l.Type == "municipality" && l.IsActive);
                        
                        if (municipality == null)
                        {
                            return BadRequest($"Ο δήμος '{request.Municipality}' δεν βρέθηκε");
                        }

                        parentId = municipality.Id;
                        parentName = municipality.Name;
                        break;

                    case "location":
                        if (string.IsNullOrEmpty(request.Community))
                        {
                            return BadRequest("Η κοινότητα είναι υποχρεωτική για τοποθεσία");
                        }

                        var community = await _context.Locations
                            .FirstOrDefaultAsync(l => l.Name == request.Community && l.Type == "community" && l.IsActive);
                        
                        if (community == null)
                        {
                            return BadRequest($"Η κοινότητα '{request.Community}' δεν βρέθηκε");
                        }

                        parentId = community.Id;
                        parentName = community.Name;
                        break;

                    default:
                        return BadRequest("Μη έγκυρος τύπος τοποθεσίας");
                }

                // Check for existing location
                var existingLocation = await _context.Locations
                    .FirstOrDefaultAsync(l => l.Name == request.Name && l.ParentId == parentId && l.Type == request.Type);
                
                if (existingLocation != null)
                {
                    return Conflict($"Η τοποθεσία '{request.Name}' υπάρχει ήδη");
                }

                var location = new Location
                {
                    Name = request.Name,
                    Type = request.Type,
                    ParentId = parentId,
                    ParentName = parentName,
                    Municipality = request.Municipality,
                    LocationLevel = request.Type,
                    Code = request.Code,
                    Latitude = request.Latitude,
                    Longitude = request.Longitude,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Locations.Add(location);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetLocationChildren), 
                    new { id = parentId ?? location.Id }, location);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating location {Name}", request.Name);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/locations/import
        [HttpPost("import")]
        public async Task<ActionResult<ImportResult>> ImportLocations([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Δεν επιλέχθηκε αρχείο");
                }

                if (Path.GetExtension(file.FileName).ToLower() != ".csv")
                {
                    return BadRequest("Μόνο αρχεία CSV επιτρέπονται");
                }

                var result = new ImportResult();
                var locationsToAdd = new List<Location>();

                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    string? line;
                    int lineNumber = 0;
                    
                    // Skip header
                    await reader.ReadLineAsync();
                    lineNumber++;

                    while ((line = await reader.ReadLineAsync()) != null)
                    {
                        lineNumber++;
                        var parts = line.Split(',');
                        
                        if (parts.Length < 4)
                        {
                            result.Errors.Add($"Γραμμή {lineNumber}: Ελλιπή δεδομένα - Απαιτούνται: Όνομα, Δήμος, Κοινότητα, Επαρχία");
                            result.RejectedCount++;
                            continue;
                        }

                        var name = parts[0].Trim().Trim('"');
                        var municipality = parts[1].Trim().Trim('"');
                        var community = parts[2].Trim().Trim('"');
                        var province = parts[3].Trim().Trim('"');
                        var code = parts.Length > 4 ? parts[4].Trim().Trim('"') : null;

                        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(municipality) || 
                            string.IsNullOrEmpty(community) || string.IsNullOrEmpty(province))
                        {
                            result.Errors.Add($"Γραμμή {lineNumber}: Όλα τα πεδία (Όνομα, Δήμος, Κοινότητα, Επαρχία) είναι υποχρεωτικά");
                            result.RejectedCount++;
                            continue;
                        }

                        // Find province
                        var provinceLocation = await _context.Locations
                            .FirstOrDefaultAsync(l => l.Name == province && l.Type == "region" && l.IsActive);
                        
                        if (provinceLocation == null)
                        {
                            result.Errors.Add($"Γραμμή {lineNumber}: Η επαρχία '{province}' δεν βρέθηκε");
                            result.RejectedCount++;
                            continue;
                        }

                        // Find municipality
                        var municipalityLocation = await _context.Locations
                            .FirstOrDefaultAsync(l => l.Name == municipality && l.Type == "municipality" && l.ParentId == provinceLocation.Id && l.IsActive);
                        
                        if (municipalityLocation == null)
                        {
                            result.Errors.Add($"Γραμμή {lineNumber}: Ο δήμος '{municipality}' δεν βρέθηκε στην επαρχία '{province}'");
                            result.RejectedCount++;
                            continue;
                        }

                        // Find community
                        var communityLocation = await _context.Locations
                            .FirstOrDefaultAsync(l => l.Name == community && l.Type == "community" && l.ParentId == municipalityLocation.Id && l.IsActive);
                        
                        if (communityLocation == null)
                        {
                            result.Errors.Add($"Γραμμή {lineNumber}: Η κοινότητα '{community}' δεν βρέθηκε στον δήμο '{municipality}'");
                            result.RejectedCount++;
                            continue;
                        }

                        // Check if location already exists
                        var existing = await _context.Locations
                            .FirstOrDefaultAsync(l => l.Name == name && l.ParentId == communityLocation.Id && l.Type == "location");
                        
                        if (existing != null)
                        {
                            result.AlreadyExistsCount++;
                            continue;
                        }

                        // Check if already in our batch
                        if (locationsToAdd.Any(l => l.Name == name && l.ParentId == communityLocation.Id))
                        {
                            result.Errors.Add($"Γραμμή {lineNumber}: Διπλότυπη εγγραφή στο αρχείο");
                            result.RejectedCount++;
                            continue;
                        }

                        locationsToAdd.Add(new Location
                        {
                            Name = name,
                            Type = "location",
                            ParentId = communityLocation.Id,
                            ParentName = communityLocation.Name,
                            Municipality = municipality,
                            LocationLevel = "location",
                            Code = code,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow
                        });

                        result.ProcessedCount++;
                    }
                }

                // Add all valid locations
                if (locationsToAdd.Any())
                {
                    _context.Locations.AddRange(locationsToAdd);
                    await _context.SaveChangesAsync();
                    result.SuccessCount = locationsToAdd.Count;
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing locations from file");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/import/preview
        [HttpPost("import/preview")]
        public async Task<ActionResult<ImportPreview>> PreviewImport([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Δεν επιλέχθηκε αρχείο");
                }

                if (Path.GetExtension(file.FileName).ToLower() != ".csv")
                {
                    return BadRequest("Μόνο αρχεία CSV επιτρέπονται");
                }

                var preview = new ImportPreview();
                var previewItems = new List<ImportPreviewItem>();

                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    string? line;
                    int lineNumber = 0;
                    
                    // Skip header
                    await reader.ReadLineAsync();
                    lineNumber++;

                    while ((line = await reader.ReadLineAsync()) != null && previewItems.Count < 10)
                    {
                        lineNumber++;
                        var parts = line.Split(',');
                        
                        var item = new ImportPreviewItem
                        {
                            LineNumber = lineNumber,
                            Name = parts.Length > 0 ? parts[0].Trim().Trim('"') : "",
                            Municipality = parts.Length > 1 ? parts[1].Trim().Trim('"') : "",
                            Community = parts.Length > 2 ? parts[2].Trim().Trim('"') : "",
                            Province = parts.Length > 3 ? parts[3].Trim().Trim('"') : "",
                            Code = parts.Length > 4 ? parts[4].Trim().Trim('"') : "",
                            Status = "Έτοιμο για εισαγωγή"
                        };

                        // Validate
                        if (string.IsNullOrEmpty(item.Name) || string.IsNullOrEmpty(item.Municipality) || 
                            string.IsNullOrEmpty(item.Community) || string.IsNullOrEmpty(item.Province))
                        {
                            item.Status = "Σφάλμα: Ελλιπή δεδομένα";
                        }
                        else
                        {
                            // Check if province exists
                            var provinceExists = await _context.Locations
                                .AnyAsync(l => l.Name == item.Province && l.Type == "region" && l.IsActive);
                            
                            if (!provinceExists)
                            {
                                item.Status = $"Σφάλμα: Η επαρχία '{item.Province}' δεν βρέθηκε";
                            }
                            else
                            {
                                // Check if municipality exists
                                var provinceLocation = await _context.Locations
                                    .FirstOrDefaultAsync(l => l.Name == item.Province && l.Type == "region" && l.IsActive);
                                
                                var municipalityExists = await _context.Locations
                                    .AnyAsync(l => l.Name == item.Municipality && l.Type == "municipality" && l.ParentId == provinceLocation!.Id && l.IsActive);
                                
                                if (!municipalityExists)
                                {
                                    item.Status = $"Σφάλμα: Ο δήμος '{item.Municipality}' δεν βρέθηκε";
                                }
                                else
                                {
                                    // Check if community exists
                                    var municipalityLocation = await _context.Locations
                                        .FirstOrDefaultAsync(l => l.Name == item.Municipality && l.Type == "municipality" && l.ParentId == provinceLocation.Id && l.IsActive);
                                    
                                    var communityExists = await _context.Locations
                                        .AnyAsync(l => l.Name == item.Community && l.Type == "community" && l.ParentId == municipalityLocation!.Id && l.IsActive);
                                    
                                    if (!communityExists)
                                    {
                                        item.Status = $"Σφάλμα: Η κοινότητα '{item.Community}' δεν βρέθηκε";
                                    }
                                    else
                                    {
                                        // Check if location already exists
                                        var communityLocation = await _context.Locations
                                            .FirstOrDefaultAsync(l => l.Name == item.Community && l.Type == "community" && l.ParentId == municipalityLocation.Id && l.IsActive);
                                        
                                        var exists = await _context.Locations
                                            .AnyAsync(l => l.Name == item.Name && l.ParentId == communityLocation!.Id && l.Type == "location");
                                        
                                        if (exists)
                                        {
                                            item.Status = "Υπάρχει ήδη";
                                        }
                                    }
                                }
                            }
                        }

                        previewItems.Add(item);
                    }

                    // Count total lines
                    while ((line = await reader.ReadLineAsync()) != null)
                    {
                        lineNumber++;
                    }
                    
                    preview.TotalLines = lineNumber - 1; // Exclude header
                }

                preview.PreviewItems = previewItems;
                return Ok(preview);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error previewing import file");
                return StatusCode(500, "Internal server error");
            }
        }

        // ==========================================
        // SEPARATE REGISTRY ENDPOINTS
        // ==========================================

        // GET: api/locations/provinces
        [HttpGet("provinces")]
        public async Task<ActionResult<IEnumerable<object>>> GetProvinces()
        {
            try
            {
                var provinces = await _context.Locations
                    .Where(l => l.IsActive && l.Type == "province")
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Code
                    })
                    .ToListAsync();

                return Ok(provinces);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving provinces");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/municipalities/{provinceId}
        [HttpGet("municipalities/{provinceId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetMunicipalitiesByProvince(Guid provinceId)
        {
            try
            {
                var municipalities = await _context.Locations
                    .Where(l => l.IsActive && l.Type == "municipality" && l.ParentId == provinceId)
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Code,
                        l.ParentId,
                        ParentName = l.ParentName
                    })
                    .ToListAsync();

                return Ok(municipalities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving municipalities for province {ProvinceId}", provinceId);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/municipalities (all municipalities)
        [HttpGet("municipalities")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllMunicipalities()
        {
            try
            {
                var municipalities = await _context.Locations
                    .Where(l => l.IsActive && l.Type == "municipality")
                    .OrderBy(l => l.ParentName)
                    .ThenBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Code,
                        l.ParentId,
                        ParentName = l.ParentName,
                        Province = l.ParentName
                    })
                    .ToListAsync();

                return Ok(municipalities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all municipalities");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/communities/{municipalityId}
        [HttpGet("communities/{municipalityId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetCommunitiesByMunicipality(Guid municipalityId)
        {
            try
            {
                var communities = await _context.Locations
                    .Where(l => l.IsActive && l.Type == "community" && l.ParentId == municipalityId)
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Code,
                        l.ParentId,
                        ParentName = l.ParentName,
                        Municipality = l.Municipality
                    })
                    .ToListAsync();

                return Ok(communities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving communities for municipality {MunicipalityId}", municipalityId);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/communities (all communities)
        [HttpGet("communities")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllCommunities()
        {
            try
            {
                var communities = await _context.Locations
                    .Where(l => l.IsActive && l.Type == "community")
                    .OrderBy(l => l.Municipality)
                    .ThenBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Code,
                        l.ParentId,
                        ParentName = l.ParentName,
                        Municipality = l.Municipality
                    })
                    .ToListAsync();

                return Ok(communities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all communities");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/locations/{communityId}
        [HttpGet("locations/{communityId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetLocationsByCommunity(Guid communityId)
        {
            try
            {
                var locations = await _context.Locations
                    .Where(l => l.IsActive && l.Type == "location" && l.ParentId == communityId)
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Code,
                        l.ParentId,
                        ParentName = l.ParentName,
                        Community = l.ParentName,
                        l.Municipality,
                        l.Latitude,
                        l.Longitude
                    })
                    .ToListAsync();

                return Ok(locations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving locations for community {CommunityId}", communityId);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/cascade/{provinceId?}/{municipalityId?}
        [HttpGet("cascade")]
        public async Task<ActionResult<object>> GetCascadeData([FromQuery] Guid? provinceId = null, [FromQuery] Guid? municipalityId = null)
        {
            try
            {
                var provinces = await _context.Locations
                    .Where(l => l.IsActive && l.Type == "province")
                    .OrderBy(l => l.Name)
                    .Select(l => new { l.Id, l.Name, l.Code })
                    .ToListAsync();

                object municipalities = provinceId.HasValue 
                    ? await _context.Locations
                        .Where(l => l.IsActive && l.Type == "municipality" && l.ParentId == provinceId)
                        .OrderBy(l => l.Name)
                        .Select(l => new { l.Id, l.Name, l.Code, l.ParentId })
                        .ToListAsync()
                    : new List<object>();

                object communities = municipalityId.HasValue 
                    ? await _context.Locations
                        .Where(l => l.IsActive && l.Type == "community" && l.ParentId == municipalityId)
                        .OrderBy(l => l.Name)
                        .Select(l => new { l.Id, l.Name, l.Code, l.ParentId })
                        .ToListAsync()
                    : new List<object>();

                var result = new
                {
                    provinces = provinces,
                    municipalities = municipalities,
                    communities = communities
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cascade data");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}