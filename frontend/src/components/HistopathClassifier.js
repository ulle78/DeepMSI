// src/components/HistopathClassifier.js
import React, { useState } from 'react';
import { Upload, FileText, RefreshCw, Play } from 'lucide-react';
import { PatientDetailsModal, ReportViewModal } from './modals/reportModal';

const HistopathClassifier = () => {
  // Core states for image handling and analysis
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPG/PNG)');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
      setPrediction(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      setError('Please upload an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError('Error making prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
  };

  const generatePdfReport = async (patientData) => {
    const reportData = {
      patient: patientData,
      image: imagePreview,
      prediction: prediction,
      date: new Date().toLocaleDateString()
    };
    setReportData(reportData);
    setShowReportModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h1 className="text-2xl font-bold text-center">
            Histopathological Image Classification
          </h1>
          <p className="text-blue-100 mt-1 text-center text-sm">
            AI-Powered MSI-MSS Prediction System
          </p>
        </div>
        
        {/* Main Content */}
        <div className="p-8">
          <div className="flex gap-8">
            {/* Left Panel - Controls */}
            <div className="w-56 space-y-4">
              {/* File Operations */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">File Operations</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 
                                  transition-colors cursor-pointer flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </label>
                  <button
                    onClick={handleReset}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 
                             transition-colors flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear
                  </button>
                  <button
                    onClick={() => setShowPatientModal(true)}
                    disabled={!prediction}
                    className={`text-white px-4 py-2 rounded-md transition-colors 
                              flex items-center justify-center
                              ${!prediction ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}>
                    <FileText className="w-4 h-4 mr-2" />
                    Report
                  </button>
                </div>
              </div>

              {/* Analysis Controls */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Analysis</h3>
                <button
                  onClick={handlePredict}
                  disabled={!selectedImage || isLoading}
                  className={`w-full px-4 py-2 rounded-md text-white
                            flex items-center justify-center transition-colors
                            ${!selectedImage || isLoading 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-blue-500 hover:bg-blue-600'}`}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Panel - Preview and Results */}
            <div className="flex-grow">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex gap-6">
                  {/* Image Preview */}
                  <div className="flex-1">
                    <div className="w-full h-96 flex items-center justify-center border border-gray-200 rounded-lg">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <p className="text-gray-400">Upload an image to begin analysis</p>
                      )}
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="w-96">
                    {prediction ? (
                      <div className={`h-full w-full rounded-lg p-6 border flex flex-col justify-center
                        ${prediction.class === 'MSI' 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-blue-50 border-blue-300'}`}
                      >
                        <h3 className="text-lg font-semibold mb-4 text-center">Analysis Results</h3>
                        <div className="space-y-6">
                          {/* Classification Result */}
                          <div className="text-center">
                            <span className={`inline-block text-2xl font-bold px-6 py-3 rounded-lg
                              ${prediction.class === 'MSIMUT' 
                                ? 'text-green-800 bg-green-100 border border-green-200' 
                                : 'text-blue-800 bg-blue-100 border border-blue-200'}`}
                            >
                              {prediction.class === 'MSIMUT' 
                                ? 'Microsatellite Instability (MSIMUT)'
                                : 'Microsatellite Stable (MSS)'}
                            </span>
                            <p className={`mt-2 text-sm ${
                              prediction.class === 'MSIMUT' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              Classification Result
                            </p>
                          </div>

                          {/* Confidence Score */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className={prediction.class === 'MSIMUT' ? 'text-green-700' : 'text-blue-700'}>
                                Confidence Score
                              </span>
                              <span className={`font-semibold ${
                                prediction.class === 'MSIMUT' ? 'text-green-800' : 'text-blue-800'
                              }`}>
                                {(prediction.probability * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ease-out ${
                                  prediction.class === 'MSIMUT' ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${(prediction.probability * 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Report Status */}
                          <div className="text-sm text-gray-600 text-center pt-3 border-t">
                            <p>Report Generation Available</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full w-full border border-gray-200 rounded-lg flex items-center justify-center p-4">
                        <p className="text-gray-400 text-center">Analysis results will appear here</p>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PatientDetailsModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSubmit={generatePdfReport}
      />

      <ReportViewModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportData={reportData}
      />
    </div>
  );
};

export default HistopathClassifier;