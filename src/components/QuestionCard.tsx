import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { useState } from "react";

interface Question {
  id: string;
  type: "multiple_choice" | "text" | "number" | "date" | "matrix" | "file";
  title: string;
  helpText?: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

interface QuestionCardProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
}

export const QuestionCard = ({ question, value, onChange }: QuestionCardProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      onChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange(newFiles);
  };

  const renderInput = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <RadioGroup value={value} onValueChange={onChange}>
            <div className="space-y-3">
              {question.options?.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label
                    htmlFor={option}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case "number":
        return (
          <Input
            type="number"
            min={question.min}
            max={question.max}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Εισάγετε αριθμό"
            className="text-base h-12"
          />
        );

      case "text":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Εισάγετε την απάντησή σας"
            className="min-h-32 text-base"
          />
        );

      case "file":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => document.getElementById("camera-input")?.click()}
              >
                <Camera className="h-6 w-6" />
                <span className="text-sm">Κάμερα</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm">Αρχεία</span>
              </Button>
            </div>
            <input
              id="camera-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              id="file-input"
              type="file"
              accept="image/*,video/*,.pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {question.title}
          {question.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </h3>
        {question.helpText && (
          <p className="text-sm text-muted-foreground">{question.helpText}</p>
        )}
      </div>
      {renderInput()}
    </Card>
  );
};
