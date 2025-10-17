# Database Scripts

Αυτά τα scripts βοηθούν στη διαχείριση της βάσης δεδομένων για το Cyprus Agriculture Questionnaires system.

## Scripts Διαθέσιμα

### 1. `create_database.sql`
**Σκοπός:** Πλήρη δημιουργία της βάσης δεδομένων με όλα τα tables και αρχικά δεδομένα.

**Περιεχόμενα:**
- Δημιουργία όλων των tables
- Indexes και constraints
- Δεδομένα για τις περιοχές της Κύπρου
- Θέματα questionnaires
- Ένα sample questionnaire

**Πότε να χρησιμοποιήσετε:** Όταν δημιουργείτε τη βάση από την αρχή.

### 2. `add_users_only.sql`
**Σκοπός:** Προσθήκη μόνο των βασικών test users.

**Περιεχόμενα:**
- Admin user: `admin@agriculture.gov.cy`
- Analyst user: `user@agriculture.gov.cy`  
- Farmer user: `farmer@email.com`

**Πότε να χρησιμοποιήσετε:** Όταν έχετε ήδη τη βάση και θέλετε μόνο users.

### 2b. `safe_add_users.sql` (RECOMMENDED)
**Σκοπός:** Ασφαλής προσθήκη users με έλεγχο schema.

**Τι κάνει:**
- Ελέγχει ποια columns υπάρχουν στον πίνακα users
- Προσπαθεί να προσθέσει users με error handling
- Δίνει λεπτομερή feedback για τι συμβαίνει

**Πότε να χρησιμοποιήσετε:** Όταν δεν είστε σίγουροι για το schema της βάσης.

### 3. `add_sample_data.sql`
**Σκοπός:** Προσθήκη πλήρων sample δεδομένων (users + questionnaires + responses).

**Περιεχόμενα:**
- 3 test users
- 2 επιπλέον questionnaires
- 3 sample responses
- Questionnaire invitations

**Πότε να χρησιμοποιήσετε:** Όταν θέλετε πλήρη demo δεδομένα για testing.

### 3b. `safe_sample_data.sql` (RECOMMENDED)
**Σκοπός:** Ασφαλής προσθήκη πλήρων demo δεδομένων με proper dependency handling.

**Τι κάνει:**
- Χειρίζεται foreign key dependencies σωστά
- Εκτελεί σε βήματα: Users → Questionnaires → Responses → Invitations
- Έλεγχος ύπαρξης σε κάθε βήμα
- Λεπτομερές feedback και error handling

**Πότε να χρησιμοποιήσετε:** Όταν θέλετε να αποφύγετε foreign key errors.

### 4. `check_database_status.sql`
**Σκοπός:** Έλεγχος της κατάστασης της βάσης δεδομένων.

**Τι κάνει:**
- Ελέγχει αν υπάρχουν όλα τα tables
- Μετράει records σε κάθε table
- Εμφανίζει sample δεδομένα

**Πότε να χρησιμοποιήσετε:** Για debugging ή verification.

## Οδηγίες Χρήσης

### Βήμα 1: Αρχική Εγκατάσταση
```sql
-- Τρέξτε πρώτα το κύριο script
\i create_database.sql
```

### Βήμα 2: Προσθήκη Demo Users (επιλογή Α)
```sql
-- Ασφαλής τρόπος (ΠΡΟΤΕΙΝΕΤΑΙ)
\i safe_add_users.sql

-- Ή απλός τρόπος (αν ξέρετε το schema)
\i add_users_only.sql
```

### Βήμα 2: Προσθήκη Demo Data (επιλογή Β)
```sql
-- Ασφαλής τρόπος με dependency handling (ΠΡΟΤΕΙΝΕΤΑΙ)
\i safe_sample_data.sql

-- Ή απλός τρόπος (αν όλα είναι σωστά)
\i add_sample_data.sql
```

### Βήμα 3: Έλεγχος
```sql
-- Ελέγξτε ότι όλα είναι εντάξει
\i check_database_status.sql
```

## Connection Details

**Database:** CyAgroQ  
**Server:** 192.168.1.97  
**User:** padmin  
**Password:** Aathapassword

## Test Users

Μετά την εκτέλεση των scripts, θα έχετε αυτούς τους χρήστες:

1. **Administrator**
   - Email: `admin@agriculture.gov.cy`
   - Role: `admin`
   - Region: Λευκωσία

2. **Analyst** 
   - Email: `user@agriculture.gov.cy`
   - Role: `analyst`
   - Region: Λεμεσός

3. **Farmer**
   - Email: `farmer@email.com` 
   - Role: `farmer`
   - Region: Πάφος

## API Integration

Μετά την εγκατάσταση της βάσης:

1. Ενεργοποιήστε το .NET API:
   ```bash
   cd CyprusAgriculture.API
   dotnet run
   ```

2. Ανοίξτε το Swagger UI: https://localhost:7000/swagger

3. Δοκιμάστε το login endpoint με έναν από τους test users

## Troubleshooting

### Αν δεν μπορείτε να συνδεθείτε στη βάση:
```sql
-- Ελέγξτε τη σύνδεση
SELECT current_database(), current_user, version();
```

### Αν χρειάζεστε να ξαναδημιουργήσετε τη βάση:
```sql
-- ΠΡΟΣΟΧΗ: Διαγράφει όλα τα δεδομένα!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Μετά τρέξτε το create_database.sql
```

### Αν θέλετε να προσθέσετε νέο χρήστη:
```sql
INSERT INTO "Users" ("Id", "Email", "FirstName", "LastName", "Role", "Region", "Organization", "CreatedAt", "UpdatedAt")
VALUES (
    gen_random_uuid(),
    'newemail@example.com',
    'Όνομα',
    'Επώνυμο', 
    'farmer', -- ή 'admin', 'analyst'
    'Λάρνακα',
    'Οργανισμός',
    NOW(),
    NOW()
);
```