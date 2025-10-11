import React, { createContext, useContext, useState } from 'react';

type Language = 'el' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  el: {
    // Sidebar
    'dashboard': 'Πίνακας Ελέγχου',
    'questionnaires': 'Ερωτηματολόγια',
    'themes': 'Θέματα',
    'samples': 'Δείγματα & Προσκλήσεις',
    'quotas': 'Διαχείριση Ποσοστώσεων',
    'locations': 'Τοποθεσίες',
    'reports': 'Αναφορές',
    
    // Header
    'notifications': 'Ειδοποιήσεις',
    'profile': 'Προφίλ',
    'settings': 'Ρυθμίσεις',
    'logout': 'Αποσύνδεση',
    'ministry': 'Υπουργείο Γεωργίας Κύπρου',
    
    // Dashboard
    'dashboard.title': 'Επισκόπηση Συστήματος',
    'dashboard.activeQuestionnaires': 'Ενεργά Ερωτηματολόγια',
    'dashboard.completedResponses': 'Ολοκληρωμένες Απαντήσεις',
    'dashboard.pendingInvitations': 'Εκκρεμείς Προσκλήσεις',
    'dashboard.completionRate': 'Ποσοστό Ολοκλήρωσης',
    'dashboard.progressByDistrict': 'Πρόοδος ανά Επαρχία',
    'dashboard.completionTrends': 'Τάσεις Ολοκλήρωσης',
    'dashboard.recentActivity': 'Πρόσφατη Δραστηριότητα',
    'dashboard.topPerforming': 'Κορυφαίες Κοινότητες',
    
    // Questionnaires
    'questionnaires.title': 'Διαχείριση Ερωτηματολογίων',
    'questionnaires.createNew': 'Δημιουργία Νέου',
    'questionnaires.search': 'Αναζήτηση...',
    'questionnaires.all': 'Όλα',
    'questionnaires.active': 'Ενεργά',
    'questionnaires.draft': 'Πρόχειρα',
    'questionnaires.completed': 'Ολοκληρωμένα',
    'questionnaires.title.label': 'Τίτλος',
    'questionnaires.status': 'Κατάσταση',
    'questionnaires.responses': 'Απαντήσεις',
    'questionnaires.created': 'Δημιουργήθηκε',
    'questionnaires.actions': 'Ενέργειες',
    'questionnaires.edit': 'Επεξεργασία',
    'questionnaires.view': 'Προβολή',
    'questionnaires.delete': 'Διαγραφή',
    
    // Questionnaire Builder
    'builder.title': 'Δημιουργία Ερωτηματολογίου',
    'builder.basicInfo': 'Βασικές Πληροφορίες',
    'builder.questions': 'Ερωτήσεις',
    'builder.preview': 'Προεπισκόπηση',
    'builder.publish': 'Δημοσίευση',
    'builder.name': 'Όνομα Ερωτηματολογίου',
    'builder.description': 'Περιγραφή',
    'builder.addQuestion': 'Προσθήκη Ερώτησης',
    'builder.questionTypes': 'Τύποι Ερωτήσεων',
    'builder.multipleChoice': 'Πολλαπλής Επιλογής',
    'builder.text': 'Κείμενο',
    'builder.number': 'Αριθμός',
    'builder.date': 'Ημερομηνία',
    'builder.matrix': 'Πίνακας',
    'builder.fileUpload': 'Μεταφόρτωση Αρχείου',
    'builder.photo': 'Φωτογραφία',
    'builder.saveDraft': 'Αποθήκευση Προχείρου',
    
    // Themes
    'themes.title': 'Διαμόρφωση Θεμάτων',
    'themes.branding': 'Επωνυμία',
    'themes.colors': 'Χρώματα',
    'themes.typography': 'Τυπογραφία',
    'themes.preview': 'Προεπισκόπηση',
    'themes.logo': 'Λογότυπο',
    'themes.primaryColor': 'Κύριο Χρώμα',
    'themes.secondaryColor': 'Δευτερεύον Χρώμα',
    'themes.fontFamily': 'Γραμματοσειρά',
    'themes.save': 'Αποθήκευση Αλλαγών',
    
    // Samples
    'samples.title': 'Δείγματα & Προσκλήσεις',
    'samples.createBatch': 'Δημιουργία Παρτίδας',
    'samples.batchName': 'Όνομα Παρτίδας',
    'samples.region': 'Περιοχή',
    'samples.sampleSize': 'Μέγεθος Δείγματος',
    'samples.invitations': 'Προσκλήσεις',
    'samples.sent': 'Απεσταλμένες',
    'samples.opened': 'Ανοιγμένες',
    'samples.completed': 'Ολοκληρωμένες',
    'samples.sendInvitations': 'Αποστολή Προσκλήσεων',
    'samples.template': 'Πρότυπο',
    
    // Quotas
    'quotas.title': 'Διαχείριση Ποσοστώσεων',
    'quotas.category': 'Κατηγορία',
    'quotas.required': 'Απαιτούμενα',
    'quotas.completed': 'Ολοκληρωμένα',
    'quotas.remaining': 'Υπολειπόμενα',
    'quotas.progress': 'Πρόοδος',
    'quotas.byCategory': 'Ποσοστώσεις ανά Κατηγορία',
    'quotas.realTime': 'Ενημέρωση σε Πραγματικό Χρόνο',
    
    // Locations
    'locations.title': 'Διαχείριση Τοποθεσιών',
    'locations.addNew': 'Προσθήκη Νέας',
    'locations.import': 'Εισαγωγή CSV',
    'locations.municipality': 'Δήμος',
    'locations.community': 'Κοινότητα',
    'locations.district': 'Επαρχία',
    'locations.population': 'Πληθυσμός',
    'locations.edit': 'Επεξεργασία',
    'locations.delete': 'Διαγραφή',
    
    // Reports
    'reports.title': 'Αναφορές & Αναλύσεις',
    'reports.completionRates': 'Ποσοστά Ολοκλήρωσης',
    'reports.participation': 'Συμμετοχή ανά Περιοχή',
    'reports.timeAnalysis': 'Ανάλυση Χρόνου',
    'reports.export': 'Εξαγωγή',
    'reports.dateRange': 'Εύρος Ημερομηνιών',
    'reports.generate': 'Δημιουργία Αναφοράς',
    
    // Common
    'save': 'Αποθήκευση',
    'cancel': 'Ακύρωση',
    'delete': 'Διαγραφή',
    'edit': 'Επεξεργασία',
    'view': 'Προβολή',
    'search': 'Αναζήτηση',
    'filter': 'Φίλτρο',
    'export': 'Εξαγωγή',
    'import': 'Εισαγωγή',
    'next': 'Επόμενο',
    'previous': 'Προηγούμενο',
    'close': 'Κλείσιμο',
  },
  en: {
    // Sidebar
    'dashboard': 'Dashboard',
    'questionnaires': 'Questionnaires',
    'themes': 'Themes',
    'samples': 'Samples & Invitations',
    'quotas': 'Quotas Management',
    'locations': 'Locations',
    'reports': 'Reports',
    
    // Header
    'notifications': 'Notifications',
    'profile': 'Profile',
    'settings': 'Settings',
    'logout': 'Logout',
    'ministry': 'Ministry of Agriculture of Cyprus',
    
    // Dashboard
    'dashboard.title': 'System Overview',
    'dashboard.activeQuestionnaires': 'Active Questionnaires',
    'dashboard.completedResponses': 'Completed Responses',
    'dashboard.pendingInvitations': 'Pending Invitations',
    'dashboard.completionRate': 'Completion Rate',
    'dashboard.progressByDistrict': 'Progress by District',
    'dashboard.completionTrends': 'Completion Trends',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.topPerforming': 'Top Performing Communities',
    
    // Questionnaires
    'questionnaires.title': 'Questionnaires Management',
    'questionnaires.createNew': 'Create New',
    'questionnaires.search': 'Search...',
    'questionnaires.all': 'All',
    'questionnaires.active': 'Active',
    'questionnaires.draft': 'Draft',
    'questionnaires.completed': 'Completed',
    'questionnaires.title.label': 'Title',
    'questionnaires.status': 'Status',
    'questionnaires.responses': 'Responses',
    'questionnaires.created': 'Created',
    'questionnaires.actions': 'Actions',
    'questionnaires.edit': 'Edit',
    'questionnaires.view': 'View',
    'questionnaires.delete': 'Delete',
    
    // Questionnaire Builder
    'builder.title': 'Create Questionnaire',
    'builder.basicInfo': 'Basic Information',
    'builder.questions': 'Questions',
    'builder.preview': 'Preview',
    'builder.publish': 'Publish',
    'builder.name': 'Questionnaire Name',
    'builder.description': 'Description',
    'builder.addQuestion': 'Add Question',
    'builder.questionTypes': 'Question Types',
    'builder.multipleChoice': 'Multiple Choice',
    'builder.text': 'Text',
    'builder.number': 'Number',
    'builder.date': 'Date',
    'builder.matrix': 'Matrix',
    'builder.fileUpload': 'File Upload',
    'builder.photo': 'Photo',
    'builder.saveDraft': 'Save Draft',
    
    // Themes
    'themes.title': 'Theme Configuration',
    'themes.branding': 'Branding',
    'themes.colors': 'Colors',
    'themes.typography': 'Typography',
    'themes.preview': 'Preview',
    'themes.logo': 'Logo',
    'themes.primaryColor': 'Primary Color',
    'themes.secondaryColor': 'Secondary Color',
    'themes.fontFamily': 'Font Family',
    'themes.save': 'Save Changes',
    
    // Samples
    'samples.title': 'Samples & Invitations',
    'samples.createBatch': 'Create Batch',
    'samples.batchName': 'Batch Name',
    'samples.region': 'Region',
    'samples.sampleSize': 'Sample Size',
    'samples.invitations': 'Invitations',
    'samples.sent': 'Sent',
    'samples.opened': 'Opened',
    'samples.completed': 'Completed',
    'samples.sendInvitations': 'Send Invitations',
    'samples.template': 'Template',
    
    // Quotas
    'quotas.title': 'Quotas Management',
    'quotas.category': 'Category',
    'quotas.required': 'Required',
    'quotas.completed': 'Completed',
    'quotas.remaining': 'Remaining',
    'quotas.progress': 'Progress',
    'quotas.byCategory': 'Quotas by Category',
    'quotas.realTime': 'Real-time Updates',
    
    // Locations
    'locations.title': 'Locations Management',
    'locations.addNew': 'Add New',
    'locations.import': 'Import CSV',
    'locations.municipality': 'Municipality',
    'locations.community': 'Community',
    'locations.district': 'District',
    'locations.population': 'Population',
    'locations.edit': 'Edit',
    'locations.delete': 'Delete',
    
    // Reports
    'reports.title': 'Reports & Analytics',
    'reports.completionRates': 'Completion Rates',
    'reports.participation': 'Participation by Area',
    'reports.timeAnalysis': 'Time Analysis',
    'reports.export': 'Export',
    'reports.dateRange': 'Date Range',
    'reports.generate': 'Generate Report',
    
    // Common
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'view': 'View',
    'search': 'Search',
    'filter': 'Filter',
    'export': 'Export',
    'import': 'Import',
    'next': 'Next',
    'previous': 'Previous',
    'close': 'Close',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('el');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
