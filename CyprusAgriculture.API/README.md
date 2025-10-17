# Cyprus Agriculture API

Αυτό είναι το .NET Web API για το σύστημα ερωτηματολογίων του Υπουργείου Γεωργίας της Κύπρου.

## 🏗️ Αρχιτεκτονική

- **.NET 9.0** Web API
- **PostgreSQL** βάση δεδομένων
- **Entity Framework Core** για ORM
- **Swagger/OpenAPI** για documentation

## 📋 Προαπαιτούμενα

1. **.NET 9.0 SDK** 
2. **PostgreSQL 13+**
3. **Visual Studio 2022** ή **VS Code**

## 🚀 Εγκατάσταση και Setup

### 1. Δημιουργία Βάσης Δεδομένων

**PostgreSQL Server Configuration:**
- Host: `192.168.1.97`
- Database: `CyAgroQ` 
- Username: `padmin`
- Password: `Aathapassword`

```sql
-- Σύνδεση στον server και δημιουργία βάσης (ως padmin)
psql -h 192.168.1.97 -U padmin -d postgres
CREATE DATABASE "CyAgroQ";

-- Τρέξτε το script για τη δημιουργία tables
psql -h 192.168.1.97 -U padmin -d CyAgroQ -f Scripts/create_database.sql
```

Δείτε το `DATABASE_SETUP.md` για λεπτομερείς οδηγίες.

### 2. Ρύθμιση Connection String

Το connection string είναι ήδη ρυθμισμένο στα αρχεία:

`appsettings.json` και `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=192.168.1.97;Database=CyAgroQ;Username=padmin;Password=Aathapassword"
  }
}
```

**Σημείωση:** Για production, χρησιμοποιήστε environment variables ή Azure Key Vault για ασφαλή αποθήκευση credentials.

### 3. Εκτέλεση της Εφαρμογής

```bash
# Restore packages
dotnet restore

# Build
dotnet build

# Run
dotnet run
```

Η εφαρμογή θα τρέχει στο `https://localhost:7000` και το Swagger UI στο `https://localhost:7000/swagger`

## 📚 API Endpoints

### Questionnaires
- `GET /api/questionnaires` - Λίστα ερωτηματολογίων
- `GET /api/questionnaires/{id}` - Λεπτομέρειες ερωτηματολογίου
- `POST /api/questionnaires` - Δημιουργία νέου ερωτηματολογίου
- `PUT /api/questionnaires/{id}` - Ενημέρωση ερωτηματολογίου
- `PUT /api/questionnaires/{id}/publish` - Δημοσίευση ερωτηματολογίου
- `DELETE /api/questionnaires/{id}` - Διαγραφή ερωτηματολογίου

### Responses
- `GET /api/responses` - Λίστα απαντήσεων
- `GET /api/responses/{id}` - Λεπτομέρειες απάντησης
- `POST /api/responses` - Δημιουργία νέας απάντησης
- `PUT /api/responses/{id}` - Ενημέρωση απάντησης
- `POST /api/responses/{id}/submit` - Υποβολή απάντησης

### Dashboard
- `GET /api/dashboard/stats` - Στατιστικά στοιχεία
- `GET /api/dashboard/regional-data` - Περιφερειακά δεδομένα
- `GET /api/dashboard/response-trends` - Τάσεις απαντήσεων
- `GET /api/dashboard/category-distribution` - Κατανομή κατηγοριών

### Locations
- `GET /api/locations` - Λίστα τοποθεσιών
- `GET /api/locations/regions` - Περιφέρειες Κύπρου
- `GET /api/locations/{id}/children` - Υπο-τοποθεσίες

## 🗄️ Δομή Βάσης Δεδομένων

### Πίνακες
- `users` - Χρήστες του συστήματος
- `questionnaires` - Ερωτηματολόγια
- `questionnaire_responses` - Απαντήσεις σε ερωτηματολόγια
- `questionnaire_invitations` - Προσκλήσεις για συμμετοχή
- `questionnaire_quotas` - Ποσοστώσεις ανά περιφέρεια
- `locations` - Τοποθεσίες (περιφέρειες, δήμοι)
- `themes` - Θεματικές κατηγορίες

### Seed Data
Το script περιλαμβάνει initial data για:
- Περιφέρειες Κύπρου
- Θεματικές κατηγορίες
- Δείγμα admin χρήστη
- Δείγμα ερωτηματολογίου

## 🔧 Ανάπτυξη

### Entity Framework Migrations

```bash
# Δημιουργία migration
dotnet ef migrations add InitialCreate

# Εφαρμογή migration
dotnet ef database update
```

### Προσθήκη νέου Controller

1. Δημιουργήστε νέο controller στο φάκελο `Controllers`
2. Προσθέστε τα απαραίτητα endpoints
3. Ενημερώστε το Swagger documentation

## 🧪 Testing

```bash
# Unit tests
dotnet test

# Integration tests με βάση δεδομένων
dotnet test --filter Category=Integration
```

## 📦 Deployment

### Docker
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0
COPY bin/Release/net9.0/publish/ .
ENTRYPOINT ["dotnet", "CyprusAgriculture.API.dll"]
```

### Azure/Cloud
1. Δημιουργήστε PostgreSQL instance
2. Ενημερώστε connection string
3. Deploy μέσω Azure DevOps ή GitHub Actions

## 🔒 Ασφάλεια

- JWT Authentication (για μελλοντική υλοποίηση)
- CORS configuration για React app
- Input validation
- SQL injection protection μέσω EF Core

## 🐛 Debugging

### Logs
- Entity Framework queries
- Application errors
- Performance metrics

### Common Issues
1. **Connection String** - Ελέγξτε PostgreSQL credentials
2. **CORS** - Βεβαιωθείτε ότι η React app είναι στη whitelist
3. **Migrations** - Τρέξτε `dotnet ef database update`

## 📞 Υποστήριξη

Για ερωτήσεις ή προβλήματα:
- Ελέγξτε τα logs στο `/logs` directory
- Χρησιμοποιήστε το Swagger UI για testing
- Ελέγξτε το health endpoint: `/health`