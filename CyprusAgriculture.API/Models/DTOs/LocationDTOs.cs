namespace CyprusAgriculture.API.Models.DTOs
{
    public class CreateLocationRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "location"; // province, municipality, community, location
        public string? Province { get; set; }
        public string? Municipality { get; set; }
        public string? Community { get; set; }
        public string? Code { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }

    public class ImportResult
    {
        public int ProcessedCount { get; set; }
        public int SuccessCount { get; set; }
        public int RejectedCount { get; set; }
        public int AlreadyExistsCount { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
        
        public string Summary => 
            $"{SuccessCount} εγγραφές εισήχθησαν επιτυχώς, " +
            $"{RejectedCount} απορρίφθηκαν λόγω σφαλμάτων, " +
            $"{AlreadyExistsCount} υπάρχουν ήδη";
    }

    public class ImportPreview
    {
        public int TotalLines { get; set; }
        public List<ImportPreviewItem> PreviewItems { get; set; } = new List<ImportPreviewItem>();
    }

    public class ImportPreviewItem
    {
        public int LineNumber { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string Municipality { get; set; } = string.Empty;
        public string Community { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}