# 📊 Σύστημα Πινάκων για Ερωτηματολόγια - Υπουργείο Γεωργίας Κύπρου

## 🎯 Περιγραφή
Το σύστημα υποστηρίζει τη δημιουργία ερωτηματολογίων με πίνακες που είναι συμβατοί με την κωδικοποίηση των Πινάκων του κανονισμού. Οι πίνακες μπορούν να δέχονται πολλαπλές στήλες για ανάλυση ανά κατηγορία (ζωικό κεφάλαιο, κωδικός καλλιέργειας, προϊόντος κ.ο.κ.).

## 🛠️ Χαρακτηριστικά

### ✨ TableBuilder Component
- **Δημιουργία στηλών** με διάφορους τύπους (κείμενο, αριθμός, ημερομηνία, επιλογές)
- **Κωδικοποίηση** κάθε στήλης για συμβατότητα με κανονισμούς (π.χ. LST001, CRP002)
- **Κατηγοριοποίηση** στηλών (Ζωικό κεφάλαιο, Καλλιέργειες, Προϊόντα, κλπ.)
- **Επικύρωση** δεδομένων (min/max τιμές, υποχρεωτικά πεδία)
- **Ρυθμίσεις γραμμών** (ελάχιστες/μέγιστες γραμμές, δυνατότητα προσθήκης/διαγραφής)

### 📋 TableViewer Component
- **Συμπλήρωση** πινάκων από τους χρήστες
- **Δυναμική προσθήκη/διαγραφή** γραμμών
- **Επικύρωση** σε πραγματικό χρόνο
- **Υποστήριξη** πολλαπλών τύπων επιλογών (select, multiselect, checkbox)
- **Responsive design** για mobile συσκευές

### 🔧 QuestionnaireBuilder Integration
- **Νέος τύπος ερώτησης**: "Πίνακας"
- **Tab interface** για διαμόρφωση πίνακα
- **Preview** λειτουργικότητα
- **Export/Import** schema με table configuration

### 📱 QuestionnaireViewer Integration
- **Seamless integration** με υπάρχουσες ερωτήσεις
- **Προσαρμοστικό UI** ανάλογα με τη διαμόρφωση του πίνακα
- **Αποθήκευση δεδομένων** σε JSON format

## 📊 Παραδείγματα Χρήσης

### 1. Πίνακας Ζωικού Κεφαλαίου
```json
{
  "id": "livestock-table-1",
  "name": "Αριθμός Ζώων ανά Κατηγορία",
  "nameEn": "Number of Animals by Category",
  "columns": [
    {
      "id": "animal-type",
      "name": "Τύπος Ζώου",
      "nameEn": "Animal Type",
      "type": "select",
      "code": "LST001",
      "category": "livestock",
      "required": true,
      "options": ["Βοοειδή", "Αιγοπρόβατα", "Χοίροι", "Πουλερικά"]
    },
    {
      "id": "count",
      "name": "Αριθμός",
      "nameEn": "Count",
      "type": "number",
      "code": "LST002",
      "category": "livestock",
      "required": true,
      "validation": { "min": 0, "max": 10000 }
    }
  ],
  "minRows": 1,
  "maxRows": 10,
  "allowAddRows": true,
  "allowDeleteRows": true
}
```

### 2. Πίνακας Καλλιεργειών
```json
{
  "id": "crops-table-1",
  "name": "Καλλιέργειες και Στρέμματα",
  "nameEn": "Crops and Area",
  "columns": [
    {
      "id": "crop-code",
      "name": "Κωδικός Καλλιέργειας",
      "nameEn": "Crop Code",
      "type": "text",
      "code": "CRP001",
      "category": "crops",
      "required": true
    },
    {
      "id": "crop-name",
      "name": "Όνομα Καλλιέργειας",
      "nameEn": "Crop Name",
      "type": "select",
      "code": "CRP002",
      "category": "crops",
      "required": true,
      "options": ["Σιτάρι", "Κριθάρι", "Καλαμπόκι", "Ελιές", "Αμπέλια"]
    },
    {
      "id": "area",
      "name": "Στρέμματα",
      "nameEn": "Area (Stremma)",
      "type": "number",
      "code": "CRP003", 
      "category": "crops",
      "required": true,
      "validation": { "min": 0.1, "max": 1000 }
    },
    {
      "id": "organic",
      "name": "Βιολογική Καλλιέργεια",
      "nameEn": "Organic Farming",
      "type": "checkbox",
      "code": "CRP004",
      "category": "crops",
      "required": false
    }
  ]
}
```

### 3. Πίνακας Προϊόντων
```json
{
  "id": "products-table-1",
  "name": "Παραγόμενα Προϊόντα",
  "nameEn": "Produced Products",
  "columns": [
    {
      "id": "product-type",
      "name": "Κατηγορία Προϊόντος",
      "nameEn": "Product Category",
      "type": "select",
      "code": "PRD001",
      "category": "products",
      "required": true,
      "options": ["Γάλα", "Κρέας", "Αυγά", "Μέλι", "Τυρί"]
    },
    {
      "id": "quantity",
      "name": "Ποσότητα (kg/l)",
      "nameEn": "Quantity (kg/l)",
      "type": "number",
      "code": "PRD002",
      "category": "products",
      "required": true,
      "validation": { "min": 0 }
    },
    {
      "id": "sales-channel",
      "name": "Κανάλι Πώλησης",
      "nameEn": "Sales Channel",
      "type": "multiselect",
      "code": "PRD003",
      "category": "products",
      "required": false,
      "options": ["Άμεση πώληση", "Συνεταιρισμός", "Εξαγωγές", "Τοπική αγορά"]
    }
  ]
}
```

## 🎛️ Διαμόρφωση Πίνακα

### Βήματα Δημιουργίας:
1. **Επιλογή τύπου ερώτησης**: "Πίνακας"
2. **Βασικές πληροφορίες**: Όνομα πίνακα (EL/EN), περιγραφή
3. **Διαμόρφωση στηλών**:
   - Όνομα στήλης (EL/EN)
   - Τύπος δεδομένων
   - Κωδικός συμβατότητας
   - Κατηγορία
   - Επικύρωση
   - Επιλογές (για select/multiselect)
4. **Ρυθμίσεις γραμμών**: Min/max γραμμές, δυνατότητες χρήστη

### Τύποι Στηλών:
- **text**: Κείμενο
- **number**: Αριθμητική τιμή με validation
- **date**: Ημερομηνία
- **select**: Μία επιλογή από λίστα
- **multiselect**: Πολλαπλές επιλογές
- **checkbox**: Boolean τιμή

### Κατηγορίες:
- **livestock**: Ζωικό κεφάλαιο
- **crops**: Καλλιέργειες
- **products**: Προϊόντα
- **equipment**: Εξοπλισμός
- **general**: Γενικά

## 🔗 API Integration

### Αποθήκευση δεδομένων:
```json
{
  "questionId": "table-question-1",
  "value": [
    {
      "id": "row-1",
      "data": {
        "animal-type": "Βοοειδή",
        "count": 25,
        "organic": true
      }
    },
    {
      "id": "row-2", 
      "data": {
        "animal-type": "Αιγοπρόβατα",
        "count": 150,
        "organic": false
      }
    }
  ]
}
```

## ✅ Συμβατότητα με Κανονισμούς

Το σύστημα υποστηρίζει:
- **Κωδικοποίηση στηλών** για συμβατότητα με επίσημους πίνακες
- **Κατηγοριοποίηση δεδομένων** ανά τομέα
- **Επικύρωση** σύμφωνα με κανονισμούς
- **Εξαγωγή δεδομένων** σε standard format
- **Διγλωσσία** (Ελληνικά/Αγγλικά)

## 🎨 UI/UX Features

- **Responsive design** για όλες τις συσκευές
- **Drag & drop** για αναδιάταξη στηλών
- **Live preview** κατά τη διαμόρφωση
- **Error handling** και validation messages
- **Progressive enhancement** για καλύτερη εμπειρία χρήστη
- **Accessibility** features για προσβασιμότητα

---

**Σημείωση**: Αυτό το σύστημα παρέχει πλήρη συμβατότητα με τις απαιτήσεις της διακήρυξης για πίνακες με πολλαπλές στήλες και κωδικοποίηση συμβατή με τους κανονισμούς.