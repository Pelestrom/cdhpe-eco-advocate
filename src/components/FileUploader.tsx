import { useState, useRef } from 'react';
import { Upload, X, File, Image, Video, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onUpload: (file: File) => Promise<any>;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  className?: string;
}

const FileUploader = ({ 
  onUpload, 
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf'],
  maxSize = 200,
  multiple = false,
  className = ''
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `Le fichier "${file.name}" dépasse la taille maximale de ${maxSize}MB`,
        variant: "destructive"
      });
      return false;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });

    if (!isValidType) {
      toast({
        title: "Type de fichier non supporté",
        description: `Le fichier "${file.name}" n'est pas d'un type accepté`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      if (multiple) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
      } else {
        setSelectedFiles([validFiles[0]]);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await onUpload(file);
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      toast({
        title: "Upload réussi",
        description: `${selectedFiles.length} fichier(s) uploadé(s) avec succès`,
      });

      setSelectedFiles([]);
      setUploadProgress(0);
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: "Une erreur s'est produite lors de l'upload",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (file.type.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (file.type.startsWith('audio/')) return <Music className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Glissez vos fichiers ici ou cliquez pour sélectionner
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Types acceptés: {acceptedTypes.join(', ')}
          </p>
          <p className="text-muted-foreground text-xs">
            Taille maximale: {maxSize}MB par fichier
          </p>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">Fichiers sélectionnés:</h4>
          {selectedFiles.map((file, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Upload en cours...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setSelectedFiles([])}
              disabled={uploading}
            >
              Annuler
            </Button>
            <Button
              onClick={uploadFiles}
              disabled={uploading || selectedFiles.length === 0}
              className="btn-hero"
            >
              {uploading ? 'Upload...' : `Upload ${selectedFiles.length} fichier(s)`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;