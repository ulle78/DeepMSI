// src/components/PatientDetailsModal.js
import React, { useState } from 'react';

const PatientDetailsModal = ({ isOpen, onClose, onSubmit }) => {
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

export default PatientDetailsModal;