import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
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
import { Plus, Trash2, AlertCircle } from 'lucide-react';

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
  code?: string;
  category?: string;
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

interface TableRow {
  id: string;
  data: Record<string, any>;
}

interface TableViewerProps {
  language: 'el' | 'en';
  config: TableConfig;
  value?: TableRow[];
  onChange: (rows: TableRow[]) => void;
  errors?: Record<string, string>;
  readOnly?: boolean;
}

const translations = {
  el: {
    addRow: 'Προσθήκη Γραμμής',
    deleteRow: 'Διαγραφή Γραμμής',
    required: 'Υποχρεωτικό',
    selectOption: 'Επιλέξτε...',
    noData: 'Δεν υπάρχουν δεδομένα',
    addFirstRow: 'Προσθέστε την πρώτη γραμμή',
    minRowsWarning: 'Απαιτούνται τουλάχιστον {min} γραμμές',
    maxRowsWarning: 'Επιτρέπονται μέχρι {max} γραμμές',
    row: 'Γραμμή',
  },
  en: {
    addRow: 'Add Row',
    deleteRow: 'Delete Row',
    required: 'Required',
    selectOption: 'Select...',
    noData: 'No data',
    addFirstRow: 'Add the first row',
    minRowsWarning: 'At least {min} rows required',
    maxRowsWarning: 'Maximum {max} rows allowed',
    row: 'Row',
  }
};

export function TableViewer({ 
  language, 
  config, 
  value = [], 
  onChange, 
  errors = {},
  readOnly = false 
}: TableViewerProps) {
  const t = translations[language];
  const [rows, setRows] = useState<TableRow[]>(value);

  useEffect(() => {
    setRows(value);
  }, [value]);

  useEffect(() => {
    // Ensure minimum rows
    if (config.minRows && rows.length < config.minRows) {
      const newRows = [...rows];
      while (newRows.length < config.minRows) {
        newRows.push({
          id: `row-${Date.now()}-${newRows.length}`,
          data: {}
        });
      }
      setRows(newRows);
      onChange(newRows);
    }
  }, [config.minRows, rows.length, onChange]);

  const addRow = () => {
    if (config.maxRows && rows.length >= config.maxRows) return;
    
    const newRow: TableRow = {
      id: `row-${Date.now()}`,
      data: {}
    };
    
    const newRows = [...rows, newRow];
    setRows(newRows);
    onChange(newRows);
  };

  const deleteRow = (rowId: string) => {
    if (config.minRows && rows.length <= config.minRows) return;
    
    const newRows = rows.filter(row => row.id !== rowId);
    setRows(newRows);
    onChange(newRows);
  };

  const updateCell = (rowId: string, columnId: string, value: any) => {
    const newRows = rows.map(row =>
      row.id === rowId
        ? { ...row, data: { ...row.data, [columnId]: value } }
        : row
    );
    setRows(newRows);
    onChange(newRows);
  };

  const getCellValue = (row: TableRow, column: TableColumn) => {
    return row.data[column.id] || '';
  };

  const getCellError = (rowId: string, columnId: string) => {
    return errors[`${rowId}-${columnId}`];
  };

  const renderCell = (row: TableRow, column: TableColumn, rowIndex: number) => {
    const cellValue = getCellValue(row, column);
    const cellError = getCellError(row.id, column.id);
    const cellId = `${row.id}-${column.id}`;
    
    if (readOnly) {
      return (
        <div className="p-2">
          {column.type === 'checkbox' ? (
            <div className="flex justify-center">
              <input type="checkbox" checked={cellValue} disabled className="rounded" />
            </div>
          ) : column.type === 'multiselect' ? (
            <div className="flex flex-wrap gap-1">
              {(cellValue || []).map((val: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {val}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm">{cellValue}</span>
          )}
        </div>
      );
    }

    const baseClassName = `rounded-xl ${cellError ? 'border-red-500' : ''}`;

    switch (column.type) {
      case 'text':
        return (
          <Input
            value={cellValue}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            placeholder="Κείμενο..."
            className={baseClassName}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={cellValue}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            placeholder="0"
            min={column.validation?.min}
            max={column.validation?.max}
            className={baseClassName}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={cellValue}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            className={baseClassName}
          />
        );

      case 'select':
        return (
          <Select
            value={cellValue}
            onValueChange={(value) => updateCell(row.id, column.id, value)}
          >
            <SelectTrigger className={baseClassName}>
              <SelectValue placeholder={t.selectOption} />
            </SelectTrigger>
            <SelectContent>
              {(column.options || []).map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1 min-h-[32px] border rounded-xl p-2">
              {(cellValue || []).map((val: string, i: number) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="text-xs cursor-pointer"
                  onClick={() => {
                    const newValue = (cellValue || []).filter((_: any, idx: number) => idx !== i);
                    updateCell(row.id, column.id, newValue);
                  }}
                >
                  {val} ×
                </Badge>
              ))}
            </div>
            <Select
              onValueChange={(value) => {
                const currentValue = cellValue || [];
                if (!currentValue.includes(value)) {
                  updateCell(row.id, column.id, [...currentValue, value]);
                }
              }}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t.selectOption} />
              </SelectTrigger>
              <SelectContent>
                {(column.options || []).map((option, i) => (
                  <SelectItem key={i} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={cellValue || false}
              onChange={(e) => updateCell(row.id, column.id, e.target.checked)}
              className="rounded"
            />
          </div>
        );

      default:
        return (
          <Input
            value={cellValue}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            className={baseClassName}
          />
        );
    }
  };

  const canAddRow = config.allowAddRows && (!config.maxRows || rows.length < config.maxRows);
  const canDeleteRow = config.allowDeleteRows && (!config.minRows || rows.length > config.minRows);

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {language === 'el' ? config.name : (config.nameEn || config.name)}
              <Badge variant="secondary" className="rounded-lg">
                {rows.length} {language === 'el' ? 'γραμμές' : 'rows'}
              </Badge>
            </CardTitle>
            {config.description && (
              <p className="text-sm text-gray-600 mt-1">{config.description}</p>
            )}
          </div>
          {!readOnly && canAddRow && (
            <Button onClick={addRow} size="sm" className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              {t.addRow}
            </Button>
          )}
        </div>
        
        {/* Validation Messages */}
        {config.minRows && rows.length < config.minRows && (
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            {t.minRowsWarning.replace('{min}', config.minRows.toString())}
          </div>
        )}
        {config.maxRows && rows.length >= config.maxRows && (
          <div className="flex items-center gap-2 text-blue-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            {t.maxRowsWarning.replace('{max}', config.maxRows.toString())}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {rows.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <p>{t.noData}</p>
              <p className="text-sm">{t.addFirstRow}</p>
            </div>
            {!readOnly && canAddRow && (
              <Button onClick={addRow} className="gap-2 rounded-xl">
                <Plus className="h-4 w-4" />
                {t.addRow}
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {!readOnly && config.allowDeleteRows && (
                    <TableHead className="w-12"></TableHead>
                  )}
                  {config.columns.map((column) => (
                    <TableHead key={column.id} className="min-w-[150px]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span>
                            {language === 'el' ? column.name : (column.nameEn || column.name)}
                          </span>
                          {column.required && (
                            <span className="text-red-600 text-xs">*</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {column.code && (
                            <Badge variant="outline" className="text-xs">
                              {column.code}
                            </Badge>
                          )}
                          {column.category && (
                            <Badge variant="secondary" className="text-xs">
                              {column.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={row.id}>
                    {!readOnly && config.allowDeleteRows && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRow(row.id)}
                          disabled={!canDeleteRow}
                          className="h-8 w-8 rounded-lg text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                    {config.columns.map((column) => (
                      <TableCell key={column.id}>
                        <div className="space-y-1">
                          {renderCell(row, column, rowIndex)}
                          {getCellError(row.id, column.id) && (
                            <div className="flex items-center gap-1 text-red-600 text-xs">
                              <AlertCircle className="h-3 w-3" />
                              {getCellError(row.id, column.id)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}