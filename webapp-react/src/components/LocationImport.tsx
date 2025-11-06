import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Upload, FileText, Check, X, AlertTriangle, Download } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface CSVRow {
  name: string;
  community: string;
  district: string;
  population?: number;
  farmers?: number;
}

interface ImportResult {
  success: number;
  rejected: number;
  existing: number;
  total: number;
  errors: Array<{
    row: number;
    error: string;
    data: CSVRow;
  }>;
}

interface LocationImportProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationImport({ isOpen, onClose }: LocationImportProps) {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const translations = {
    el: {
      title: 'Εισαγωγή Τοποθεσιών από Αρχείο',
      uploadFile: 'Μεταφόρτωση Αρχείου CSV',
      selectFile: 'Επιλέξτε αρχείο CSV',
      dragDrop: 'Σύρετε και αφήστε το αρχείο εδώ ή κάντε κλικ για επιλογή',
      downloadTemplate: 'Λήψη Προτύπου',
      fileFormat: 'Μορφή Αρχείου',
      formatDescription: 'Το αρχείο CSV πρέπει να περιέχει τις εξής στήλες:',
      columns: {
        name: 'Όνομα (υποχρεωτικό)',
        community: 'Κοινότητα (υποχρεωτικό)',
        district: 'Επαρχία (υποχρεωτικό)',
        population: 'Πληθυσμός (προαιρετικό)',
        farmers: 'Αριθμός Αγροτών (προαιρετικό)'
      },
      preview: 'Προεπισκόπηση Δεδομένων',
      recordsFound: 'Βρέθηκαν {count} εγγραφές',
      continueImport: 'Συνέχεια Εισαγωγής',
      confirmImport: 'Επιβεβαίωση Εισαγωγής',
      processing: 'Επεξεργασία...',
      importComplete: 'Ολοκλήρωση Εισαγωγής',
      summary: 'Σύνοψη Εισαγωγής',
      successfulImports: '{count} εγγραφές εισήχθησαν επιτυχώς',
      rejectedImports: '{count} εγγραφές απορρίφθηκαν λόγω σφαλμάτων',
      existingImports: '{count} εγγραφές υπάρχουν ήδη',
      errors: 'Σφάλματα',
      backToLocations: 'Επιστροφή στις Τοποθεσίες',
      newImport: 'Νέα Εισαγωγή',
      cancel: 'Ακύρωση',
      back: 'Πίσω'
    },
    en: {
      title: 'Import Locations from File',
      uploadFile: 'Upload CSV File',
      selectFile: 'Select CSV file',
      dragDrop: 'Drag and drop your file here or click to select',
      downloadTemplate: 'Download Template',
      fileFormat: 'File Format',
      formatDescription: 'The CSV file must contain the following columns:',
      columns: {
        name: 'Name (required)',
        community: 'Community (required)',
        district: 'District (required)',
        population: 'Population (optional)',
        farmers: 'Number of Farmers (optional)'
      },
      preview: 'Data Preview',
      recordsFound: 'Found {count} records',
      continueImport: 'Continue Import',
      confirmImport: 'Confirm Import',
      processing: 'Processing...',
      importComplete: 'Import Complete',
      summary: 'Import Summary',
      successfulImports: '{count} records imported successfully',
      rejectedImports: '{count} records rejected due to errors',
      existingImports: '{count} records already exist',
      errors: 'Errors',
      backToLocations: 'Back to Locations',
      newImport: 'New Import',
      cancel: 'Cancel',
      back: 'Back'
    }
  };

  const t = translations[language];

  const handleFileSelect = (file: File) => {
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const data: CSVRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: CSVRow = {
        name: '',
        community: '',
        district: ''
      };
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'name':
          case 'όνομα':
            row.name = value;
            break;
          case 'community':
          case 'κοινότητα':
            row.community = value;
            break;
          case 'district':
          case 'επαρχία':
            row.district = value;
            break;
          case 'population':
          case 'πληθυσμός':
            row.population = value ? parseInt(value) : undefined;
            break;
          case 'farmers':
          case 'αγρότες':
            row.farmers = value ? parseInt(value) : undefined;
            break;
        }
      });
      
      if (row.name || row.community || row.district) {
        data.push(row);
      }
    }
    
    setCsvData(data);
    setStep('preview');
  };

  const handleImport = async () => {
    setIsProcessing(true);
    
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock validation and import results
    const result: ImportResult = {
      success: Math.floor(csvData.length * 0.7),
      rejected: Math.floor(csvData.length * 0.2),
      existing: Math.floor(csvData.length * 0.1),
      total: csvData.length,
      errors: [
        {
          row: 3,
          error: language === 'el' ? 'Λείπει υποχρεωτικό πεδίο: Επαρχία' : 'Missing required field: District',
          data: csvData[2] || { name: '', community: '', district: '' }
        },
        {
          row: 7,
          error: language === 'el' ? 'Μη έγκυρος πληθυσμός' : 'Invalid population value',
          data: csvData[6] || { name: '', community: '', district: '' }
        }
      ]
    };
    
    setImportResult(result);
    setIsProcessing(false);
    setStep('result');
  };

  const downloadTemplate = () => {
    const headers = language === 'el' 
      ? 'Όνομα,Κοινότητα,Επαρχία,Πληθυσμός,Αγρότες'
      : 'Name,Community,District,Population,Farmers';
    
    const sampleData = language === 'el'
      ? 'Αγλαντζιά,Αγλαντζιά,Λευκωσία,25420,145\nΛακατάμια,Λακατάμια,Λευκωσία,23430,132'
      : 'Aglandjia,Aglandjia,Nicosia,25420,145\nLakatamia,Lakatamia,Nicosia,23430,132';
    
    const csvContent = `${headers}\n${sampleData}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `locations_template_${language}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetImport = () => {
    setStep('upload');
    setCsvData([]);
    setImportResult(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetImport();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6 py-4">
            {/* File Upload Area */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{t.uploadFile}</h3>
                    <p className="text-gray-600 mt-2">{t.dragDrop}</p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {t.selectFile}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadTemplate}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {t.downloadTemplate}
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Format Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.fileFormat}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{t.formatDescription}</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>{t.columns.name}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>{t.columns.community}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>{t.columns.district}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{t.columns.population}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{t.columns.farmers}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6 py-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t.recordsFound.replace('{count}', csvData.length.toString())}
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>{t.preview}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.columns.name}</TableHead>
                        <TableHead>{t.columns.community}</TableHead>
                        <TableHead>{t.columns.district}</TableHead>
                        <TableHead>{t.columns.population}</TableHead>
                        <TableHead>{t.columns.farmers}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.slice(0, 10).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.community}</TableCell>
                          <TableCell>{row.district}</TableCell>
                          <TableCell>{row.population || '-'}</TableCell>
                          <TableCell>{row.farmers || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {csvData.length > 10 && (
                    <p className="text-center text-gray-500 py-4">
                      {language === 'el' 
                        ? `... και ${csvData.length - 10} ακόμα εγγραφές`
                        : `... and ${csvData.length - 10} more records`}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setStep('upload')}>
                {t.back}
              </Button>
              <Button onClick={handleImport} disabled={isProcessing}>
                {isProcessing ? t.processing : t.confirmImport}
              </Button>
            </div>
          </div>
        )}

        {step === 'result' && importResult && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{t.importComplete}</h3>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t.summary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                    <div className="text-sm text-green-700">{t.successfulImports.replace('{count}', importResult.success.toString())}</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResult.rejected}</div>
                    <div className="text-sm text-red-700">{t.rejectedImports.replace('{count}', importResult.rejected.toString())}</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{importResult.existing}</div>
                    <div className="text-sm text-yellow-700">{t.existingImports.replace('{count}', importResult.existing.toString())}</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">{t.errors}</h4>
                    <div className="space-y-2">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-red-800">
                              {language === 'el' ? `Γραμμή ${error.row}` : `Row ${error.row}`}: {error.error}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-red-700">
                            {Object.entries(error.data).map(([key, value]) => (
                              <span key={key} className="mr-4">
                                {key}: {value || '-'}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleClose}>
                {t.backToLocations}
              </Button>
              <Button onClick={resetImport}>
                {t.newImport}
              </Button>
            </div>
          </div>
        )}

        {step !== 'result' && (
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              {t.cancel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}