import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for patients and doctors
interface Patient {
  id: number;
  name: string;
  condition: string;
  assignedDoctorId: number | null;
}

interface Doctor {
  id: number;
  name: string;
}

const PatientPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsResponse, doctorsResponse] = await Promise.all([
          axios.get('/api/patients'),
          axios.get('/api/doctors')
        ]);
        setPatients(patientsResponse.data);
        setDoctors(doctorsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleConfirmClick = (patientId: number) => {
    setSelectedPatient(patientId);
  };

  const handleDoctorAssign = async () => {
    if (selectedPatient !== null && selectedDoctor !== null) {
      try {
        await axios.patch(`/api/patients/${selectedPatient}`, { assignedDoctorId: selectedDoctor });
        // Update local state after successful assignment
        setPatients(patients.map(patient =>
          patient.id === selectedPatient ? { ...patient, assignedDoctorId: selectedDoctor } : patient
        ));
        setSelectedPatient(null);
        setSelectedDoctor(null);
      } catch (error) {
        console.error('Error assigning doctor:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-6">Patients Applied to Hospital</h2>
      <div className="space-y-4">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white p-4 rounded-md shadow-md flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{patient.name}</h3>
              <p className="text-gray-600">Condition: {patient.condition}</p>
              <p className="text-gray-600">
                Assigned Doctor:{' '}
                {patient.assignedDoctorId
                  ? doctors.find((doc) => doc.id === patient.assignedDoctorId)?.name
                  : 'Not Assigned'}
              </p>
            </div>
            <Button
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={() => handleConfirmClick(patient.id)}
            >
              Confirm
            </Button>
          </div>
        ))}
      </div>

      {selectedPatient !== null && (
        <div className="mt-8 p-4 bg-white rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-4">Assign Doctor</h3>
          <Select onValueChange={(value) => setSelectedDoctor(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doc) => (
                <SelectItem key={doc.id} value={doc.id.toString()}>
                  {doc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
            onClick={handleDoctorAssign}
          >
            Assign Doctor
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientPage;
