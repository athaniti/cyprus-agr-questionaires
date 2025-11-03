import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'surveyor' | 'respondent';
  department?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
}

interface UserManagementProps {
  language: 'el' | 'en';
}

export function UserManagement({ language }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Γιάννης Παπαδόπουλος',
      email: 'giannis.papadopoulos@agriculture.gov.cy',
      role: 'admin',
      department: 'Γεωργία',
      location: 'Λευκωσία',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Μαρία Νικολάου',
      email: 'maria.nikolaou@agriculture.gov.cy',
      role: 'surveyor',
      department: 'Κτηνοτροφία',
      location: 'Λεμεσός',
      isActive: true,
      createdAt: '2024-02-20T10:00:00Z'
    },
    {
      id: '3',
      name: 'Άντρη Γεωργίου',
      email: 'andri.georgiou@agriculture.gov.cy',
      role: 'surveyor',
      department: 'Αλιεία',
      location: 'Πάφος',
      isActive: true,
      createdAt: '2024-03-10T10:00:00Z'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'respondent' as User['role'],
    department: '',
    location: ''
  });

  const handleCreateUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, user]);
    setNewUser({ name: '', email: '', role: 'respondent', department: '', location: '' });
    setShowCreateModal(false);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
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
    <div className="p-6" style={{ backgroundColor: '#F5F6FA' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'el' ? 'Διαχείριση Χρηστών' : 'User Management'}
            </h2>
            <p className="text-gray-600 mt-2">
              {language === 'el' ? 'Διαχείριση χρηστών συστήματος και ρόλων' : 'Manage system users and roles'}
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-white rounded-xl shadow-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#004B87' }}
          >
            + {language === 'el' ? 'Νέος Χρήστης' : 'New User'}
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'el' ? 'Χρήστης' : 'User'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'el' ? 'Ρόλος' : 'Role'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'el' ? 'Τμήμα' : 'Department'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'el' ? 'Τοποθεσία' : 'Location'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'el' ? 'Κατάσταση' : 'Status'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'el' ? 'Ενέργειες' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.location || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive 
                          ? (language === 'el' ? 'Ενεργός' : 'Active')
                          : (language === 'el' ? 'Ανενεργός' : 'Inactive')
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {language === 'el' ? 'Επεξεργασία' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                      >
                        {user.isActive 
                          ? (language === 'el' ? 'Απενεργοποίηση' : 'Deactivate')
                          : (language === 'el' ? 'Ενεργοποίηση' : 'Activate')
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'el' ? 'Δημιουργία Νέου Χρήστη' : 'Create New User'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'el' ? 'Όνομα' : 'Name'}
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'el' ? 'Email' : 'Email'}
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'el' ? 'Ρόλος' : 'Role'}
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="respondent">{getRoleLabel('respondent')}</option>
                  <option value="surveyor">{getRoleLabel('surveyor')}</option>
                  <option value="admin">{getRoleLabel('admin')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'el' ? 'Τμήμα' : 'Department'}
                </label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'el' ? 'Τοποθεσία' : 'Location'}
                </label>
                <input
                  type="text"
                  value={newUser.location}
                  onChange={(e) => setNewUser(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewUser({ name: '', email: '', role: 'respondent', department: '', location: '' });
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {language === 'el' ? 'Ακύρωση' : 'Cancel'}
              </button>
              <button
                onClick={handleCreateUser}
                disabled={!newUser.name.trim() || !newUser.email.trim()}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {language === 'el' ? 'Δημιουργία' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}