import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Plus, Send, Eye, Mail, CheckCircle2, Clock } from 'lucide-react';

const sampleBatches = [
  {
    id: 1,
    name: { el: 'Παρτίδα Λευκωσίας - Οκτώβριος', en: 'Nicosia Batch - October' },
    region: { el: 'Λευκωσία', en: 'Nicosia' },
    size: 150,
    sent: 150,
    opened: 123,
    completed: 89,
    date: '2025-10-01',
    status: 'active'
  },
  {
    id: 2,
    name: { el: 'Παρτίδα Λεμεσού - Οκτώβριος', en: 'Limassol Batch - October' },
    region: { el: 'Λεμεσός', en: 'Limassol' },
    size: 120,
    sent: 120,
    opened: 98,
    completed: 76,
    date: '2025-10-03',
    status: 'active'
  },
  {
    id: 3,
    name: { el: 'Παρτίδα Λάρνακας - Σεπτέμβριος', en: 'Larnaca Batch - September' },
    region: { el: 'Λάρνακα', en: 'Larnaca' },
    size: 100,
    sent: 100,
    opened: 100,
    completed: 100,
    date: '2025-09-15',
    status: 'completed'
  },
  {
    id: 4,
    name: { el: 'Παρτίδα Πάφου - Οκτώβριος', en: 'Paphos Batch - October' },
    region: { el: 'Πάφος', en: 'Paphos' },
    size: 80,
    sent: 0,
    opened: 0,
    completed: 0,
    date: '2025-10-10',
    status: 'draft'
  },
];

export function Samples() {
  const { t, language } = useLanguage();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">{t('samples.title')}</h1>
          <p className="text-gray-600 mt-1">
            {language === 'el' 
              ? 'Δημιουργήστε και διαχειριστείτε παρτίδες δειγμάτων και προσκλήσεων' 
              : 'Create and manage sample batches and invitations'}
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#004B87' }} className="text-white rounded-xl gap-2">
              <Plus className="h-4 w-4" />
              {t('samples.createBatch')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('samples.createBatch')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('samples.batchName')}</Label>
                  <Input 
                    placeholder={language === 'el' ? 'π.χ. Παρτίδα Λευκωσίας' : 'e.g. Nicosia Batch'}
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label>{t('samples.region')}</Label>
                  <Select>
                    <SelectTrigger className="mt-2 rounded-xl">
                      <SelectValue placeholder={language === 'el' ? 'Επιλέξτε περιοχή' : 'Select region'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nicosia">{language === 'el' ? 'Λευκωσία' : 'Nicosia'}</SelectItem>
                      <SelectItem value="limassol">{language === 'el' ? 'Λεμεσός' : 'Limassol'}</SelectItem>
                      <SelectItem value="larnaca">{language === 'el' ? 'Λάρνακα' : 'Larnaca'}</SelectItem>
                      <SelectItem value="paphos">{language === 'el' ? 'Πάφος' : 'Paphos'}</SelectItem>
                      <SelectItem value="famagusta">{language === 'el' ? 'Αμμόχωστος' : 'Famagusta'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>{t('samples.sampleSize')}</Label>
                <Input 
                  type="number"
                  placeholder="100"
                  className="mt-2 rounded-xl"
                />
              </div>

              <div>
                <Label>
                  {language === 'el' ? 'Ερωτηματολόγιο' : 'Questionnaire'}
                </Label>
                <Select>
                  <SelectTrigger className="mt-2 rounded-xl">
                    <SelectValue placeholder={language === 'el' ? 'Επιλέξτε ερωτηματολόγιο' : 'Select questionnaire'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1">{language === 'el' ? 'Καλλιέργειες 2025' : 'Crops 2025'}</SelectItem>
                    <SelectItem value="q2">{language === 'el' ? 'Κτηνοτροφία 2025' : 'Livestock 2025'}</SelectItem>
                    <SelectItem value="q3">{language === 'el' ? 'Αλιεία 2025' : 'Fisheries 2025'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('samples.template')}</Label>
                <Textarea 
                  placeholder={language === 'el' 
                    ? 'Γράψτε το κείμενο της πρόσκλησης...' 
                    : 'Write your invitation message...'}
                  className="mt-2 rounded-xl min-h-[120px]"
                  defaultValue={language === 'el' 
                    ? 'Αγαπητέ/ή Αγρότη,\n\nΣας προσκαλούμε να συμμετάσχετε στο ερωτηματολόγιο του Υπουργείου Γεωργίας Κύπρου...'
                    : 'Dear Farmer,\n\nWe invite you to participate in the Ministry of Agriculture Cyprus questionnaire...'}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setIsCreateOpen(false)}
                >
                  {t('cancel')}
                </Button>
                <Button 
                  style={{ backgroundColor: '#004B87' }}
                  className="flex-1 text-white rounded-xl"
                  onClick={() => setIsCreateOpen(false)}
                >
                  {t('samples.createBatch')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('samples.sent')}</p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>370</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EBF4FF' }}>
                <Send className="h-6 w-6" style={{ color: '#004B87' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('samples.opened')}</p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>321</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3E2' }}>
                <Mail className="h-6 w-6" style={{ color: '#F59E0B' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('samples.completed')}</p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>265</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F9F7' }}>
                <CheckCircle2 className="h-6 w-6" style={{ color: '#0C9A8F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'el' ? 'Ποσοστό Ολοκλήρωσης' : 'Completion Rate'}
                </p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>72%</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F3EDFF' }}>
                <Eye className="h-6 w-6" style={{ color: '#8B5CF6' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batches Table */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle>
            {language === 'el' ? 'Παρτίδες Δειγμάτων' : 'Sample Batches'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('samples.batchName')}</TableHead>
                <TableHead>{t('samples.region')}</TableHead>
                <TableHead>{t('samples.sampleSize')}</TableHead>
                <TableHead>{t('samples.sent')}</TableHead>
                <TableHead>{t('samples.opened')}</TableHead>
                <TableHead>{t('samples.completed')}</TableHead>
                <TableHead>{t('quotas.progress')}</TableHead>
                <TableHead>{t('questionnaires.status')}</TableHead>
                <TableHead>{t('questionnaires.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleBatches.map((batch) => {
                const completionRate = batch.sent > 0 ? Math.round((batch.completed / batch.sent) * 100) : 0;
                return (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <div>
                        <p className="text-gray-900">
                          {language === 'el' ? batch.name.el : batch.name.en}
                        </p>
                        <p className="text-xs text-gray-500">{batch.date}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {language === 'el' ? batch.region.el : batch.region.en}
                    </TableCell>
                    <TableCell>{batch.size}</TableCell>
                    <TableCell>{batch.sent}</TableCell>
                    <TableCell>{batch.opened}</TableCell>
                    <TableCell>{batch.completed}</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress value={completionRate} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{completionRate}%</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className="rounded-lg"
                        style={
                          batch.status === 'completed' 
                            ? { backgroundColor: '#E6F9F7', color: '#0C9A8F' }
                            : batch.status === 'active'
                            ? { backgroundColor: '#EBF4FF', color: '#004B87' }
                            : { backgroundColor: '#F5F6FA', color: '#6B7280' }
                        }
                      >
                        {batch.status === 'completed' 
                          ? (language === 'el' ? 'Ολοκληρωμένη' : 'Completed')
                          : batch.status === 'active'
                          ? (language === 'el' ? 'Ενεργή' : 'Active')
                          : (language === 'el' ? 'Πρόχειρη' : 'Draft')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {batch.status === 'draft' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="rounded-lg"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            {language === 'el' ? 'Αποστολή' : 'Send'}
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="rounded-lg"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
