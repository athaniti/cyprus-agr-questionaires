import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
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
  DialogTrigger,
} from './ui/dialog';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Settings, 
  Hash, 
  Type, 
  Calendar,
  CheckSquare,
  Circle,
  ListChecks
} from 'lucide-react';

interface TableColumn {
  id: string;
  name: string;
  nameEn?: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox';
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  code?: string; // Κωδικοποίηση για συμβατότητα με κανονισμούς
  category?: string; // Κατηγορία (π.χ. ζωικό κεφάλαιο, καλλιέργεια)
}

interface TableConfig {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  columns: TableColumn[];
  minRows?: number;
  maxRows?: number;
  allowAddRows: boolean;
  allowDeleteRows: boolean;
}

interface TableBuilderProps {
  language: 'el' | 'en';
  config?: TableConfig;
  onChange: (config: TableConfig) => void;
}

const translations = {
  el: {
    title: 'Διαμόρφωση Πίνακα',
    tableName: 'Όνομα Πίνακα',
    tableNameEn: 'Όνομα Πίνακα (EN)',
    description: 'Περιγραφή',
    columns: 'Στήλες',
    addColumn: 'Προσθήκη Στήλης',
    columnName: 'Όνομα Στήλης',
    columnNameEn: 'Όνομα Στήλης (EN)',
    columnType: 'Τύπος',
    required: 'Υποχρεωτική',
    code: 'Κωδικός',
    category: 'Κατηγορία',
    options: 'Επιλογές',
    addOption: 'Προσθήκη Επιλογής',
    validation: 'Επικύρωση',
    minValue: 'Ελάχιστη Τιμή',
    maxValue: 'Μέγιστη Τιμή',
    rowSettings: 'Ρυθμίσεις Γραμμών',
    minRows: 'Ελάχιστες Γραμμές',
    maxRows: 'Μέγιστες Γραμμές',
    allowAddRows: 'Επιτρέπεται Προσθήκη Γραμμών',
    allowDeleteRows: 'Επιτρέπεται Διαγραφή Γραμμών',
    preview: 'Προεπισκόπηση',
    text: 'Κείμενο',
    number: 'Αριθμός',
    date: 'Ημερομηνία',
    select: 'Επιλογή',
    multiselect: 'Πολλαπλή Επιλογή',
    checkbox: 'Checkbox',
    livestock: 'Ζωικό Κεφάλαιο',
    crops: 'Καλλιέργειες',
    products: 'Προϊόντα',
    equipment: 'Εξοπλισμός',
    general: 'Γενικά',
    codePlaceholder: 'π.χ. LST001, CRP002',
    namePlaceholder: 'π.χ. Αριθμός Ζώων',
    descriptionPlaceholder: 'Περιγράψτε τον σκοπό του πίνακα...',
    noColumns: 'Δεν υπάρχουν στήλες',
    addFirstColumn: 'Προσθέστε την πρώτη στήλη',
  },
  en: {
    title: 'Table Configuration',
    tableName: 'Table Name',
    tableNameEn: 'Table Name (EN)',
    description: 'Description',
    columns: 'Columns',
    addColumn: 'Add Column',
    columnName: 'Column Name',
    columnNameEn: 'Column Name (EN)',
    columnType: 'Type',
    required: 'Required',
    code: 'Code',
    category: 'Category',
    options: 'Options',
    addOption: 'Add Option',
    validation: 'Validation',
    minValue: 'Min Value',
    maxValue: 'Max Value',
    rowSettings: 'Row Settings',
    minRows: 'Min Rows',
    maxRows: 'Max Rows',
    allowAddRows: 'Allow Add Rows',
    allowDeleteRows: 'Allow Delete Rows',
    preview: 'Preview',
    text: 'Text',
    number: 'Number',
    date: 'Date',
    select: 'Select',
    multiselect: 'Multi Select',
    checkbox: 'Checkbox',
    livestock: 'Livestock',
    crops: 'Crops',
    products: 'Products',
    equipment: 'Equipment',
    general: 'General',
    codePlaceholder: 'e.g. LST001, CRP002',
    namePlaceholder: 'e.g. Number of Animals',
    descriptionPlaceholder: 'Describe the purpose of the table...',
    noColumns: 'No columns',
    addFirstColumn: 'Add the first column',
  }
};

const columnTypeIcons = {
  text: Type,
  number: Hash,
  date: Calendar,
  select: Circle,
  multiselect: CheckSquare,
  checkbox: CheckSquare,
};

export function TableBuilder({ language, config, onChange }: TableBuilderProps) {
  const t = translations[language];
  
  const [tableConfig, setTableConfig] = useState<TableConfig>(config || {
    id: `table-${Date.now()}`,
    name: '',
    nameEn: '',
    description: '',
    columns: [],
    minRows: 1,
    maxRows: 10,
    allowAddRows: true,
    allowDeleteRows: true,
  });

  const [editingColumn, setEditingColumn] = useState<string | null>(null);

  const updateConfig = (updates: Partial<TableConfig>) => {
    const newConfig = { ...tableConfig, ...updates };
    setTableConfig(newConfig);
    onChange(newConfig);
  };

  const addColumn = () => {
    const newColumn: TableColumn = {
      id: `col-${Date.now()}`,
      name: '',
      type: 'text',
      required: false,
      options: [],
    };
    
    const newColumns = [...tableConfig.columns, newColumn];
    updateConfig({ columns: newColumns });
    setEditingColumn(newColumn.id);
  };

  const updateColumn = (columnId: string, updates: Partial<TableColumn>) => {
    const newColumns = tableConfig.columns.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    );
    updateConfig({ columns: newColumns });
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = tableConfig.columns.filter(col => col.id !== columnId);
    updateConfig({ columns: newColumns });
  };

  const addOption = (columnId: string) => {
    const column = tableConfig.columns.find(col => col.id === columnId);
    if (column) {
      const newOptions = [...(column.options || []), ''];
      updateColumn(columnId, { options: newOptions });
    }
  };

  const updateOption = (columnId: string, optionIndex: number, value: string) => {
    const column = tableConfig.columns.find(col => col.id === columnId);
    if (column) {
      const newOptions = [...(column.options || [])];
      newOptions[optionIndex] = value;
      updateColumn(columnId, { options: newOptions });
    }
  };

  const removeOption = (columnId: string, optionIndex: number) => {
    const column = tableConfig.columns.find(col => col.id === columnId);
    if (column) {
      const newOptions = (column.options || []).filter((_, i) => i !== optionIndex);
      updateColumn(columnId, { options: newOptions });
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Basic Info */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t.tableName}</Label>
              <Input
                value={tableConfig.name}
                onChange={(e) => updateConfig({ name: e.target.value })}
                placeholder={t.namePlaceholder}
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>{t.tableNameEn}</Label>
              <Input
                value={tableConfig.nameEn || ''}
                onChange={(e) => updateConfig({ nameEn: e.target.value })}
                placeholder="e.g. Number of Animals"
                className="rounded-xl mt-1"
              />
            </div>
          </div>
          <div>
            <Label>{t.description}</Label>
            <Input
              value={tableConfig.description || ''}
              onChange={(e) => updateConfig({ description: e.target.value })}
              placeholder={t.descriptionPlaceholder}
              className="rounded-xl mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Columns Configuration */}
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {t.columns}
              <Badge variant="secondary" className="rounded-lg">
                {tableConfig.columns.length}
              </Badge>
            </CardTitle>
            <Button onClick={addColumn} className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              {t.addColumn}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {tableConfig.columns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Hash className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>{t.noColumns}</p>
              <p className="text-sm">{t.addFirstColumn}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tableConfig.columns.map((column, index) => {
                const Icon = columnTypeIcons[column.type] || Type;
                const isEditing = editingColumn === column.id;
                
                return (
                  <Card key={column.id} className="rounded-xl border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <GripVertical className="h-5 w-5 text-gray-400 mt-2 cursor-move" />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="rounded-lg">
                                <Icon className="h-3 w-3 mr-1" />
                                {index + 1}
                              </Badge>
                              <span className="font-medium">
                                {column.name || `${t.columnName} ${index + 1}`}
                              </span>
                              {column.required && (
                                <Badge className="rounded-lg text-xs">
                                  {t.required}
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingColumn(isEditing ? null : column.id)}
                                className="h-8 w-8 rounded-lg"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteColumn(column.id)}
                                className="h-8 w-8 rounded-lg text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {isEditing && (
                            <div className="border-t pt-3 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs">{t.columnName}</Label>
                                  <Input
                                    value={column.name}
                                    onChange={(e) => updateColumn(column.id, { name: e.target.value })}
                                    placeholder={t.namePlaceholder}
                                    className="rounded-xl mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">{t.columnNameEn}</Label>
                                  <Input
                                    value={column.nameEn || ''}
                                    onChange={(e) => updateColumn(column.id, { nameEn: e.target.value })}
                                    placeholder="e.g. Number of Animals"
                                    className="rounded-xl mt-1"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <Label className="text-xs">{t.columnType}</Label>
                                  <Select
                                    value={column.type}
                                    onValueChange={(value) => updateColumn(column.id, { type: value as any })}
                                  >
                                    <SelectTrigger className="rounded-xl mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">{t.text}</SelectItem>
                                      <SelectItem value="number">{t.number}</SelectItem>
                                      <SelectItem value="date">{t.date}</SelectItem>
                                      <SelectItem value="select">{t.select}</SelectItem>
                                      <SelectItem value="multiselect">{t.multiselect}</SelectItem>
                                      <SelectItem value="checkbox">{t.checkbox}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-xs">{t.code}</Label>
                                  <Input
                                    value={column.code || ''}
                                    onChange={(e) => updateColumn(column.id, { code: e.target.value })}
                                    placeholder={t.codePlaceholder}
                                    className="rounded-xl mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">{t.category}</Label>
                                  <Select
                                    value={column.category || ''}
                                    onValueChange={(value) => updateColumn(column.id, { category: value })}
                                  >
                                    <SelectTrigger className="rounded-xl mt-1">
                                      <SelectValue placeholder="Επιλέξτε κατηγορία" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="livestock">{t.livestock}</SelectItem>
                                      <SelectItem value="crops">{t.crops}</SelectItem>
                                      <SelectItem value="products">{t.products}</SelectItem>
                                      <SelectItem value="equipment">{t.equipment}</SelectItem>
                                      <SelectItem value="general">{t.general}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={column.required}
                                    onChange={(e) => updateColumn(column.id, { required: e.target.checked })}
                                    className="rounded"
                                  />
                                  <span className="text-sm">{t.required}</span>
                                </label>
                              </div>

                              {(column.type === 'select' || column.type === 'multiselect') && (
                                <div>
                                  <Label className="text-xs">{t.options}</Label>
                                  <div className="space-y-2 mt-2">
                                    {(column.options || []).map((option, optIndex) => (
                                      <div key={optIndex} className="flex items-center gap-2">
                                        <Input
                                          value={option}
                                          onChange={(e) => updateOption(column.id, optIndex, e.target.value)}
                                          placeholder={`${t.addOption} ${optIndex + 1}`}
                                          className="rounded-xl flex-1"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeOption(column.id, optIndex)}
                                          className="h-8 w-8 rounded-lg text-red-600"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addOption(column.id)}
                                      className="gap-2 rounded-lg w-full"
                                    >
                                      <Plus className="h-3 w-3" />
                                      {t.addOption}
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {column.type === 'number' && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label className="text-xs">{t.minValue}</Label>
                                    <Input
                                      type="number"
                                      value={column.validation?.min || ''}
                                      onChange={(e) => updateColumn(column.id, {
                                        validation: {
                                          ...column.validation,
                                          min: parseInt(e.target.value) || undefined
                                        }
                                      })}
                                      className="rounded-xl mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">{t.maxValue}</Label>
                                    <Input
                                      type="number"
                                      value={column.validation?.max || ''}
                                      onChange={(e) => updateColumn(column.id, {
                                        validation: {
                                          ...column.validation,
                                          max: parseInt(e.target.value) || undefined
                                        }
                                      })}
                                      className="rounded-xl mt-1"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Row Settings */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>{t.rowSettings}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t.minRows}</Label>
              <Input
                type="number"
                value={tableConfig.minRows || 1}
                onChange={(e) => updateConfig({ minRows: parseInt(e.target.value) || 1 })}
                min="1"
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label>{t.maxRows}</Label>
              <Input
                type="number"
                value={tableConfig.maxRows || 10}
                onChange={(e) => updateConfig({ maxRows: parseInt(e.target.value) || 10 })}
                min="1"
                className="rounded-xl mt-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tableConfig.allowAddRows}
                onChange={(e) => updateConfig({ allowAddRows: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">{t.allowAddRows}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tableConfig.allowDeleteRows}
                onChange={(e) => updateConfig({ allowDeleteRows: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">{t.allowDeleteRows}</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {tableConfig.columns.length > 0 && (
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>{t.preview}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableConfig.columns.map((column) => (
                      <TableHead key={column.id} className="min-w-[150px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span>{column.name}</span>
                            {column.required && (
                              <span className="text-red-600 text-xs">*</span>
                            )}
                          </div>
                          {column.code && (
                            <Badge variant="outline" className="text-xs">
                              {column.code}
                            </Badge>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: Math.max(2, tableConfig.minRows || 1) }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {tableConfig.columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.type === 'text' && (
                            <Input placeholder="Κείμενο..." className="rounded-xl" />
                          )}
                          {column.type === 'number' && (
                            <Input type="number" placeholder="0" className="rounded-xl" />
                          )}
                          {column.type === 'date' && (
                            <Input type="date" className="rounded-xl" />
                          )}
                          {column.type === 'select' && (
                            <Select>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Επιλογή..." />
                              </SelectTrigger>
                              <SelectContent>
                                {(column.options || []).map((option, i) => (
                                  <SelectItem key={i} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {column.type === 'checkbox' && (
                            <div className="flex justify-center">
                              <input type="checkbox" className="rounded" />
                            </div>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}