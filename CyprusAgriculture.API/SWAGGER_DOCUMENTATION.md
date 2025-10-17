# Swagger API Documentation

## Πρόσβαση στο Swagger UI

Μετά την εκτέλεση του API (`dotnet run`), μπορείτε να προσπελάσετε το Swagger UI στις παρακάτω διευθύνσεις:

### Development Environment
- **Swagger UI:** `https://localhost:7000/swagger`
- **OpenAPI JSON:** `https://localhost:7000/swagger/v1/swagger.json`
- **Health Check:** `https://localhost:7000/health`

### Production Environment
- **Swagger UI:** `https://your-domain.com/swagger`
- **OpenAPI JSON:** `https://your-domain.com/swagger/v1/swagger.json`
- **Health Check:** `https://your-domain.com/health`

## Swagger Features

Το Swagger UI περιλαμβάνει:

### 📋 Πλήρη API Documentation
- Όλα τα available endpoints
- Request/Response schemas
- HTTP status codes
- Parameter descriptions

### 🧪 Interactive Testing
- **Try it out** buttons για κάθε endpoint
- Real-time API calls
- Response preview
- Request duration tracking

### 🔍 Advanced Features
- **Filtering:** Αναζήτηση endpoints
- **Deep linking:** Direct links to specific operations
- **Model expansion:** Detailed schema information
- **Authentication support:** Ready for JWT implementation

## API Endpoints Overview

### 🏠 Dashboard
- `GET /api/dashboard/stats` - Βασικά στατιστικά
- `GET /api/dashboard/regional-data` - Περιφερειακά δεδομένα
- `GET /api/dashboard/response-trends` - Τάσεις απαντήσεων
- `GET /api/dashboard/category-distribution` - Κατανομή κατηγοριών
- `GET /api/dashboard/recent-activity` - Πρόσφατη δραστηριότητα

### 📝 Questionnaires
- `GET /api/questionnaires` - Λίστα ερωτηματολογίων
- `GET /api/questionnaires/{id}` - Λεπτομέρειες ερωτηματολογίου
- `POST /api/questionnaires` - Δημιουργία νέου
- `PUT /api/questionnaires/{id}` - Ενημέρωση
- `PUT /api/questionnaires/{id}/publish` - Δημοσίευση
- `DELETE /api/questionnaires/{id}` - Διαγραφή
- `GET /api/questionnaires/{id}/responses` - Απαντήσεις ερωτηματολογίου

### 📊 Responses
- `GET /api/responses` - Λίστα απαντήσεων
- `GET /api/responses/{id}` - Λεπτομέρειες απάντησης
- `POST /api/responses` - Δημιουργία νέας απάντησης
- `PUT /api/responses/{id}` - Ενημέρωση απάντησης
- `POST /api/responses/{id}/submit` - Υποβολή απάντησης
- `GET /api/responses/summary` - Σύνοψη απαντήσεων

### 📍 Locations
- `GET /api/locations` - Λίστα τοποθεσιών
- `GET /api/locations/regions` - Περιφέρειες Κύπρου
- `GET /api/locations/{id}/children` - Υπο-τοποθεσίες

## Authentication (Μελλοντική υλοποίηση)

Το Swagger είναι ήδη ρυθμισμένο για JWT Bearer authentication:

### Security Scheme
```json
{
  "Bearer": {
    "type": "apiKey",
    "name": "Authorization",
    "in": "header",
    "description": "JWT Authorization header using the Bearer scheme"
  }
}
```

### Usage
Όταν η authentication θα ενεργοποιηθεί:
1. Κάντε κλικ στο **"Authorize"** button
2. Εισάγετε: `Bearer <your-jwt-token>`
3. Όλα τα requests θα περιλαμβάνουν το Authorization header

## Customization

### Swagger UI Settings
Στο `Program.cs` μπορείτε να προσαρμόσετε:

```csharp
c.DefaultModelsExpandDepth(-1); // Hide models by default
c.DisplayRequestDuration();     // Show request timing
c.EnableFilter();              // Enable endpoint filtering
c.EnableDeepLinking();         // Enable deep linking
c.DocumentTitle = "Custom Title"; // Custom page title
```

### API Information
```csharp
c.SwaggerDoc("v1", new OpenApiInfo
{
    Title = "Cyprus Agriculture API",
    Version = "v1",
    Description = "API for Cyprus Agriculture Questionnaires System",
    Contact = new OpenApiContact
    {
        Name = "Ministry of Agriculture Cyprus",
        Email = "support@agriculture.gov.cy"
    }
});
```

## Export Options

### OpenAPI Specification
Μπορείτε να κατεβάσετε το OpenAPI spec σε:
- **JSON format:** `/swagger/v1/swagger.json`
- **YAML format:** Χρησιμοποιήστε online converters

### Code Generation
Χρησιμοποιήστε το OpenAPI spec για:
- **Client generation:** TypeScript, C#, Java, Python clients
- **Postman collections:** Import στο Postman
- **API testing:** Automated testing tools

## Best Practices

### Development
1. **Always test endpoints** στο Swagger πριν την integration
2. **Check response schemas** για correct data structure
3. **Test error scenarios** (404, 500, etc.)
4. **Verify parameter validation** 

### Production
1. **Disable Swagger** σε production environments αν χρειάζεται
2. **Protect sensitive endpoints** με authentication
3. **Monitor API usage** μέσω του Swagger metrics
4. **Keep documentation updated** με κάθε API change

## Troubleshooting

### Common Issues

**Swagger UI δεν φορτώνει:**
- Ελέγξτε ότι το API τρέχει
- Βεβαιωθείτε ότι είστε σε Development mode
- Ελέγξτε τα logs για errors

**Endpoints δεν εμφανίζονται:**
- Βεβαιωθείτε ότι οι Controllers έχουν `[ApiController]` attribute
- Ελέγξτε το routing `[Route("api/[controller]")]`
- Rebuild το project

**Authentication δεν λειτουργεί:**
- Ελέγξτε το JWT token format
- Βεβαιωθείτε ότι περιλαμβάνεται το "Bearer " prefix
- Ελέγξτε token expiration

### Debug Mode
Για περισσότερες πληροφορίες, ενεργοποιήστε detailed logging:

```json
{
  "Logging": {
    "LogLevel": {
      "Microsoft.AspNetCore": "Information",
      "Swashbuckle": "Debug"
    }
  }
}
```