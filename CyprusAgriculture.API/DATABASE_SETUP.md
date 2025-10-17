# Database Setup Instructions

## PostgreSQL Server Configuration

**Server Details:**
- Host: `192.168.1.97`
- Database: `CyAgroQ`
- Username: `padmin`
- Password: `Aathapassword`

## Initial Setup Steps

### 1. Connect to PostgreSQL Server
```bash
psql -h 192.168.1.97 -U padmin -d postgres
```

### 2. Create Database (if not exists)
```sql
CREATE DATABASE "CyAgroQ";
```

### 3. Connect to the CyAgroQ Database
```bash
psql -h 192.168.1.97 -U padmin -d CyAgroQ
```

### 4. Run the Schema Creation Script
```bash
psql -h 192.168.1.97 -U padmin -d CyAgroQ -f Scripts/create_database.sql
```

## Entity Framework Migrations (Alternative Method)

If you prefer to use Entity Framework migrations instead of the SQL script:

### 1. Add Initial Migration
```bash
dotnet ef migrations add InitialCreate
```

### 2. Update Database
```bash
dotnet ef database update
```

### 3. Add Seed Data Migration (if needed)
```bash
dotnet ef migrations add SeedData
dotnet ef database update
```

## Connection String Verification

The connection strings in both `appsettings.json` and `appsettings.Development.json` are configured as:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=192.168.1.97;Database=CyAgroQ;Username=padmin;Password=Aathapassword"
  }
}
```

## Testing the Connection

### 1. Run the API
```bash
dotnet run
```

### 2. Check Health Endpoint
Navigate to: `https://localhost:7000/health`

### 3. Access Swagger Documentation
Navigate to: `https://localhost:7000/swagger`

## Database Tables Created

The script will create the following tables:
- `users`
- `locations`
- `themes`
- `questionnaires`
- `questionnaire_responses`
- `questionnaire_invitations`
- `questionnaire_quotas`

## Sample Data Included

The script includes:
- Cyprus regions (Λευκωσία, Λεμεσός, Λάρνακα, Πάφος, Αμμόχωστος)
- Themes (Φυτική Παραγωγή, Κτηνοτροφία, Αλιεία, Άρδευση)
- Sample admin user
- Sample questionnaire with quotas

## Troubleshooting

### Connection Issues
1. Verify server is accessible: `ping 192.168.1.97`
2. Check PostgreSQL service is running
3. Verify firewall settings allow connections on port 5432
4. Test connection with psql client

### Permission Issues
1. Ensure `padmin` user has necessary privileges
2. Grant permissions if needed:
```sql
GRANT ALL PRIVILEGES ON DATABASE "CyAgroQ" TO padmin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO padmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO padmin;
```

### SSL Issues
If you encounter SSL connection issues, you can modify the connection string to include SSL settings:
```
Host=192.168.1.97;Database=CyAgroQ;Username=padmin;Password=Aathapassword;SSL Mode=Prefer;Trust Server Certificate=true
```