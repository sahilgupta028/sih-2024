"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

const HospitalDashboard: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/hospital/doctors');
        setDoctors(response.data);
      } catch (error: any) {
        setError('Failed to fetch doctors: ' + error.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleAddDoctor = () => {
    router.push('/doctor/sign-up');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Hospital Dashboard</h1>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-600">Loading doctors...</div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Doctors List</h2>

            <div className="flex justify-end mb-4">
              <Button onClick={handleAddDoctor} className="bg-blue-600 text-white hover:bg-blue-700">Add Doctor</Button>
            </div>

            {doctors.length === 0 ? (
              <div className="text-center text-gray-600">No doctors available.</div>
            ) : (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 border-b">Name</th>
                    <th className="text-left py-2 px-4 border-b">Specialty</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td className="py-2 px-4 border-b">{doctor.name}</td>
                      <td className="py-2 px-4 border-b">{doctor.specialty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
