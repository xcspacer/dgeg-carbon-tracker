/**
 * Componente de Upload de Ficheiros Excel
 * 
 * Permite ao utilizador fazer upload de ficheiros .xlsx/.xls
 * com validação e feedback visual
 */

import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import './FileUpload.css';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  isLoading, 
  error 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    const validExtensions = ['.xlsx', '.xls'];
    
    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    return hasValidType || hasValidExtension;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="file-upload-container">
      <div 
        className={`file-upload-zone ${isDragOver ? 'drag-over' : ''} ${isLoading ? 'loading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          className="file-input"
          id="file-input"
          disabled={isLoading}
        />
        
        <label htmlFor="file-input" className="file-upload-label">
          {isLoading ? (
            <>
              <div className="spinner" />
              <span className="upload-title">A processar ficheiro...</span>
              <span className="upload-subtitle">Por favor aguarde</span>
            </>
          ) : selectedFile ? (
            <>
              <FileSpreadsheet size={48} className="upload-icon success" />
              <span className="upload-title">{selectedFile.name}</span>
              <span className="upload-subtitle">
                Clique ou arraste para substituir
              </span>
            </>
          ) : (
            <>
              <Upload size={48} className="upload-icon" />
              <span className="upload-title">
                Arraste o ficheiro Excel aqui
              </span>
              <span className="upload-subtitle">
                ou clique para selecionar
              </span>
              <span className="upload-formats">
                Formatos aceites: .xlsx, .xls
              </span>
            </>
          )}
        </label>
      </div>

      {error && (
        <div className="upload-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && !error && !isLoading && (
        <div className="upload-success">
          <CheckCircle size={20} />
          <span>Ficheiro carregado com sucesso!</span>
        </div>
      )}
    </div>
  );
};
