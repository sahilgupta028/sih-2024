"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface HospitalDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  numberOfBeds: string;
  specializations: string;
  bio: string;
}

interface PatientDetails {
  id: string;
  name: string;
  age: number;
  condition: string;
  admissionStatus: boolean;
}

const HospitalDashboard: React.FC = () => {
  const [hospitalDetails, setHospitalDetails] = useState<HospitalDetails | null>(null);
  const [patients, setPatients] = useState<PatientDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch hospital details
    const fetchHospitalDetails = async () => {
      try {
        const response = await axios.get('/api/hospital/details');
        setHospitalDetails(response.data);
      } catch (error) {
        console.error('Error fetching hospital details:', error);
      }
    };

    // Fetch patient details
    const fetchPatients = async () => {
      try {
        const response = await axios.get('/api/hospital/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
    fetchPatients();
  }, []);

  const handleAcceptPatient = async (patientId: string) => {
    try {
      await axios.post(`/api/hospital/patients/${patientId}/accept`);
      setPatients(patients.map(patient => 
        patient.id === patientId ? { ...patient, admissionStatus: true } : patient
      ));
    } catch (error) {
      console.error('Error accepting patient:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {hospitalDetails ? (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Hospital Details</h2>
            <div className="mb-6">
              <p><strong>Name:</strong> {hospitalDetails.name}</p>
              <p><strong>Email:</strong> {hospitalDetails.email}</p>
              <p><strong>Phone:</strong> {hospitalDetails.phone}</p>
              <p><strong>Address:</strong> {hospitalDetails.address}</p>
              <p><strong>Registration Number:</strong> {hospitalDetails.registrationNumber}</p>
              <p><strong>Number of Beds:</strong> {hospitalDetails.numberOfBeds}</p>
              <p><strong>Specializations:</strong> {hospitalDetails.specializations}</p>
              <p><strong>Bio:</strong> {hospitalDetails.bio}</p>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Patients</h2>
            {patients.length > 0 ? (
              <ul className="space-y-4">
                {patients.map(patient => (
                  <li key={patient.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Age:</strong> {patient.age}</p>
                    <p><strong>Condition:</strong> {patient.condition}</p>
                    <p><strong>Admission Status:</strong> {patient.admissionStatus ? 'Accepted' : 'Pending'}</p>
                    {!patient.admissionStatus && (
                      <Button
                        onClick={() => handleAcceptPatient(patient.id)}
                        className="mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
                      >
                        Accept Patient
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No patients available.</p>
            )}
          </>
        ) : (
          <p>No hospital details available.</p>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
