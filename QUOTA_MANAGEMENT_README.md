# Quota Management System - Σύστημα Διαχείρισης Ποσοστώσεων

## Περιγραφή

Το σύστημα Quota Management επιτρέπει την διαχείριση και παρακολούθηση στόχων συμμετεχόντων σε ερωτηματολόγια με βάση συγκεκριμένα κριτήρια. Είναι ιδιαίτερα χρήσιμο για έρευνες που απαιτούν συγκεκριμένες αναλογίες συμμετεχόντων ανά κατηγορία.

## Χαρακτηριστικά

### 1. Διαχείριση Quotas (QuotaManagement)
- **Δημιουργία Quotas**: Ορισμός νέων quotas με όνομα, περιγραφή και στόχο
- **Κριτήρια**: Δημιουργία σύνθετων κριτηρίων με βάση μεταβλητές (AND/OR λογική)
- **Διαχείριση**: Ενεργοποίηση/απενεργοποίηση, προτεραιότητα, αυτόματη διακοπή
- **Επεξεργασία**: Τροποποίηση υπαρχόντων quotas

### 2. Παρακολούθηση Πραγματικού Χρόνου (QuotaMonitoringDashboard)
- **Στατιστικά**: Σύνολο quotas, ολοκληρωμένα, ενεργά, κοντά στο τέλος
- **Πρόοδος**: Ποσοστό ολοκλήρωσης, εναπομένοντα, σε εξέλιξη
- **Μετρικές**: Ημερήσιες/εβδομαδιαίες ολοκληρώσεις, μέσος χρόνος, εκτιμώμενη ολοκλήρωση
- **Αυτόματη Ανανέωση**: Παρακολούθηση με ρυθμιζόμενο interval

### 3. Κατανομή Συμμετεχόντων (QuotaAllocationManager)
- **Χειροκίνητη Κατανομή**: Επιλογή συμμετεχόντων για συγκεκριμένα quotas
- **Αυτόματη Κατανομή**: Αλγόριθμος που κατανέμει βάσει κριτηρίων και προτεραιότητας
- **Διαχείριση**: Αφαίρεση κατανομών, παρακολούθηση κατάστασης
- **Επιλεξιμότητα**: Εμφάνιση επιλέξιμων συμμετεχόντων με match score

## Τεχνική Υλοποίηση

### Backend (.NET 9)

#### Μοντέλα Δεδομένων
```csharp
// Quota.cs - Κύριο μοντέλο quota
public class Quota
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public Guid QuestionnaireId { get; set; }
    public QuotaCriteria Criteria { get; set; } // JSON field
    public int TargetCount { get; set; }
    public bool IsActive { get; set; }
    public bool AutoStop { get; set; }
    public int Priority { get; set; }
    
    // Calculated properties
    public int CompletedCount => QuotaResponses.Count(r => r.Status == "completed");
    public int InProgressCount => QuotaResponses.Count(r => r.Status == "in_progress");
    public double CompletionPercentage => TargetCount > 0 ? (double)CompletedCount / TargetCount * 100 : 0;
}

// QuotaResponse.cs - Απαντήσεις σε quota
public class QuotaResponse
{
    public Guid Id { get; set; }
    public Guid QuotaId { get; set; }
    public string ParticipantId { get; set; }
    public string Status { get; set; } // allocated, in_progress, completed, dropped_out
    public DateTime AllocationDate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? CompletionDate { get; set; }
}

// QuotaVariable.cs - Μεταβλητές για κριτήρια
public class QuotaVariable
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string DisplayName { get; set; }
    public string VariableType { get; set; }
    public string DataType { get; set; }
    public List<QuotaVariableValue> PossibleValues { get; set; }
}
```

#### API Endpoints
```csharp
[ApiController]
[Route("api/[controller]")]
public class QuotasController : ControllerBase
{
    // CRUD Operations
    [HttpGet] public async Task<ActionResult<IEnumerable<QuotaDto>>> GetQuotas()
    [HttpGet("{id}")] public async Task<ActionResult<QuotaDto>> GetQuota(Guid id)
    [HttpPost] public async Task<ActionResult<QuotaDto>> CreateQuota(CreateQuotaRequest request)
    [HttpPut("{id}")] public async Task<IActionResult> UpdateQuota(Guid id, UpdateQuotaRequest request)
    [HttpDelete("{id}")] public async Task<IActionResult> DeleteQuota(Guid id)
    
    // Monitoring & Analytics
    [HttpGet("monitoring")] public async Task<ActionResult<IEnumerable<QuotaMonitoringDto>>> GetQuotaMonitoring()
    [HttpGet("summary")] public async Task<ActionResult<IEnumerable<QuotaSummaryDto>>> GetQuotaSummary()
    
    // Participant Allocation
    [HttpGet("allocations")] public async Task<ActionResult<IEnumerable<ParticipantAllocationDto>>> GetAllocations()
    [HttpGet("eligible-participants")] public async Task<ActionResult<IEnumerable<ParticipantEligibilityDto>>> GetEligibleParticipants()
    [HttpPost("allocate")] public async Task<ActionResult<AllocationResultDto>> AllocateParticipant(AllocationRequest request)
    [HttpPost("auto-allocate")] public async Task<ActionResult<AutoAllocationResultDto>> AutoAllocateParticipants()
    [HttpPost("deallocate")] public async Task<IActionResult> DeallocateParticipant(DeallocationRequest request)
    
    // Variables Management
    [HttpGet("variables")] public async Task<ActionResult<IEnumerable<QuotaVariableDto>>> GetQuotaVariables()
}
```

### Frontend (React TypeScript)

#### Component Δομή
```
src/components/
├── QuotaManagement.tsx          // Κύρια διαχείριση quotas
├── QuotaMonitoringDashboard.tsx // Παρακολούθηση πραγματικού χρόνου
└── QuotaAllocationManager.tsx   // Κατανομή συμμετεχόντων
```

#### Κλειδί Features
- **TypeScript Interfaces**: Πλήρης type safety
- **Real-time Updates**: Αυτόματη ανανέωση κάθε 30 δευτερόλεπτα
- **Responsive Design**: Tailwind CSS για όλες τις οθόνες
- **Form Validation**: Επικύρωση δεδομένων και σφαλμάτων
- **Πολυγλωσσικότητα**: Υποστήριξη Ελληνικών/Αγγλικών

## Χρήση

### 1. Δημιουργία Quota
1. Πηγαίνετε στο "Ποσοστώσεις" > "Διαχείριση Ποσοστώσεων"
2. Κλικ "Νέο Quota"
3. Συμπληρώστε όνομα και στόχο
4. Προσθέστε κριτήρια επιλέγοντας μεταβλητές και τιμές
5. Ορίστε λογική σύνδεσης (AND/OR)
6. Αποθηκεύστε

### 2. Παρακολούθηση
1. Πηγαίνετε στο "Ποσοστώσεις" > "Παρακολούθηση"
2. Δείτε στατιστικά και πρόοδο σε πραγματικό χρόνο
3. Επιλέξτε quota για λεπτομέρειες
4. Ενεργοποιήστε αυτόματη ανανέωση

### 3. Κατανομή Συμμετεχόντων
1. Πηγαίνετε στο "Ποσοστώσεις" > "Κατανομή Συμμετεχόντων"
2. Δείτε τρέχουσες κατανομές και επιλέξιμους συμμετέχοντες
3. Χρησιμοποιήστε αυτόματη ή χειροκίνητη κατανομή
4. Παρακολουθήστε την κατάσταση

## Παραδείγματα Κριτηρίων

### Απλό Κριτήριο
```json
{
  "criteria": [
    {
      "variableName": "farm_size",
      "displayName": "Μέγεθος Εκμετάλλευσης",
      "operator": "equals",
      "values": ["small"],
      "variableType": "categorical"
    }
  ],
  "logic": "AND"
}
```

### Σύνθετο Κριτήριο
```json
{
  "criteria": [
    {
      "variableName": "region",
      "displayName": "Περιοχή",
      "operator": "in",
      "values": ["Λευκωσία", "Λεμεσός"],
      "variableType": "categorical"
    },
    {
      "variableName": "crop_type",
      "displayName": "Τύπος Καλλιέργειας",
      "operator": "equals",
      "values": ["olive"],
      "variableType": "categorical"
    }
  ],
  "logic": "AND"
}
```

## Παραμετροποίηση

### Μεταβλητές Συστήματος
- `refreshInterval`: Χρόνος ανανέωσης παρακολούθησης (default: 30s)
- `maxAllocationsPerRun`: Μέγιστες κατανομές ανά αυτόματη εκτέλεση
- `allocationTimeout`: Χρόνος λήξης κατανομής συμμετέχοντα

### Database Configuration
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=your-host;Database=cyprus_agriculture;Username=your-username;Password=your-password"
  }
}
```

## Troubleshooting

### Συχνά Προβλήματα

1. **Quota δεν ενημερώνεται**
   - Ελέγξτε τη σύνδεση με τη βάση δεδομένων
   - Επιβεβαιώστε ότι το API τρέχει

2. **Κριτήρια δεν λειτουργούν**
   - Ελέγξτε ότι οι μεταβλητές είναι σωστά ορισμένες
   - Επικυρώστε τη JSON δομή των κριτηρίων

3. **Αυτόματη κατανομή αποτυγχάνει**
   - Ελέγξτε ότι υπάρχουν επιλέξιμοι συμμετέχοντες
   - Επιβεβαιώστε ότι τα quotas είναι ενεργά

## Μελλοντικές Βελτιώσεις

- **Email Notifications**: Ειδοποιήσεις για quota completion
- **Advanced Analytics**: Προβλέψεις και τάσεις
- **API Rate Limiting**: Περιορισμός αιτημάτων
- **Audit Trail**: Λογαριασμός αλλαγών
- **Export Features**: Εξαγωγή αναφορών σε Excel/PDF

## Υποστήριξη

Για τεχνική υποστήριξη ή ερωτήσεις, επικοινωνήστε με την ομάδα ανάπτυξης.