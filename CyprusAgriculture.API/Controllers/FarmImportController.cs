using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;
using System.Text.Json;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FarmImportController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<FarmImportController> _logger;

        public FarmImportController(CyprusAgricultureDbContext context, ILogger<FarmImportController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("generate-sample-data")]
        public async Task<IActionResult> GenerateSampleData([FromQuery] int count = 850)
        {
            try
            {
                // Clear existing farms for demo
                var existingFarms = await _context.Farms.ToListAsync();
                _context.Farms.RemoveRange(existingFarms);

                var random = new Random();
                var farms = new List<Farm>();

                for (int i = 1; i <= count; i++)
                {
                    var province = CyprusData.Provinces[random.Next(CyprusData.Provinces.Length)];
                    var communities = CyprusData.GetCommunitiesForProvince(province);
                    var community = communities[random.Next(communities.Length)];

                    var farm = new Farm
                    {
                        Id = Guid.NewGuid().ToString(),
                        FarmCode = $"CY{i:D6}",
                        OwnerName = GenerateRandomName(),
                        ContactPhone = $"99{random.Next(100000, 999999)}",
                        ContactEmail = $"farmer{i}@example.com",
                        Province = province,
                        Community = community,
                        Address = $"Διεύθυνση {i}, {community}",
                        FarmType = CyprusData.FarmTypes[random.Next(CyprusData.FarmTypes.Length)],
                        TotalArea = (decimal)(random.NextDouble() * 500), // 0-500 στρέμματα
                        SizeCategory = CyprusData.SizeCategories[random.Next(CyprusData.SizeCategories.Length)],
                        EconomicSize = CyprusData.EconomicSizes[random.Next(CyprusData.EconomicSizes.Length)],
                        LegalStatus = CyprusData.LegalStatuses[random.Next(CyprusData.LegalStatuses.Length)],
                        MainCrops = JsonSerializer.Serialize(GetRandomCrops(random)),
                        LivestockTypes = JsonSerializer.Serialize(GetRandomLivestock(random)),
                        AnnualProductionValue = (decimal)(random.NextDouble() * 500000), // 0-500,000€
                        Latitude = (decimal)(34.5 + random.NextDouble() * 1.0), // Cyprus latitude range
                        Longitude = (decimal)(32.0 + random.NextDouble() * 2.0), // Cyprus longitude range
                        RegistrationDate = DateTime.UtcNow.AddDays(-random.Next(365 * 5)), // Last 5 years
                        IsActive = random.Next(100) < 95, // 95% active
                        CreatedAt = DateTime.UtcNow
                    };

                    farms.Add(farm);
                }

                await _context.Farms.AddRangeAsync(farms);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    success = true, 
                    message = $"Successfully generated {count} sample farms",
                    count = farms.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating sample farm data");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("farms-summary")]
        public async Task<IActionResult> GetFarmsSummary()
        {
            try
            {
                var totalFarms = await _context.Farms.CountAsync();
                var activeFarms = await _context.Farms.CountAsync(f => f.IsActive);
                
                var provinceStats = await _context.Farms
                    .Where(f => f.IsActive)
                    .GroupBy(f => f.Province)
                    .Select(g => new { Province = g.Key, Count = g.Count() })
                    .OrderByDescending(x => x.Count)
                    .ToListAsync();

                var farmTypeStats = await _context.Farms
                    .Where(f => f.IsActive)
                    .GroupBy(f => f.FarmType)
                    .Select(g => new { FarmType = g.Key, Count = g.Count() })
                    .OrderByDescending(x => x.Count)
                    .ToListAsync();

                return Ok(new {
                    totalFarms,
                    activeFarms,
                    provinceStats,
                    farmTypeStats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting farms summary");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("sample-farms")]
        public async Task<IActionResult> GetSampleFarms(int count = 5)
        {
            try
            {
                var farms = await _context.Farms
                    .Where(f => f.IsActive)
                    .Take(count)
                    .Select(f => new
                    {
                        f.Id,
                        f.FarmCode,
                        f.OwnerName,
                        f.Province,
                        f.Community,
                        f.FarmType,
                        f.MainCrops,
                        f.LivestockTypes,
                        f.TotalArea,
                        f.EconomicSize,
                        f.LegalStatus
                    })
                    .ToListAsync();
                
                return Ok(farms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sample farms");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        private string GenerateRandomName()
        {
            var firstNames = new[] { "Γιάννης", "Μαρία", "Νίκος", "Ελένη", "Κώστας", "Άννα", "Πέτρος", "Σοφία", "Μιχάλης", "Κατερίνα" };
            var lastNames = new[] { "Παπαδόπουλος", "Γεωργίου", "Νικολάου", "Χαραλάμπους", "Ανδρέου", "Δημητρίου", "Κωνσταντίνου", "Μιχαήλ", "Στυλιανού", "Παναγιώτου" };
            
            var random = new Random();
            return $"{firstNames[random.Next(firstNames.Length)]} {lastNames[random.Next(lastNames.Length)]}";
        }

        private string[] GetRandomCrops(Random random)
        {
            var cropCount = random.Next(1, 4); // 1-3 crops
            var selectedCrops = new List<string>();
            var availableCrops = CyprusData.MainCrops.ToList();

            for (int i = 0; i < cropCount; i++)
            {
                var index = random.Next(availableCrops.Count);
                selectedCrops.Add(availableCrops[index]);
                availableCrops.RemoveAt(index);
            }

            return selectedCrops.ToArray();
        }

        private string[] GetRandomLivestock(Random random)
        {
            if (random.Next(100) < 60) // 60% chance of having livestock
            {
                var livestockCount = random.Next(1, 3); // 1-2 types
                var selectedLivestock = new List<string>();
                var availableLivestock = CyprusData.LivestockTypes.ToList();

                for (int i = 0; i < livestockCount; i++)
                {
                    var index = random.Next(availableLivestock.Count);
                    selectedLivestock.Add(availableLivestock[index]);
                    availableLivestock.RemoveAt(index);
                }

                return selectedLivestock.ToArray();
            }

            return Array.Empty<string>();
        }
    }
}