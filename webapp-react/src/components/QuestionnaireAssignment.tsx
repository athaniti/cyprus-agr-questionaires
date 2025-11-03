import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'surveyor' | 'respondent';
  department?: string;
  location?: string;
  isActive: boolean;
}

interface QuestionnaireAssignmentProps {
  questionnaireId: string;
  questionnaireName: string;
  onClose: () => void;
  onAssign: (userIds: string[], dueDate: string) => void;
  language: 'el' | 'en';
}

export function QuestionnaireAssignment({ 
  questionnaireId, 
  questionnaireName, 
  onClose, 
  onAssign, 
  language 
}: QuestionnaireAssignmentProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [filterRole, setFilterRole] = useState<User['role'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock users data - in real app this would come from API
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Γιάννης Παπαδόπουλος',
        email: 'giannis.papadopoulos@agriculture.gov.cy',
        role: 'admin',
        department: 'Γεωργία',
        location: 'Λευκωσία',
        isActive: true
      },
      {
        id: '2',
        name: 'Μαρία Νικολάου',
        email: 'maria.nikolaou@agriculture.gov.cy',
        role: 'surveyor',
        department: 'Κτηνοτροφία',
        location: 'Λεμεσός',
        isActive: true
      },
      {
        id: '3',
        name: 'Άντρη Γεωργίου',
        email: 'andri.georgiou@agriculture.gov.cy',
        role: 'surveyor',
        department: 'Αλιεία',
        location: 'Πάφος',
        isActive: true
      },
      {
        id: '4',
        name: 'Πέτρος Κωνσταντίνου',
        email: 'petros.konstantinou@agriculture.gov.cy',
        role: 'respondent',
        department: 'Γεωργία',
        location: 'Λάρνακα',
        isActive: true
      },
      {
        id: '5',
        name: 'Ελένη Μιχαήλ',
        email: 'eleni.michael@agriculture.gov.cy',
        role: 'respondent',
        department: 'Κτηνοτροφία',
        location: 'Αμμόχωστος',
        isActive: true
      }
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch && user.isActive;
  });

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleAssign = () => {
    if (selectedUsers.length > 0 && dueDate) {
      onAssign(selectedUsers, dueDate);
    }
  };

  const getRoleLabel = (role: User['role']) => {
    const labels = {
      admin: language === 'el' ? 'Διαχειριστής' : 'Administrator',
      surveyor: language === 'el' ? 'Ερευνητής' : 'Surveyor',
      respondent: language === 'el' ? 'Ερωτώμενος' : 'Respondent'
    };
    return labels[role];
  };

  const getRoleBadgeColor = (role: User['role']) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      surveyor: 'bg-blue-100 text-blue-800',
      respondent: 'bg-green-100 text-green-800'
    };
    return colors[role];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4 flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex-shrink-0" style={{ backgroundColor: '#004B87' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                📋 {language === 'el' ? 'Ανάθεση Ερωτηματολογίου' : 'Assign Questionnaire'}
              </h2>
              <p className="text-blue-200 mt-1">
                {questionnaireName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'el' ? 'Ημερομηνία Λήξης' : 'Due Date'}
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'el' ? 'Φίλτρο Ρόλου' : 'Filter by Role'}
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as User['role'] | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{language === 'el' ? 'Όλοι' : 'All'}</option>
                  <option value="admin">{getRoleLabel('admin')}</option>
                  <option value="surveyor">{getRoleLabel('surveyor')}</option>
                  <option value="respondent">{getRoleLabel('respondent')}</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'el' ? 'Αναζήτηση' : 'Search'}
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === 'el' ? 'Αναζήτηση χρήστη...' : 'Search users...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Selection Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-900 font-medium">
                  {language === 'el' 
                    ? `Επιλεγμένοι: ${selectedUsers.length} από ${filteredUsers.length} χρήστες`
                    : `Selected: ${selectedUsers.length} of ${filteredUsers.length} users`
                  }
                </span>
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {selectedUsers.length === filteredUsers.length 
                    ? (language === 'el' ? 'Αποεπιλογή Όλων' : 'Deselect All')
                    : (language === 'el' ? 'Επιλογή Όλων' : 'Select All')
                  }
                </button>
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedUsers.includes(user.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleUserToggle(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserToggle(user.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                          {user.department && (
                            <span className="text-xs text-gray-500">
                              {user.department}
                            </span>
                          )}
                          {user.location && (
                            <span className="text-xs text-gray-500">
                              • {user.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {language === 'el' 
                    ? 'Δεν βρέθηκαν χρήστες που να ταιριάζουν στα κριτήρια'
                    : 'No users found matching the criteria'
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            {language === 'el' ? 'Ακύρωση' : 'Cancel'}
          </button>
          <button
            onClick={handleAssign}
            disabled={selectedUsers.length === 0 || !dueDate}
            className="bg-[#004B87] text-white px-6 py-2 rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {language === 'el' 
              ? `Ανάθεση σε ${selectedUsers.length} χρήστες`
              : `Assign to ${selectedUsers.length} users`
            }
          </button>
        </div>
      </div>
    </div>
  );
}