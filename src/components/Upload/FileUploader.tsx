import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
}

export function FileUploader({ 
  onFileUpload, 
  acceptedTypes = ['.csv', '.xlsx', '.xls'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false 
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    
    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles.map(file => file.errors[0]?.message).join(', ');
      setError(errorMessages);
      return;
    }

    setUploadedFiles(acceptedFiles);
    setUploadStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      setUploadStatus('success');
      onFileUpload(acceptedFiles);
    }, 2000);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize,
    multiple
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(files => files.filter(file => file !== fileToRemove));
    if (uploadedFiles.length === 1) {
      setUploadStatus('idle');
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <Upload className={`h-12 w-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isDragActive ? 'Drop files here...' : 'Upload COVID Data Files'}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop your CSV or Excel files here, or click to browse
          </p>
          
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span>Accepted formats: {acceptedTypes.join(', ')}</span>
            <span>•</span>
            <span>Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB</span>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {uploadStatus === 'uploading' && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    )}
                    {uploadStatus === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}