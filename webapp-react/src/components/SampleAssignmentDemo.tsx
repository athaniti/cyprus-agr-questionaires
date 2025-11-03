import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Users, UserPlus, MapPin, Building2 } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  region: string;
  role: string;
}

interface Sample {
  id: string;
  name: string;
  description: string;
  targetSize: number;
  questionnaire?: {
    id: string;
    name: string;
  };
}

interface SampleAssignmentDemoProps {
  language: 'el' | 'en';
}

const translations = {
  el: {
    title: 'Ανάθεση Δειγμάτων σε Χρήστες',
    description: 'Ανάθεση δειγμάτων ερευνών σε επιθεωρητές ανά περιοχή',
    samples: 'Δείγματα',
    users: 'Χρήστες',
    region: 'Περιοχή',
    role: 'Ρόλος',
    assign: 'Ανάθεση',
    assignUsers: 'Ανάθεση Χρηστών',
    selectUsers: 'Επιλέξτε χρήστες για ανάθεση',
    assignTo: 'Ανάθεση σε',
    close: 'Κλείσιμο',
    assignSelected: 'Ανάθεση Επιλεγμένων',
    questionnaire: 'Ερωτηματολόγιο',
    targetSize: 'Στόχος',
    filterByRegion: 'Φιλτράρισμα κατά περιοχή',
    allRegions: 'Όλες οι περιοχές',
    assignmentSuccess: 'Η ανάθεση ολοκληρώθηκε επιτυχώς!'
  },
  en: {
    title: 'Sample Assignment to Users',
    description: 'Assign survey samples to inspectors by region',
    samples: 'Samples',
    users: 'Users',
    region: 'Region',
    role: 'Role',
    assign: 'Assign',
    assignUsers: 'Assign Users',
    selectUsers: 'Select users for assignment',
    assignTo: 'Assign to',
    close: 'Close',
    assignSelected: 'Assign Selected',
    questionnaire: 'Questionnaire',
    targetSize: 'Target',
    filterByRegion: 'Filter by region',
    allRegions: 'All regions',
    assignmentSuccess: 'Assignment completed successfully!'
  }
};

export function SampleAssignmentDemo({ language }: SampleAssignmentDemoProps) {
  const t = translations[language];
  const [samples, setSamples] = useState<Sample[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [regionFilter, setRegionFilter] = useState<string>('');

  // Cyprus regions for filtering
  const cyprusRegions = ['Λευκωσία', 'Λεμεσός', 'Λάρνακα', 'Πάφος', 'Αμμόχωστος'];

  useEffect(() => {
    fetchSamples();
    fetchUsers();
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/samples');
      if (response.ok) {
        const data = await response.json();
        setSamples(data);
      } else {
        // Fallback to mock data
        setSamples([
          {
            id: '1',
            name: 'Δείγμα Ελαιοπαραγωγών Πάφου',
            description: 'Δείγμα 20 εκμεταλλεύσεων ελαιοπαραγωγών στην επαρχία Πάφου',
            targetSize: 20,
            questionnaire: { id: '1', name: 'Έρευνα Ελαιοπαραγωγής Κύπρου 2025' }
          },
          {
            id: '2',
            name: 'Δείγμα Κτηνοτροφικών Μονάδων Λεμεσού',
            description: 'Δείγμα 15 κτηνοτροφικών εκμεταλλεύσεων στην επαρχία Λεμεσού',
            targetSize: 15,
            questionnaire: { id: '2', name: 'Έρευνα Κτηνοτροφικών Μονάδων' }
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching samples:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/sample-assignments/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        // Fallback to mock data
        setUsers([
          { id: '1', fullName: 'Μαρία Γεωργίου', email: 'maria.georgiou@agriculture.gov.cy', region: 'Λευκωσία', role: 'Επιθεωρητής' },
          { id: '2', fullName: 'Ανδρέας Χρίστου', email: 'andreas.christou@agriculture.gov.cy', region: 'Λεμεσός', role: 'Επιθεωρητής' },
          { id: '3', fullName: 'Έλενα Ιωάννου', email: 'elena.ioannou@agriculture.gov.cy', region: 'Λάρνακα', role: 'Επιθεωρητής' },
          { id: '4', fullName: 'Πέτρος Δημητρίου', email: 'petros.dimitriou@agriculture.gov.cy', region: 'Πάφος', role: 'Επιθεωρητής' },
          { id: '5', fullName: 'Σοφία Νικολάου', email: 'sofia.nicolaou@agriculture.gov.cy', region: 'Αμμόχωστος', role: 'Επιθεωρητής' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSample = (sample: Sample) => {
    setSelectedSample(sample);
    setSelectedUsers([]);
    setShowAssignDialog(true);
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const submitAssignment = async () => {
    if (!selectedSample || selectedUsers.length === 0) return;

    try {
      const response = await fetch(`http://localhost:5050/api/sample-assignments/${selectedSample.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUsers
        }),
      });

      if (response.ok) {
        alert(t.assignmentSuccess);
        setShowAssignDialog(false);
      }
    } catch (error) {
      console.error('Error assigning users:', error);
    }
  };

  const filteredUsers = regionFilter 
    ? users.filter(user => user.region === regionFilter)
    : users;

  if (loading) {
    return (
      <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
        <Card className="rounded-2xl border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">{t.title}</h2>
          <p className="text-gray-600">{t.description}</p>
        </div>
      </div>

      {/* Samples List */}
      <Card className="rounded-2xl border-none shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{t.samples}</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-600">Όνομα Δείγματος</TableHead>
                <TableHead className="text-gray-600">{t.questionnaire}</TableHead>
                <TableHead className="text-gray-600">{t.targetSize}</TableHead>
                <TableHead className="text-gray-600 text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {samples.map((sample) => (
                <TableRow key={sample.id} className="border-b border-gray-100">
                  <TableCell>
                    <div>
                      <p className="text-gray-900 font-medium">{sample.name}</p>
                      <p className="text-xs text-gray-500">{sample.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {sample.questionnaire && (
                      <Badge variant="secondary" className="rounded-lg bg-blue-50 text-blue-700">
                        {sample.questionnaire.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900">{sample.targetSize}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleAssignSample(sample)}
                      size="sm"
                      className="gap-2 rounded-xl text-white"
                      style={{ backgroundColor: '#004B87' }}
                    >
                      <UserPlus className="h-4 w-4" />
                      {t.assign}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t.assignUsers}
            </DialogTitle>
            <DialogDescription>
              {t.selectUsers}: {selectedSample?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Region Filter */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">{t.allRegions}</option>
                {cyprusRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Users List */}
            <div className="max-h-96 overflow-auto border border-gray-200 rounded-lg">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{user.fullName}</p>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{user.region}</span>
                      <Building2 className="h-3 w-3 ml-2" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedUsers.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  Επιλεγμένοι χρήστες: {selectedUsers.length}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAssignDialog(false)}
              className="rounded-xl"
            >
              {t.close}
            </Button>
            <Button
              onClick={submitAssignment}
              disabled={selectedUsers.length === 0}
              className="rounded-xl text-white"
              style={{ backgroundColor: '#004B87' }}
            >
              {t.assignSelected} ({selectedUsers.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}