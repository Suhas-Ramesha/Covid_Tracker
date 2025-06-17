import React, { useState } from 'react';
import { FileUploader } from '../components/Upload/FileUploader';
import { CheckCircle, AlertCircle, Upload as UploadIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export function Upload() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processedRecords, setProcessedRecords] = useState(0);

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
    setUploadStatus('processing');
    
    // Simulate processing
    setTimeout(() => {
      setProcessedRecords(Math.floor(Math.random() * 10000) + 1000);
      setUploadStatus('success');
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Upload Data</h1>
        <p className="mt-2 text-gray-600">
          Upload your COVID-19 data files for analysis and visualization.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">File Upload</h2>
            <FileUploader onFileUpload={handleFileUpload} />
          </motion.div>

          {/* Processing Status */}
          {uploadStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Status</h3>
              
              <div className="space-y-4">
                {uploadStatus === 'processing' && (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="text-gray-700">Processing uploaded files...</span>
                  </div>
                )}
                
                {uploadStatus === 'success' && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-gray-700">
                      Successfully processed {processedRecords.toLocaleString()} records
                    </span>
                  </div>
                )}
                
                {uploadStatus === 'error' && (
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <span className="text-gray-700">Error processing files</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Instructions Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Format Guidelines</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Required Columns:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• date (YYYY-MM-DD)</li>
                <li>• region</li>
                <li>• country</li>
                <li>• age_group</li>
                <li>• gender</li>
                <li>• deaths</li>
                <li>• cases</li>
                <li>• population</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Supported Formats:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CSV files (.csv)</li>
                <li>• Excel files (.xlsx, .xls)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">File Requirements:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum file size: 10MB</li>
                <li>• UTF-8 encoding recommended</li>
                <li>• First row should contain headers</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <div className="flex items-start">
              <UploadIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Sample Data</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Need help formatting your data? Download our sample template to get started.
                </p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Download Template
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}