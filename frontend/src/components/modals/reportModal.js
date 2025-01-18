// src/components/modals/ReportModal.js
import React, { useState, useRef } from 'react';
import { FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const PatientDetailsModal = ({ isOpen, onClose, onSubmit }) => {
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    clinicalHistory: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(patientData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Patient Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Name</label>
            <input
              type="text"
              value={patientData.name}
              onChange={(e) => setPatientData({...patientData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={patientData.age}
              onChange={(e) => setPatientData({...patientData, age: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={patientData.gender}
              onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Clinical History</label>
            <textarea
              value={patientData.clinicalHistory}
              onChange={(e) => setPatientData({...patientData, clinicalHistory: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Report View Modal Component
export const ReportViewModal = ({ isOpen, onClose, reportData }) => {
  const reportRef = useRef(null);

  if (!isOpen || !reportData) return null;

  const handleDownload = async () => {
    try {
      const reportElement = reportRef.current;
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`histopath_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Report Header and Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Analysis Report</h2>
          <div className="space-x-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="space-y-6 bg-white p-8" id="report-content">
          {/* Hospital/Institution Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Histopathological Analysis Report</h1>
            <p className="text-gray-600">AI-Assisted Diagnostic Report</p>
          </div>

          {/* Report Metadata */}
          <div className="border-b pb-4 grid grid-cols-2">
            <div>
              <p className="text-gray-600">Report ID:</p>
              <p className="font-medium">HS-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Date:</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Patient Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold border-b pb-2">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-600">Name:</p>
                <p className="font-medium">{reportData.patient.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Age:</p>
                <p className="font-medium">{reportData.patient.age} years</p>
              </div>
              <div>
                <p className="text-gray-600">Gender:</p>
                <p className="font-medium">{reportData.patient.gender}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Clinical History:</p>
                <p className="font-medium">{reportData.patient.clinicalHistory}</p>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Analysis Results</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className={`p-4 rounded-lg ${
                  reportData.prediction.class === 'MSI' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className="text-gray-600">Classification:</p>
                  <p className={`text-xl font-bold ${
                    reportData.prediction.class === 'MSIMUT' ? 'text-green-700' : 'text-blue-700'
                  }`}>
                    {reportData.prediction.class === 'MSIMUT' 
                      ? 'Microsatellite Instability (MSIMUT)' 
                      : 'Microsatellite Stable (MSS)'}
                  </p>
                  <div className="mt-4">
                    <p className="text-gray-600">Confidence Score:</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          reportData.prediction.class === 'MSI' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${(reportData.prediction.probability * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium mt-1">
                      {(reportData.prediction.probability * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="border rounded-lg p-4">
                  <p className="text-gray-600 mb-2">Analysis Image:</p>
                  <img
                    src={reportData.image}
                    alt="Analysis"
                    className="w-full h-48 object-contain rounded border"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Disclaimer */}
          <div className="space-y-4 mt-8">
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-700 mb-2">Important Notes:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>This analysis was performed using AI-assisted technology</li>
                <li>Results should be reviewed by a qualified healthcare professional</li>
                <li>Final clinical decisions should not be based solely on this report</li>
              </ul>
            </div>
            <div className="text-xs text-gray-400 text-center pt-4 border-t">
              <p>Generated by AI-Powered MSI-MSS Prediction System</p>
              <p>Report Generated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};