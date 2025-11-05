# PowerShell script to add demo data via API
$apiBase = "http://localhost:5050/api"

# Function to make POST requests
function Invoke-ApiPost {
    param(
        [string]$Endpoint,
        [hashtable]$Body
    )
    
    $json = $Body | ConvertTo-Json -Depth 10
    $headers = @{ "Content-Type" = "application/json" }
    
    try {
        $response = Invoke-RestMethod -Uri "$apiBase/$Endpoint" -Method POST -Body $json -Headers $headers
        Write-Host "✓ Created: $Endpoint" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "✗ Failed: $Endpoint - $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "Adding demo questionnaires..." -ForegroundColor Yellow

# Create demo questionnaires
$questionnaires = @(
    @{
        name = "Έρευνα Καλλιέργειας Σιτηρών 2025"
        description = "Λεπτομερής έρευνα για τις πρακτικές καλλιέργειας σιτηρών στην Κύπρο"
        category = "Σιτηρά"
        targetResponses = 150
        createdBy = "aaaaaaaa-1111-1111-1111-111111111111"
    },
    @{
        name = "Έρευνα Κτηνοτροφικών Μονάδων"
        description = "Αξιολόγηση των σύγχρονων πρακτικών κτηνοτροφίας στην Κύπρο"
        category = "Κτηνοτροφία"
        targetResponses = 120
        createdBy = "aaaaaaaa-1111-1111-1111-111111111111"
    },
    @{
        name = "Έρευνα Αρδευτικών Συστημάτων"
        description = "Μελέτη της χρήσης νερού και αρδευτικών συστημάτων"
        category = "Άρδευση"
        targetResponses = 200
        createdBy = "aaaaaaaa-1111-1111-1111-111111111111"
    },
    @{
        name = "Έρευνα Βιολογικής Γεωργίας"
        description = "Αξιολόγηση των πρακτικών βιολογικής καλλιέργειας"
        category = "Βιολογική Γεωργία"
        targetResponses = 80
        createdBy = "aaaaaaaa-1111-1111-1111-111111111111"
    },
    @{
        name = "Έρευνα Θερμοκηπιακών Καλλιεργειών"
        description = "Μελέτη θερμοκηπιακής παραγωγής και τεχνολογίας"
        category = "Θερμοκήπια"
        targetResponses = 90
        createdBy = "aaaaaaaa-1111-1111-1111-111111111111"
    },
    @{
        name = "Έρευνα Ελαιοπαραγωγής"
        description = "Παραγωγή ελαιολάδου και καλλιέργεια ελιάς"
        category = "Ελαιοκαλλιέργεια"
        targetResponses = 180
        createdBy = "aaaaaaaa-1111-1111-1111-111111111111"
    },
    @{
        name = "Έρευνα Αμπελοκαλλιέργειας"
        description = "Πρακτικές καλλιέργειας αμπελιού και οινοποίησης"
        category = "Αμπελοκαλλιέργεια"
        targetResponses = 65
        createdBy = "aaaaaaaa-1111-1111-1111-111111111111"
    },
    @{
        name = "Έρευνα Μηχανοποίησης"
        description = "Χρήση αγροτικών μηχανημάτων και τεχνολογίας"
        category = "Μηχανοποίηση"
        targetResponses = 100
        createdBy = "aaaaaaaa-1111-1111-1111-111111111111"
    }
)

$createdQuestionnaires = @()
foreach ($questionnaire in $questionnaires) {
    $result = Invoke-ApiPost -Endpoint "questionnaires" -Body $questionnaire
    if ($result) {
        $createdQuestionnaires += $result
    }
    Start-Sleep -Seconds 1
}

Write-Host "Demo questionnaires created: $($createdQuestionnaires.Count)" -ForegroundColor Green

# Create demo questionnaires with FormIO schemas
Write-Host "Adding questionnaires with FormIO schemas..." -ForegroundColor Yellow

$schemasData = @(
    @{
        name = "Έρευνα Εσπεριδοειδών"
        description = "Καλλιέργεια εσπεριδοειδών και διαχείριση φυτειών"
        category = "Εσπεριδοειδή"
        targetResponses = 110
        createdBy = "aaaaaaaa-1111-1111-1111-111111111111"
        schema = @{
            display = "form"
            components = @(
                @{
                    label = "Στοιχεία Παραγωγού"
                    tableView = $false
                    key = "producerInfo"
                    type = "container"
                    components = @(
                        @{
                            label = "Ονοματεπώνυμο"
                            tableView = $true
                            key = "fullName"
                            type = "textfield"
                            validate = @{ required = $true }
                        },
                        @{
                            label = "Κωδικός Εκμετάλλευσης"
                            tableView = $true
                            key = "farmCode"
                            type = "textfield"
                            validate = @{ required = $true }
                        }
                    )
                },
                @{
                    label = "Επαρχία"
                    widget = "choicesjs"
                    tableView = $true
                    data = @{
                        values = @(
                            @{ label = "Λευκωσία"; value = "nicosia" },
                            @{ label = "Λεμεσός"; value = "limassol" },
                            @{ label = "Λάρνακα"; value = "larnaca" },
                            @{ label = "Πάφος"; value = "paphos" },
                            @{ label = "Αμμόχωστος"; value = "famagusta" }
                        )
                    }
                    key = "province"
                    type = "select"
                    validate = @{ required = $true }
                },
                @{
                    label = "Συνολική Έκταση Εσπεριδοειδών (στρέμματα)"
                    mask = $false
                    tableView = $false
                    delimiter = $false
                    requireDecimal = $false
                    key = "citrusArea"
                    type = "number"
                    validate = @{ required = $true; min = 0 }
                },
                @{
                    label = "Ποικιλίες που καλλιεργείτε"
                    tableView = $false
                    key = "varieties"
                    type = "selectboxes"
                    values = @(
                        @{ label = "Πορτοκάλια"; value = "oranges" },
                        @{ label = "Λεμόνια"; value = "lemons" },
                        @{ label = "Γκρέιπφρουτ"; value = "grapefruit" },
                        @{ label = "Μανταρίνια"; value = "mandarins" }
                    )
                    validate = @{ required = $true }
                }
            )
        } | ConvertTo-Json -Depth 10
    }
)

foreach ($schemaData in $schemasData) {
    $result = Invoke-ApiPost -Endpoint "questionnaires/schema" -Body $schemaData
    if ($result) {
        Write-Host "✓ Created questionnaire with schema: $($schemaData.name)" -ForegroundColor Green
    }
    Start-Sleep -Seconds 1
}

Write-Host "Demo data creation completed!" -ForegroundColor Cyan
Write-Host "You can now check the questionnaires in the web application." -ForegroundColor Cyan