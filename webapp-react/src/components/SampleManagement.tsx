import React, { useState, useEffect } from 'react';
import { SampleAssignmentPanel } from './SampleAssignmentPanel';

interface Questionnaire {
  id: string;
  name: string;
  description?: string;
  category?: string;
  status?: string;
  themeId?: string;
}

interface SampleFilter {
  provinces?: string[];
  communities?: string[];
  farmTypes?: string[];
  sizeCategories?: string[];
  economicSizes?: string[];
  legalStatuses?: string[];
  mainCrops?: string[];
  livestockTypes?: string[];
  minimumArea?: number;
  maximumArea?: number;
  minimumValue?: number;
  maximumValue?: number;
  priority?: 'high' | 'medium' | 'low';
}

interface Sample {
  id: string;
  questionnaire?: Questionnaire;
  questionnaireId: string;
  name: string;
  description: string;
  totalFarms: number;
  targetSize: number;
  filterCriteria: string;
  createdAt: string;
  status?: 'draft' | 'active' | 'assigned' | 'completed';
  createdBy: string;
  assigned_users?: string[];
  due_date?: string;
  assigned_at?: string;
  eligible_farms?: number;
  current_responses?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  location?: string;
}

export function SampleManagement() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignmentPanel, setShowAssignmentPanel] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  
  // Form states
  const [formData, setFormData] = useState({
    questionnaire_id: '',
    name: '',
    description: '',
    sample_size: 100,
    filter_criteria: {
      provinces: [],
      communities: [],
      farmTypes: [],
      sizeCategories: [],
      economicSizes: [],
      legalStatuses: [],
      mainCrops: [],
      livestockTypes: [],
      minimumArea: 0,
      maximumArea: 1000,
      minimumValue: 0,
      maximumValue: 500000,
      priority: 'medium'
    } as SampleFilter
  });

  // Assignment form state
  const [assignmentData, setAssignmentData] = useState({
    selectedUsers: [] as string[],
    dueDate: '',
    notes: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    filterByRegion: '',
    filterByCrop: '',
    showOnlyAvailable: true
  });

  // Available regions and crops for filtering
  const availableRegions = [
    'Λευκωσία',
    'Λεμεσός', 
    'Λάρνακα',
    'Πάφος',
    'Αμμόχωστος'
  ];

  const availableCrops = [
    'Σιτάρι',
    'Κριθάρι',
    'Καλαμπόκι',
    'Πατάτες',
    'Τομάτες',
    'Αγγούρια',
    'Εσπεριδοειδή',
    'Ελιές',
    'Σταφύλια',
    'Αμύγδαλα'
  ];

  // Mock users data (in real app would come from API)
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Γιάννης Παπαδόπουλος',
      email: 'giannis.papadopoulos@agriculture.gov.cy',
      role: 'admin',
      department: 'Γεωργία',
      location: 'Λευκωσία'
    },
    {
      id: '2',
      name: 'Μαρία Νικολάου',
      email: 'maria.nikolaou@agriculture.gov.cy',
      role: 'surveyor',
      department: 'Κτηνοτροφία',
      location: 'Λεμεσός'
    },
    {
      id: '3',
      name: 'Άντρη Γεωργίου',
      email: 'andri.georgiou@agriculture.gov.cy',
      role: 'surveyor',
      department: 'Αλιεία',
      location: 'Πάφος'
    },
    {
      id: '4',
      name: 'Πέτρος Κωνσταντίνου',
      email: 'petros.konstantinou@agriculture.gov.cy',
      role: 'respondent',
      department: 'Γεωργία',
      location: 'Λάρνακα'
    },
    {
      id: '5',
      name: 'Ελένη Μιχαήλ',
      email: 'eleni.michael@agriculture.gov.cy',
      role: 'respondent',
      department: 'Κτηνοτροφία',
      location: 'Αμμόχωστος'
    }
  ];

  useEffect(() => {
    setAvailableUsers(mockUsers);
  }, []);

  // Get user details by ID
  const getUserById = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };

  // Get filtered users for assignment
  const getFilteredUsers = () => {
    let filtered = availableUsers;

    // Filter by region
    if (assignmentData.filterByRegion) {
      filtered = filtered.filter(user => user.location === assignmentData.filterByRegion);
    }

    // Filter by crop/department (simulating crop specialization)
    if (assignmentData.filterByCrop) {
      // Map crops to departments for filtering
      const cropToDepartment: Record<string, string> = {
        'Σιτάρι': 'Γεωργία',
        'Κριθάρι': 'Γεωργία',
        'Καλαμπόκι': 'Γεωργία',
        'Πατάτες': 'Γεωργία',
        'Τομάτες': 'Γεωργία',
        'Αγγούρια': 'Γεωργία',
        'Εσπεριδοειδή': 'Γεωργία',
        'Ελιές': 'Γεωργία',
        'Σταφύλια': 'Γεωργία',
        'Αμύγδαλα': 'Γεωργία'
      };
      
      const department = cropToDepartment[assignmentData.filterByCrop];
      if (department) {
        filtered = filtered.filter(user => user.department === department);
      }
    }

    // Filter by availability (exclude already assigned users if requested)
    if (assignmentData.showOnlyAvailable && selectedSample?.assigned_users) {
      filtered = filtered.filter(user => !selectedSample.assigned_users!.includes(user.id));
    }

    return filtered;
  };

  // Get assigned users details
  const getAssignedUsersDetails = (userIds: string[]) => {
    return userIds.map(id => getUserById(id)).filter(Boolean) as User[];
  };
  const cyprusData = {
    provinces: [
      'Λευκωσία',
      'Λεμεσός', 
      'Λάρνακα',
      'Πάφος',
      'Αμμόχωστος'
    ],
    
    communities: {
      'Λευκωσία': ['Λευκωσία', 'Στρόβολος', 'Λατσιά', 'Αγλαντζιά', 'Έγκωμη', 'Δάλι', 'Πέρα', 'Κοκκινοτριμιθιά', 'Λαϊκή Γειτονιά', 'Αγία Μαρίνα'],
      'Λεμεσός': ['Λεμεσός', 'Γερμασόγεια', 'Πολεμίδια', 'Άγιος Αθανάσιος', 'Υψώνας', 'Κολόσσι', 'Ερήμη', 'Μέσα Γειτονιά', 'Πύργος', 'Παρεκκλησιά'],
      'Λάρνακα': ['Λάρνακα', 'Αραδίππου', 'Λιβάδια', 'Ορόκλινη', 'Δρομολαξιά', 'Κίτι', 'Πύλα', 'Αθηένου', 'Τέρνα', 'Ζύγι'],
      'Πάφος': ['Πάφος', 'Γερόσκηπου', 'Έμπα', 'Πέγεια', 'Πόλις Χρυσοχούς', 'Κίσσονεργα', 'Χλώρακα', 'Μεσόγη', 'Τρεμιθούσα', 'Αγία Μαρινούδα'],
      'Αμμόχωστος': ['Παραλίμνι', 'Δερύνεια', 'Αυγόρου', 'Σωτήρα', 'Φρέναρος', 'Αχερίτου', 'Λιοπέτρι', 'Ορμήδεια', 'Πρωταράς', 'Κάβο Γκρέκο']
    },
    
    farmTypes: [
      'Φυτική Παραγωγή',
      'Ζωική Παραγωγή', 
      'Μικτή Εκμετάλλευση',
      'Κηπευτικά',
      'Οπωροφόρα',
      'Αμπελώνες',
      'Ελαιώνες'
    ],
    
    sizeCategories: [
      'Πολύ Μικρή (0-5 στρέμματα)',
      'Μικρή (5-20 στρέμματα)',
      'Μεσαία (20-100 στρέμματα)',
      'Μεγάλη (100-500 στρέμματα)',
      'Πολύ Μεγάλη (>500 στρέμματα)'
    ],
    
    economicSizes: [
      'Πολύ Μικρό (0-8.000€)',
      'Μικρό (8.000-25.000€)',
      'Μεσαίο (25.000-100.000€)',
      'Μεγάλο (100.000-500.000€)',
      'Πολύ Μεγάλο (>500.000€)'
    ],
    
    legalStatuses: [
      'Φυσικό Πρόσωπο',
      'Εταιρεία',
      'Συνεταιρισμός',
      'Οικογενειακή Επιχείρηση'
    ],
    
    mainCrops: [
      'Σιτάρι',
      'Κριθάρι',
      'Καλαμπόκι',
      'Πατάτες',
      'Τομάτες',
      'Αγγούρια',
      'Πεπόνια',
      'Καρπούζια',
      'Εσπεριδοειδή',
      'Ελιές',
      'Σταφύλια',
      'Αμύγδαλα',
      'Χαρούπια'
    ],
    
    livestockTypes: [
      'Βοοειδή',
      'Αιγοπρόβατα',
      'Χοιροτροφία',
      'Πουλερικά',
      'Μελίσσια'
    ]
  };

  // Get communities for selected provinces
  const getAvailableCommunities = () => {
    const selectedProvinces = formData.filter_criteria.provinces || [];
    const communities: string[] = [];
    
    selectedProvinces.forEach(province => {
      if (cyprusData.communities[province as keyof typeof cyprusData.communities]) {
        communities.push(...cyprusData.communities[province as keyof typeof cyprusData.communities]);
      }
    });
    
    return [...new Set(communities)]; // Remove duplicates
  };

  useEffect(() => {
    fetchSamples();
    fetchQuestionnaires();
    setAvailableUsers(mockUsers);
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/samples');
      if (response.ok) {
        const data = await response.json();
        setSamples(data);
      }
    } catch (error) {
      console.error('Error fetching samples:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionnaires = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/questionnaires');
      if (response.ok) {
        const data = await response.json();
        // Handle the paginated response structure
        setQuestionnaires(data.data || data);
      } else {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock questionnaires');
        setQuestionnaires([
          {
            id: 'aaaaaaaa-1111-1111-1111-111111111111',
            name: 'Έρευνα Ελαιοπαραγωγής Κύπρου 2025',
            description: 'Ετήσια έρευνα για την κατάσταση της ελαιοπαραγωγής στην Κύπρο',
            category: 'Φυτική Παραγωγή',
            status: 'active'
          },
          {
            id: 'bbbbbbbb-2222-2222-2222-222222222222',
            name: 'Έρευνα Κτηνοτροφικών Μονάδων',
            description: 'Έρευνα για τη δομή και τα χαρακτηριστικά των κτηνοτροφικών εκμεταλλεύσεων',
            category: 'Κτηνοτροφία',
            status: 'active'
          },
          {
            id: 'cccccccc-3333-3333-3333-333333333333',
            name: 'Έρευνα Αρδευτικών Συστημάτων',
            description: 'Μελέτη των μεθόδων άρδευσης και της χρήσης νερού',
            category: 'Άρδευση',
            status: 'active'
          },
          {
            id: 'dddddddd-4444-4444-4444-444444444444',
            name: 'Έρευνα Κηπευτικών Καλλιεργειών',
            description: 'Έρευνα για τις κηπευτικές καλλιέργειες στην Κύπρο',
            category: 'Κηπευτικά',
            status: 'active'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      // Fallback to mock data on error
      setQuestionnaires([
        {
          id: 'aaaaaaaa-1111-1111-1111-111111111111',
          name: 'Έρευνα Ελαιοπαραγωγής Κύπρου 2025',
          description: 'Ετήσια έρευνα για την κατάσταση της ελαιοπαραγωγής στην Κύπρο',
          category: 'Φυτική Παραγωγή',
          status: 'active'
        },
        {
          id: 'bbbbbbbb-2222-2222-2222-222222222222',
          name: 'Έρευνα Κτηνοτροφικών Μονάδων',
          description: 'Έρευνα για τη δομή και τα χαρακτηριστικά των κτηνοτροφικών εκμεταλλεύσεων',
          category: 'Κτηνοτροφία',
          status: 'active'
        },
        {
          id: 'cccccccc-3333-3333-3333-333333333333',
          name: 'Έρευνα Αρδευτικών Συστημάτων',
          description: 'Μελέτη των μεθόδων άρδευσης και της χρήσης νερού',
          category: 'Άρδευση',
          status: 'active'
        },
        {
          id: 'dddddddd-4444-4444-4444-444444444444',
          name: 'Έρευνα Κηπευτικών Καλλιεργειών',
          description: 'Έρευνα για τις κηπευτικές καλλιέργειες στην Κύπρο',
          category: 'Κηπευτικά',
          status: 'active'
        }
      ]);
    }
  };

  // Assignment functions
  const handleAssignSample = (sample: Sample) => {
    setSelectedSample(sample);
    setAssignmentData({
      selectedUsers: sample.assigned_users || [],
      dueDate: sample.due_date || '',
      notes: '',
      priority: 'medium',
      filterByRegion: '',
      filterByCrop: '',
      showOnlyAvailable: true
    });
    setShowAssignModal(true);
  };

  const submitAssignment = async () => {
    if (!selectedSample || assignmentData.selectedUsers.length === 0) {
      alert('Παρακαλώ επιλέξτε τουλάχιστον έναν χρήστη');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/api/samples/${selectedSample.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: assignmentData.selectedUsers,
          dueDate: assignmentData.dueDate,
          notes: assignmentData.notes,
          priority: assignmentData.priority
        }),
      });

      if (response.ok) {
        // Update local state
        setSamples(prev => prev.map(s => 
          s.id === selectedSample.id 
            ? {
                ...s,
                status: 'assigned',
                assigned_users: assignmentData.selectedUsers,
                due_date: assignmentData.dueDate,
                assigned_at: new Date().toISOString()
              }
            : s
        ));
        
        setShowAssignModal(false);
        setSelectedSample(null);
        alert(`Δείγμα ανατέθηκε επιτυχώς σε ${assignmentData.selectedUsers.length} χρήστες!`);
      } else {
        alert('Σφάλμα κατά την ανάθεση δείγματος');
      }
    } catch (error) {
      console.error('Error assigning sample:', error);
      alert('Σφάλμα κατά την ανάθεση δείγματος');
    }
  };

  const handleUnassignSample = async (sample: Sample) => {
    const confirmUnassign = window.confirm(
      `Είστε σίγουροι ότι θέλετε να αποσυσχετίσετε το δείγμα "${sample.name}" από όλους τους χρήστες;`
    );

    if (!confirmUnassign) return;

    try {
      const response = await fetch(`http://localhost:5050/api/samples/${sample.id}/unassign`, {
        method: 'POST',
      });

      if (response.ok) {
        setSamples(prev => prev.map(s => 
          s.id === sample.id 
            ? {
                ...s,
                status: 'active',
                assigned_users: undefined,
                due_date: undefined,
                assigned_at: undefined
              }
            : s
        ));
        
        alert('Δείγμα αποσυσχετίστηκε επιτυχώς!');
      } else {
        alert('Σφάλμα κατά την αποσυσχέτιση δείγματος');
      }
    } catch (error) {
      console.error('Error unassigning sample:', error);
      alert('Σφάλμα κατά την αποσυσχέτιση δείγματος');
    }
  };

  const handleViewSample = (sample: Sample) => {
    setSelectedSample(sample);
    setShowDetailsModal(true);
  };

  const handleDeleteSample = async (sample: Sample) => {
    const confirmDelete = window.confirm(
      `Είστε σίγουροι ότι θέλετε να διαγράψετε το δείγμα "${sample.name}";`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5050/api/samples/${sample.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSamples(prev => prev.filter(s => s.id !== sample.id));
        alert('Δείγμα διαγράφηκε επιτυχώς!');
      } else {
        alert('Σφάλμα κατά τη διαγραφή δείγματος');
      }
    } catch (error) {
      console.error('Error deleting sample:', error);
      alert('Σφάλμα κατά τη διαγραφή δείγματος');
    }
  };

  const handleCreateSample = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Transform formData to match API expectations
      const requestData = {
        QuestionnaireId: formData.questionnaire_id || null,
        Name: formData.name,
        Description: formData.description,
        SampleSize: formData.sample_size,
        FilterCriteria: formData.filter_criteria,
        CreatedById: "00000000-0000-0000-0000-000000000001" // Default user ID
      };

      const response = await fetch('http://localhost:5050/api/samples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const newSample = await response.json();
        setSamples([...samples, newSample]);
        setShowCreateModal(false);
        resetForm();
      } else {
        console.error('Error creating sample');
      }
    } catch (error) {
      console.error('Error creating sample:', error);
    }
  };

  const generateSample = async (sampleId: string) => {
    try {
      const response = await fetch(`http://localhost:5050/api/samples/${sampleId}/generate`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchSamples(); // Refresh the list
      } else {
        console.error('Error generating sample');
      }
    } catch (error) {
      console.error('Error generating sample:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      questionnaire_id: '',
      name: '',
      description: '',
      sample_size: 100,
      filter_criteria: {
        provinces: [],
        communities: [],
        farmTypes: [],
        sizeCategories: [],
        economicSizes: [],
        legalStatuses: [],
        mainCrops: [],
        livestockTypes: [],
        minimumArea: 0,
        maximumArea: 1000,
        minimumValue: 0,
        maximumValue: 500000,
        priority: 'medium'
      }
    });
  };

  const handleArrayFieldChange = (
    field: keyof SampleFilter,
    value: string,
    checked: boolean
  ) => {
    const currentArray = formData.filter_criteria[field] as string[] || [];
    
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);

    setFormData({
      ...formData,
      filter_criteria: {
        ...formData.filter_criteria,
        [field]: newArray
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Φόρτωση...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Διαχείριση Δειγμάτων</h1>
        <p className="text-gray-600">Δημιουργία και διαχείριση δειγμάτων για ερωτηματολόγια</p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Νέο Δείγμα
        </button>
      </div>

      {/* Samples Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Δείγματα</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Όνομα
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ερωτηματολόγιο
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Μέγεθος Δείγματος
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Κατάσταση
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ημερομηνία
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {samples.map((sample) => (
                <tr key={sample.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sample.name}</div>
                    <div className="text-sm text-gray-500">{sample.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sample.questionnaire?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sample.targetSize} από {sample.totalFarms}
                    </div>
                    {sample.eligible_farms && (
                      <div className="text-xs text-gray-500">
                        Επιλέξιμα: {sample.eligible_farms}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                      sample.status === 'assigned' 
                        ? 'bg-orange-100 text-orange-800'
                        : sample.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : sample.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {sample.status === 'assigned' && 'Ανατεθειμένο'}
                      {sample.status === 'completed' && 'Ολοκληρωμένο'}
                      {sample.status === 'active' && 'Ενεργό'}
                      {!sample.status && 'Πρόχειρο'}
                    </span>
                    {sample.assigned_users && (
                      <div className="text-xs text-gray-500 mt-1">
                        Ανατεθειμένο σε {sample.assigned_users.length} χρήστες
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sample.createdAt).toLocaleDateString('el-GR')}
                    {sample.due_date && (
                      <div className="text-xs text-orange-600">
                        Λήξη: {new Date(sample.due_date).toLocaleDateString('el-GR')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleViewSample(sample)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Προβολή"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Generate Sample Button */}
                      <button
                        onClick={() => generateSample(sample.id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Παραγωγή"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>

                      {/* Sample Assignment Panel Button - NEW SPLIT UI */}
                      <button
                        onClick={() => {
                          setSelectedSample(sample);
                          setShowAssignmentPanel(true);
                        }}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="🆕 ΝΕΑ ΟΘΟΝΗ: Τμηματοποίηση & Ανάθεση (Split UI)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </button>

                      {/* Old Assign/Unassign Button - LEGACY */}
                      {sample.status !== 'assigned' ? (
                        <button
                          onClick={() => handleAssignSample(sample)}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                          title="📋 ΠΑΛΙΑ ΟΘΟΝΗ: Ανάθεση σε Χρήστες (Legacy)"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnassignSample(sample)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Αποσυσχέτιση"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                          </svg>
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteSample(sample)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Διαγραφή"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Sample Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Δημιουργία Νέου Δείγματος</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Κλείσιμο</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateSample} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Βασικές Πληροφορίες</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ερωτηματολόγιο</label>
                      <select
                        value={formData.questionnaire_id}
                        onChange={(e) => setFormData({...formData, questionnaire_id: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Επιλέξτε ερωτηματολόγιο</option>
                        {questionnaires.map((q) => (
                          <option key={q.id} value={q.id}>{q.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Όνομα Δείγματος</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Περιγραφή</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Μέγεθος Δείγματος</label>
                      <input
                        type="number"
                        value={formData.sample_size}
                        onChange={(e) => setFormData({...formData, sample_size: parseInt(e.target.value)})}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Filter Criteria */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Κριτήρια Φιλτραρίσματος</h4>
                    
                    {/* Provinces */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Επαρχίες</label>
                      <div className="grid grid-cols-2 gap-2">
                        {cyprusData.provinces.map((province) => (
                          <label key={province} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.filter_criteria.provinces?.includes(province) || false}
                              onChange={(e) => handleArrayFieldChange('provinces', province, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{province}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Communities - Show only for selected provinces */}
                    {(formData.filter_criteria.provinces?.length || 0) > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Κοινότητες/Δήμοι</label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          {getAvailableCommunities().map((community) => (
                            <label key={community} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.filter_criteria.communities?.includes(community) || false}
                                onChange={(e) => handleArrayFieldChange('communities', community, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{community}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Farm Types */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Τύποι Εκμετάλλευσης</label>
                      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                        {cyprusData.farmTypes.map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.filter_criteria.farmTypes?.includes(type) || false}
                              onChange={(e) => handleArrayFieldChange('farmTypes', type, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Size Categories */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Κατηγορίες Μεγέθους (Έκταση)</label>
                      <div className="grid grid-cols-1 gap-2">
                        {cyprusData.sizeCategories.map((size) => (
                          <label key={size} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.filter_criteria.sizeCategories?.includes(size) || false}
                              onChange={(e) => handleArrayFieldChange('sizeCategories', size, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Economic Sizes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Οικονομικό Μέγεθος</label>
                      <div className="grid grid-cols-1 gap-2">
                        {cyprusData.economicSizes.map((size) => (
                          <label key={size} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.filter_criteria.economicSizes?.includes(size) || false}
                              onChange={(e) => handleArrayFieldChange('economicSizes', size, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ακύρωση
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Δημιουργία Δείγματος
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sample Assignment Modal */}
      {showAssignModal && selectedSample && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Ανάθεση Δείγματος: {selectedSample.name}
                </h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedSample(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Filter Controls */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Φίλτρα Χρηστών</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Region Filter */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Περιοχή</label>
                      <select
                        value={assignmentData.filterByRegion}
                        onChange={(e) => setAssignmentData({
                          ...assignmentData,
                          filterByRegion: e.target.value
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Όλες οι περιοχές</option>
                        {availableRegions.map((region) => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>

                    {/* Crop Filter */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Ειδικότητα Καλλιέργειας</label>
                      <select
                        value={assignmentData.filterByCrop}
                        onChange={(e) => setAssignmentData({
                          ...assignmentData,
                          filterByCrop: e.target.value
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Όλες οι καλλιέργειες</option>
                        {availableCrops.map((crop) => (
                          <option key={crop} value={crop}>{crop}</option>
                        ))}
                      </select>
                    </div>

                    {/* Availability Filter */}
                    <div>
                      <label className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          checked={assignmentData.showOnlyAvailable}
                          onChange={(e) => setAssignmentData({
                            ...assignmentData,
                            showOnlyAvailable: e.target.checked
                          })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-xs text-gray-700">Μόνο διαθέσιμους χρήστες</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Users Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Επιλογή Χρηστών ({getFilteredUsers().length} διαθέσιμοι)
                  </label>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {getFilteredUsers().length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">
                        Δεν βρέθηκαν χρήστες με τα επιλεγμένα κριτήρια
                      </p>
                    ) : (
                      getFilteredUsers().map((user) => (
                        <label key={user.id} className="flex items-center mb-3 p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={assignmentData.selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              const newSelectedUsers = e.target.checked
                                ? [...assignmentData.selectedUsers, user.id]
                                : assignmentData.selectedUsers.filter(id => id !== user.id);
                              setAssignmentData({
                                ...assignmentData,
                                selectedUsers: newSelectedUsers
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="flex gap-2 mt-1">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                user.role === 'surveyor' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {user.role === 'admin' ? 'Διαχειριστής' :
                                 user.role === 'surveyor' ? 'Ερευνητής' :
                                 'Ερωτώμενος'}
                              </span>
                              {user.department && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                  {user.department}
                                </span>
                              )}
                              {user.location && (
                                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                  {user.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ημερομηνία Λήξης
                  </label>
                  <input
                    type="datetime-local"
                    value={assignmentData.dueDate}
                    onChange={(e) => setAssignmentData({
                      ...assignmentData,
                      dueDate: e.target.value
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Προτεραιότητα
                  </label>
                  <select
                    value={assignmentData.priority}
                    onChange={(e) => setAssignmentData({
                      ...assignmentData,
                      priority: e.target.value as 'high' | 'medium' | 'low'
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Χαμηλή</option>
                    <option value="medium">Μεσαία</option>
                    <option value="high">Υψηλή</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Σημειώσεις
                  </label>
                  <textarea
                    value={assignmentData.notes}
                    onChange={(e) => setAssignmentData({
                      ...assignmentData,
                      notes: e.target.value
                    })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Προαιρετικές σημειώσεις για την ανάθεση..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedSample(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={submitAssignment}
                  disabled={assignmentData.selectedUsers.length === 0}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ανάθεση σε {assignmentData.selectedUsers.length} χρήστες
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Details Modal */}
      {showDetailsModal && selectedSample && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Λεπτομέρειες Δείγματος: {selectedSample.name}
                </h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedSample(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Βασικές Πληροφορίες</h4>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Όνομα</label>
                        <p className="text-gray-900">{selectedSample.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Κατάσταση</label>
                        <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                          selectedSample.status === 'assigned' 
                            ? 'bg-orange-100 text-orange-800'
                            : selectedSample.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : selectedSample.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedSample.status === 'assigned' && 'Ανατεθειμένο'}
                          {selectedSample.status === 'completed' && 'Ολοκληρωμένο'}
                          {selectedSample.status === 'active' && 'Ενεργό'}
                          {!selectedSample.status && 'Πρόχειρο'}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Μέγεθος Δείγματος</label>
                        <p className="text-gray-900">{selectedSample.targetSize}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Συνολικές Φάρμες</label>
                        <p className="text-gray-900">{selectedSample.totalFarms}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-500">Περιγραφή</label>
                        <p className="text-gray-900">{selectedSample.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Ημερομηνία Δημιουργίας</label>
                        <p className="text-gray-900">
                          {new Date(selectedSample.createdAt).toLocaleDateString('el-GR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {selectedSample.questionnaire && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Ερωτηματολόγιο</label>
                          <p className="text-gray-900">{selectedSample.questionnaire.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assignment Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Πληροφορίες Ανάθεσης</h4>
                  
                  {selectedSample.assigned_users && selectedSample.assigned_users.length > 0 ? (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Ανατεθειμένο σε</label>
                          <div className="space-y-2 mt-2">
                            {getAssignedUsersDetails(selectedSample.assigned_users).map((user) => (
                              <div key={user.id} className="bg-white p-3 rounded border border-orange-200">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                      user.role === 'surveyor' ? 'bg-blue-100 text-blue-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {user.role === 'admin' ? 'Διαχειριστής' :
                                       user.role === 'surveyor' ? 'Ερευνητής' :
                                       'Ερωτώμενος'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {selectedSample.due_date && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Ημερομηνία Λήξης</label>
                            <p className="text-gray-900">
                              {new Date(selectedSample.due_date).toLocaleDateString('el-GR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                        {selectedSample.assigned_at && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500">Ημερομηνία Ανάθεσης</label>
                            <p className="text-gray-900">
                              {new Date(selectedSample.assigned_at).toLocaleDateString('el-GR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500">Δεν έχει ανατεθεί σε κανέναν χρήστη</p>
                    </div>
                  )}
                </div>

                {/* Filter Criteria */}
                {selectedSample.filterCriteria && (() => {
                  try {
                    const criteria = JSON.parse(selectedSample.filterCriteria);
                    return (
                      <div className="col-span-full">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Κριτήρια Φιλτραρίσματος</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {criteria.Provinces && criteria.Provinces.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-500">Επαρχίες</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {criteria.Provinces.map((province: string) => (
                                    <span key={province} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                      {province}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {criteria.FarmTypes && criteria.FarmTypes.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-500">Τύποι Εκμετάλλευσης</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {criteria.FarmTypes.map((type: string) => (
                                    <span key={type} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                      {type}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {criteria.SizeCategories && criteria.SizeCategories.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-500">Κατηγορίες Μεγέθους</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {criteria.SizeCategories.map((size: string) => (
                                    <span key={size} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                                      {size}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  } catch (e) {
                    return (
                      <div className="col-span-full">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Κριτήρια Φιλτραρίσματος</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-500">Δεν είναι δυνατή η εμφάνιση των κριτηρίων φιλτραρίσματος</p>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedSample(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Κλείσιμο
                </button>
                {selectedSample.status !== 'assigned' && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleAssignSample(selectedSample);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Ανάθεση
                  </button>
                )}
                {selectedSample.status === 'assigned' && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleUnassignSample(selectedSample);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Αποσυσχέτιση
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Assignment Panel */}
      {showAssignmentPanel && selectedSample && (
        <SampleAssignmentPanel
          sampleId={selectedSample.id}
          sampleName={selectedSample.name}
          onClose={() => {
            setShowAssignmentPanel(false);
            setSelectedSample(null);
            // Refresh data after assignment changes
            fetchSamples();
          }}
          language="el"
        />
      )}
    </div>
  );
}

export default SampleManagement;