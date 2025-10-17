# 🚀 Enhanced Questionnaire Builder - Ministry of Agriculture Cyprus

## 📋 Περιεχόμενα / Contents

- [Τι Άλλαξε](#τι-άλλαξε--whats-changed)
- [Νέα Components](#νέα-components--new-components)
- [Χρήση](#χρήση--usage)
- [Χαρακτηριστικά](#χαρακτηριστικά--features)
- [Οδηγίες](#οδηγίες--guides)

---

## 🎯 Τι Άλλαξε / What's Changed

Η εφαρμογή έχει ενημερωθεί με ένα **προηγμένο questionnaire builder** που χρησιμοποιεί τα υπάρχοντα shadcn/ui components, παρέχοντας μια ολοκληρωμένη λύση για τη δημιουργία και διαχείριση ερωτηματολογίων.

### Πλεονεκτήματα / Advantages:

✅ **Professional Form Builder** - Intuitive interface με tabs και πλήρη έλεγχο  
✅ **Advanced Validation** - Built-in validation rules για κάθε τύπο πεδίου  
✅ **Multi-language Support** - Πλήρης υποστήριξη Ελληνικών/Αγγλικών  
✅ **JSON Schema** - Εύκολη εξαγωγή/εισαγωγή και version control  
✅ **Rich Question Types** - 10+ τύποι ερωτήσεων  
✅ **Live Preview** - Δείτε πώς θα φαίνεται το ερωτηματολόγιο  
✅ **Responsive Design** - Άριστη εμφάνιση σε όλες τις συσκευές  
✅ **No External Dependencies** - Χρησιμοποιεί μόνο τα υπάρχοντα UI components  

---

## 🆕 Νέα Components / New Components

### 1️⃣ QuestionnaireBuilder (Ανανεωμένο)
**Διαδρομή:** `/components/QuestionnaireBuilder.tsx`

Εντελώς ανανεωμένο builder component με professional features.

**Νέες δυνατότητες:**
- 🎨 Tabbed interface (Basic, Options, Settings)
- 📤 Export/Import JSON schema
- 👁️ Live preview με πραγματική απεικόνιση
- 💾 Save as draft ή publish
- 🌐 Πλήρης δίγλωσση υποστήριξη (EL/EN)
- 📋 Drag handles για reordering (UI ready)
- 🎯 Validation settings per question
- 📝 Description και placeholder support

### 2️⃣ QuestionnaireViewer (Νέο)
**Διαδρομή:** `/components/QuestionnaireViewer.tsx`

Νέο component για την προβολή και συμπλήρωση ερωτηματολογίων.

**Χαρακτηριστικά:**
- ✅ Client-side validation
- 📱 Responsive design
- ✔️ Success screen μετά την υποβολή
- 🌐 Δίγλωσση υποστήριξη
- ⚠️ Real-time error messages
- 📊 Form data collection

### 3️⃣ Questionnaires (Επεκτάθηκε)
**Διαδρομή:** `/components/Questionnaires.tsx`

Το listings component έχει επεκταθεί με:
- 📄 View Schema button
- 📥 Export schema functionality
- 👁️ View questionnaire option

---

## 🎮 Χρήση / Usage

### Δημιουργία Νέου Ερωτηματολογίου

1. Πηγαίνετε στη σελίδα **Questionnaires**
2. Κλικ στο **"Δημιουργία Νέου"**
3. Συμπληρώστε τις βασικές πληροφορίες:
   - Όνομα ερωτηματολογίου
   - Κατηγορία
   - Περιγραφή
4. Προσθέστε ερωτήσεις:
   - Επιλέξτε τύπο από τη δεξιά στήλη
   - Συμπληρώστε το κείμενο (EL & EN)
   - Προσθέστε επιλογές (για multiple choice, checkboxes, dropdown)
   - Ορίστε validation rules
5. Κάντε preview
6. Αποθηκεύστε ως draft ή δημοσιεύστε

### Επεξεργασία Ερώτησης

Κάθε ερώτηση έχει 3 tabs:

**1. Basic (Βασικά)**
- Κείμενο ερώτησης (Ελληνικά)
- Κείμενο ερώτησης (Αγγλικά)
- Placeholder text
- Περιγραφή

**2. Options (Επιλογές)** - Μόνο για Multiple Choice, Checkboxes, Dropdown
- Προσθήκη/Διαγραφή επιλογών
- Επεξεργασία κειμένου επιλογών

**3. Settings (Ρυθμίσεις)**
- Required toggle
- Validation rules (min/max για numbers)

### Export/Import Schema

**Export:**
1. Ανοίξτε το builder
2. Κλικ **"Εξαγωγή Schema"**
3. Το JSON αρχείο θα κατέβει αυτόματα

**Import:**
1. Ανοίξτε το builder
2. Κλικ **"Εισαγωγή Schema"**
3. Επιλέξτε JSON αρχείο
4. Το schema θα φορτωθεί στο builder

---

## ⭐ Χαρακτηριστικά / Features

### 📝 Διαθέσιμοι Τύποι Ερωτήσεων

1. **Short Text** - Μονόγραμμο κείμενο
   - Για σύντομες απαντήσεις (όνομα, διεύθυνση, κτλ.)

2. **Long Text** - Πολύγραμμο κείμενο
   - Για αναλυτικές απαντήσεις και σχόλια

3. **Number** - Αριθμητικό πεδίο
   - Min/Max validation support
   - Για ποσότητες, τιμές, μετρήσεις

4. **Email** - Email πεδίο
   - Built-in email validation
   - Email format checking

5. **Phone** - Τηλέφωνο
   - Για αριθμούς τηλεφώνου

6. **Date** - Ημερομηνία
   - Date picker interface
   - Για ημερομηνίες και events

7. **Multiple Choice** - Επιλογή μίας απάντησης
   - Radio buttons
   - Μόνο μία επιλογή

8. **Checkboxes** - Πολλαπλές επιλογές
   - Επιλογή πολλών απαντήσεων
   - Independent selections

9. **Dropdown** - Λίστα επιλογής
   - Select dropdown
   - Space-saving για πολλές επιλογές

10. **File Upload** - Μεταφόρτωση αρχείου
    - Για έγγραφα, φωτογραφίες, κτλ.

### 🔒 Validation Rules

Κάθε ερώτηση μπορεί να έχει:

- **Required** - Υποχρεωτικό πεδίο
- **Min/Max Value** - Για αριθμητικά πεδία
- **Email Validation** - Αυτόματο για email fields
- **Custom Placeholders** - Οδηγίες για το χρήστη

### 🌍 Διεθνοποίηση (i18n)

**Πλήρης δίγλωσση υποστήριξη:**

- Κάθε ερώτηση έχει κείμενο σε Ελληνικά ΚΑΙ Αγγλικά
- Αυτόματη εναλλαγή UI βάσει γλώσσας
- Preview σε επιλεγμένη γλώσσα
- Validation messages στην κατάλληλη γλώσσα

### 🎨 Design System Integration

Πλήρης ενσωμάτωση με το κυβερνητικό design:

- **Primary Color:** `#004B87` (Κύριο μπλε του Υπουργείου)
- **Secondary Color:** `#0C9A8F` (Δευτερεύον πράσινο)
- **Rounded Corners:** Consistent με την εφαρμογή
- **Shadows:** Subtle shadows για depth
- **Typography:** Σύμφωνα με το globals.css

### 📊 Schema Format

Το JSON schema format:

```json
{
  "name": "Livestock Survey 2025",
  "description": "Annual livestock survey",
  "category": "livestock",
  "questions": [
    {
      "id": "q-1234567890",
      "type": "shortText",
      "text": "Όνομα Αγρότη",
      "textEn": "Farmer Name",
      "required": true,
      "placeholder": "Εισάγετε το όνομα",
      "description": "Πλήρες ονοματεπώνυμο",
      "options": []
    },
    {
      "id": "q-1234567891",
      "type": "number",
      "text": "Αριθμός Βοοειδών",
      "textEn": "Number of Cattle",
      "required": true,
      "validation": {
        "min": 0,
        "max": 1000
      },
      "options": []
    },
    {
      "id": "q-1234567892",
      "type": "multipleChoice",
      "text": "Τύπος Εκτροφής",
      "textEn": "Farming Type",
      "required": true,
      "options": [
        "Βιολογική",
        "Συμβατική",
        "Μικτή"
      ]
    }
  ],
  "createdAt": "2025-10-17T10:30:00.000Z"
}
```

---

## 📚 Οδηγίες / Guides

### Δημιουργία Πολύπλοκου Ερωτηματολογίου

**Βήμα 1: Σχεδιασμός**
- Σκεφτείτε τη δομή του ερωτηματολογίου
- Ομαδοποιήστε συναφείς ερωτήσεις
- Καθορίστε τις υποχρεωτικές ερωτήσεις

**Βήμα 2: Βασικές Πληροφορίες**
- Δώστε περιγραφικό όνομα
- Επιλέξτε την κατάλληλη κατηγορία
- Γράψτε σαφή περιγραφή

**Βήμα 3: Προσθήκη Ερωτήσεων**
- Ξεκινήστε με τις βασικές ερωτήσεις
- Χρησιμοποιήστε τον κατάλληλο τύπο για κάθε ερώτηση
- Συμπληρώστε και τα δύο κείμενα (EL & EN)

**Βήμα 4: Ρυθμίσεις**
- Ορίστε Required όπου χρειάζεται
- Προσθέστε placeholders για οδηγίες
- Ορίστε validation rules

**Βήμα 5: Δοκιμή**
- Χρησιμοποιήστε το Preview
- Ελέγξτε τα validation messages
- Βεβαιωθείτε ότι όλα εμφανίζονται σωστά

**Βήμα 6: Δημοσίευση**
- Αποθηκεύστε ως Draft για review
- Όταν είστε έτοιμοι, δημοσιεύστε

### Best Practices ✅

**Κείμενο Ερωτήσεων:**
- ✅ Σύντομο και σαφές
- ✅ Αποφύγετε αμφίσημες διατυπώσεις
- ✅ Μια ερώτηση = μια πληροφορία

**Επιλογές (Multiple Choice):**
- ✅ Αμοιβαία αποκλειόμενες επιλογές
- ✅ Προσθέστε "Άλλο" όταν χρειάζεται
- ✅ Λογική σειρά

**Validation:**
- ✅ Χρησιμοποιήστε Required μόνο όπου πραγματικά χρειάζεται
- ✅ Ορίστε ρεαλιστικά min/max
- ✅ Δώστε placeholders για guidance

**Δομή:**
- ✅ Λογική ροή ερωτήσεων
- ✅ Από γενικά σε ειδικά
- ✅ Όχι πάρα πολλές ερωτήσεις (< 20 ιδανικά)

### Συνήθη Λάθη ❌

❌ **Πολύ μεγάλες φόρμες** - Κουράζουν τον χρήστη  
❌ **Μη σαφείς ερωτήσεις** - Οδηγούν σε λάθος απαντήσεις  
❌ **Όχι placeholders** - Ο χρήστης δεν ξέρει τι να γράψει  
❌ **Πολλά required** - Frustrating για τον χρήστη  
❌ **Μόνο μία γλώσσα** - Χρησιμοποιήστε και τις δύο  

---

## 🔧 Τεχνικά Χαρακτηριστικά

### Components Used

- **shadcn/ui:** Card, Button, Input, Textarea, Select, Badge, Tabs, Dialog, etc.
- **lucide-react:** Icons
- **React Hooks:** useState για state management

### No External Dependencies

Η λύση χρησιμοποιεί ΜΟΝΟ:
- React 18
- Existing shadcn/ui components
- Lucide icons
- TypeScript

**Δεν χρειάζεται:**
- ❌ Form.io
- ❌ External form libraries
- ❌ Additional CSS frameworks

### Performance

- ✅ Lightweight (< 50KB component code)
- ✅ Fast rendering
- ✅ No external API calls for builder
- ✅ Client-side validation

---

## 📞 Υποστήριξη / Support

### Τεκμηρίωση

- `/components/QuestionnaireBuilder.tsx` - Builder implementation
- `/components/QuestionnaireViewer.tsx` - Viewer implementation
- `/components/Questionnaires.tsx` - List view

### Παραδείγματα

Δείτε τα mock data στα components για παραδείγματα:
- Mock questions στο QuestionnaireViewer
- Mock questionnaires στο Questionnaires component

---

## 🎉 Επόμενα Βήματα

1. ✅ **Εξοικειωθείτε** με το builder interface
2. ✅ **Δημιουργήστε** το πρώτο σας ερωτηματολόγιο
3. ✅ **Δοκιμάστε** το preview
4. ✅ **Εξάγετε** το schema για backup
5. ✅ **Ενσωματώστε** με backend API για παραγωγή

### Backend Integration (Next Phase)

Για production, θα χρειαστείτε:

```typescript
// Save questionnaire
POST /api/questionnaires
{
  name, description, category, questions, status: 'draft'
}

// Publish questionnaire
PUT /api/questionnaires/:id/publish

// Submit response
POST /api/questionnaires/:id/responses
{
  questionnaireId, userId, data: formData
}

// Get questionnaire
GET /api/questionnaires/:id
```

---

**Καλή δημιουργία ερωτηματολογίων! 🚀**
