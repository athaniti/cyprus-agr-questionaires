# API Endpoints για React App Integration

## Base URL
```
Development: https://localhost:7000/api
Production: https://your-domain.com/api
```

## Questionnaires API

### GET /questionnaires
Λίστα όλων των ερωτηματολογίων
```typescript
// Query parameters (optional)
?status=active&category=Livestock&page=1&pageSize=10

// Response
{
  data: [
    {
      id: "uuid",
      name: "Livestock Survey 2025",
      description: "Annual livestock survey",
      category: "Livestock",
      status: "active",
      targetResponses: 300,
      currentResponses: 245,
      completionRate: 81.67,
      createdBy: "Maria Georgiou",
      createdAt: "2025-01-01T00:00:00Z",
      publishedAt: "2025-01-02T00:00:00Z"
    }
  ],
  totalCount: 12,
  page: 1,
  pageSize: 10,
  totalPages: 2
}
```

### GET /questionnaires/{id}
Λεπτομέρειες ερωτηματολογίου
```typescript
// Response
{
  id: "uuid",
  name: "Livestock Survey 2025",
  description: "Annual survey description",
  category: "Livestock",
  status: "active",
  schema: {
    // Form.io JSON schema
    display: "form",
    components: [...]
  },
  targetResponses: 300,
  currentResponses: 245,
  createdBy: "Maria Georgiou",
  createdAt: "2025-01-01T00:00:00Z",
  responseCount: 245,
  quotas: [
    {
      id: "uuid",
      region: "Λευκωσία",
      targetCount: 100,
      currentCount: 89
    }
  ]
}
```

### POST /questionnaires
Δημιουργία νέου ερωτηματολογίου
```typescript
// Request body
{
  name: "New Questionnaire",
  description: "Description",
  category: "Crops",
  schema: "{...form.io schema...}",
  targetResponses: 200,
  createdBy: "uuid" // User ID
}

// Response
{
  id: "uuid",
  name: "New Questionnaire",
  status: "draft",
  createdAt: "2025-01-01T00:00:00Z"
}
```

### PUT /questionnaires/{id}
Ενημέρωση ερωτηματολογίου
```typescript
// Request body (all fields optional)
{
  name: "Updated Name",
  description: "Updated description",
  schema: "{...updated schema...}",
  targetResponses: 250
}
```

### PUT /questionnaires/{id}/publish
Δημοσίευση ερωτηματολογίου
```typescript
// No request body needed
// Changes status from "draft" to "active"
```

## Responses API

### GET /responses
Λίστα απαντήσεων
```typescript
// Query parameters (optional)
?questionnaireId=uuid&status=completed&region=Λευκωσία

// Response
[
  {
    id: "uuid",
    questionnaireId: "uuid",
    questionnaireName: "Livestock Survey 2025",
    status: "completed",
    startedAt: "2025-01-01T10:00:00Z",
    submittedAt: "2025-01-01T10:30:00Z",
    completedAt: "2025-01-01T10:30:00Z",
    farmName: "Farm Papadopoulos",
    region: "Λευκωσία",
    municipality: "Στρόβολος",
    userName: "John Farmer",
    email: "john@farm.com"
  }
]
```

### POST /responses
Δημιουργία νέας απάντησης
```typescript
// Request body
{
  questionnaireId: "uuid",
  userId: "uuid",
  responseData: "{...form data...}",
  farmName: "My Farm",
  region: "Λευκωσία",
  municipality: "Στρόβολος",
  postalCode: "2021",
  latitude: 35.1855659,
  longitude: 33.3822764
}
```

### PUT /responses/{id}
Ενημέρωση απάντησης
```typescript
// Request body (all fields optional)
{
  responseData: "{...updated form data...}",
  status: "submitted", // "draft", "submitted", "completed"
  farmName: "Updated Farm Name"
}
```

## Dashboard API

### GET /dashboard/stats
Βασικά στατιστικά
```typescript
// Response
{
  activeQuestionnaires: 5,
  totalResponses: 1234,
  completedResponses: 1089,
  pendingInvitations: 234,
  totalUsers: 567,
  completionRate: 88.24
}
```

### GET /dashboard/regional-data
Περιφερειακά δεδομένα
```typescript
// Response
[
  {
    region: "Λευκωσία",
    totalResponses: 245,
    completedResponses: 234,
    completionRate: 95.5
  },
  {
    region: "Λεμεσός",
    totalResponses: 189,
    completedResponses: 178,
    completionRate: 94.2
  }
]
```

### GET /dashboard/response-trends
Τάσεις απαντήσεων (για charts)
```typescript
// Query parameter
?days=30

// Response
[
  {
    date: "2025-01-01",
    responseCount: 45,
    completedCount: 40
  },
  {
    date: "2025-01-02",
    responseCount: 67,
    completedCount: 59
  }
]
```

### GET /dashboard/category-distribution
Κατανομή κατηγοριών
```typescript
// Response
[
  {
    category: "Livestock",
    questionnaireCount: 3,
    responseCount: 456,
    completedResponseCount: 398
  },
  {
    category: "Crops",
    questionnaireCount: 2,
    responseCount: 234,
    completedResponseCount: 201
  }
]
```

## Locations API

### GET /locations/regions
Περιφέρειες Κύπρου
```typescript
// Response
[
  {
    id: "uuid",
    name: "Λευκωσία",
    code: "01",
    latitude: 35.1855659,
    longitude: 33.3822764
  },
  {
    id: "uuid", 
    name: "Λεμεσός",
    code: "02",
    latitude: 34.6753062,
    longitude: 33.0293005
  }
]
```

## Error Handling

Όλα τα API endpoints επιστρέφουν τυπικά HTTP status codes:

- **200 OK** - Επιτυχής ανάκτηση
- **201 Created** - Επιτυχής δημιουργία
- **204 No Content** - Επιτυχής ενημέρωση
- **400 Bad Request** - Λάθος δεδομένα
- **404 Not Found** - Δεν βρέθηκε
- **500 Internal Server Error** - Σφάλμα server

```typescript
// Error response format
{
  error: "Error message",
  details?: "Additional details"
}
```

## Authentication (Μελλοντική υλοποίηση)

```typescript
// Headers που θα χρειαστούν
{
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
```

## Usage στη React App

```typescript
// Example service
class ApiService {
  private baseUrl = 'https://localhost:7000/api';

  async getQuestionnaires(filters?: QuestionnaireFilters) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseUrl}/questionnaires?${params}`);
    return response.json();
  }

  async createQuestionnaire(data: CreateQuestionnaireRequest) {
    const response = await fetch(`${this.baseUrl}/questionnaires`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getDashboardStats() {
    const response = await fetch(`${this.baseUrl}/dashboard/stats`);
    return response.json();
  }
}
```