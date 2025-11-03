namespace CyprusAgriculture.API.Data
{
    public static class CyprusData
    {
        public static readonly string[] Provinces = new[]
        {
            "Λευκωσία",
            "Λεμεσός",
            "Λάρνακα",
            "Πάφος",
            "Αμμόχωστος"
        };

        public static readonly Dictionary<string, string[]> Communities = new()
        {
            ["Λευκωσία"] = new[] { "Λευκωσία", "Στρόβολος", "Λατσιά", "Αγλαντζιά", "Έγκωμη", "Δάλι", "Πέρα", "Κοκκινοτριμιθιά", "Λαϊκή Γειτονιά", "Αγία Μαρίνα" },
            ["Λεμεσός"] = new[] { "Λεμεσός", "Γερμασόγεια", "Πολεμίδια", "Άγιος Αθανάσιος", "Υψώνας", "Κολόσσι", "Ερήμη", "Μέσα Γειτονιά", "Πύργος", "Παρεκκλησιά" },
            ["Λάρνακα"] = new[] { "Λάρνακα", "Αραδίππου", "Λιβάδια", "Ορόκλινη", "Δρομολαξιά", "Κίτι", "Πύλα", "Αθηένου", "Τέρνα", "Ζύγι" },
            ["Πάφος"] = new[] { "Πάφος", "Γερόσκηπου", "Έμπα", "Πέγεια", "Πόλις Χρυσοχούς", "Κίσσονεργα", "Χλώρακα", "Μεσόγη", "Τρεμιθούσα", "Αγία Μαρινούδα" },
            ["Αμμόχωστος"] = new[] { "Παραλίμνι", "Δερύνεια", "Αυγόρου", "Σωτήρα", "Φρέναρος", "Αχερίτου", "Λιοπέτρι", "Ορμήδεια", "Πρωταράς", "Κάβο Γκρέκο" }
        };

        public static readonly string[] FarmTypes = new[]
        {
            "Φυτική Παραγωγή",
            "Ζωική Παραγωγή",
            "Μικτή Εκμετάλλευση",
            "Κηπευτικά",
            "Οπωροφόρα",
            "Αμπελώνες",
            "Ελαιώνες"
        };

        public static readonly string[] SizeCategories = new[]
        {
            "Πολύ Μικρή (0-5 στρέμματα)",
            "Μικρή (5-20 στρέμματα)",
            "Μεσαία (20-100 στρέμματα)",
            "Μεγάλη (100-500 στρέμματα)",
            "Πολύ Μεγάλη (>500 στρέμματα)"
        };

        public static readonly string[] EconomicSizes = new[]
        {
            "Πολύ Μικρό (0-8.000€)",
            "Μικρό (8.000-25.000€)",
            "Μεσαίο (25.000-100.000€)",
            "Μεγάλο (100.000-500.000€)",
            "Πολύ Μεγάλο (>500.000€)"
        };

        public static readonly string[] LegalStatuses = new[]
        {
            "Φυσικό Πρόσωπο",
            "Εταιρεία",
            "Συνεταιρισμός",
            "Οικογενειακή Επιχείρηση"
        };

        public static readonly string[] MainCrops = new[]
        {
            "Σιτάρι",
            "Κριθάρι",
            "Καλαμπόκι",
            "Πατάτες",
            "Τομάτες",
            "Αγγούρια",
            "Πεπόνια",
            "Καρπούζια",
            "Εσπεριδοειδή",
            "Ελιές",
            "Σταφύλια",
            "Αμύγδαλα",
            "Χαρούπια"
        };

        public static readonly string[] LivestockTypes = new[]
        {
            "Βοοειδή",
            "Αιγοπρόβατα",
            "Χοιροτροφία",
            "Πουλερικά",
            "Μελίσσια"
        };

        // Helper methods
        public static string[] GetCommunitiesForProvince(string province)
        {
            return Communities.TryGetValue(province, out var communities) ? communities : Array.Empty<string>();
        }

        public static bool IsValidProvince(string province)
        {
            return Provinces.Contains(province);
        }

        public static bool IsValidCommunity(string province, string community)
        {
            return Communities.TryGetValue(province, out var communities) && communities.Contains(community);
        }
    }
}