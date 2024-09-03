"use client";

import React, { useState } from 'react';
import Symptoms from '@/components/Symptoms';
import { Button } from '@/components/ui/button';
import { CirclePowerIcon } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const router = useRouter();

  const departments: string[] = ["Cardiology", "Neurology"]; // Example departments

  const handleSymptomSelection = (symptom: string, selected: boolean) => {
    const newSelectedSymptoms = selected
      ? [...selectedSymptoms, symptom.toLowerCase()]
      : selectedSymptoms.filter(s => s.toLowerCase() !== symptom.toLowerCase());

    setSelectedSymptoms(newSelectedSymptoms);
  };

  const findDepartment = async () => {
    if(selectedSymptoms.length < 10){
      alert("Mark at least 10 symptoms");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/get-ml-prediction', {
        symptoms: selectedSymptoms 
      });

      if (response.status) {
        setSelectedDisease(response.data.prediction || []);
        setShowResults(true);
      } else {
        console.error('Failed to fetch department data');
      }
    } catch (error) {
      console.error('An error occurred while fetching department data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/get/doctor'); // Adjust the endpoint to match your API route
      if (response.status === 200) {
        setDoctors(response.data.data || []);
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('An error occurred while fetching doctors:', error);
    }
  };

  const handleSubmit = () => {
    findDepartment();
  };

  const handleDismiss = () => {
    setShowResults(false);
    setSelectedDisease([]);
    fetchDoctors();
  };

  return (
    <div>
      {showResults && (
        <div className="bg-gray-100 p-6 rounded-xl fixed top-1/2 md:top-1/3 md:left-1/3 w-full md:w-1/3 h-auto flex flex-col items-center justify-center z-50 shadow-xl border-2 border-black">
          <h2 className="text-lg font-semibold mb-4">Result:</h2>
          <div className="text-md">
            {selectedDisease.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Prediction:</h3>
                <p>{selectedDisease}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl focus:outline-none focus:ring focus:ring-red-400"
          >
            OK
          </button>

          {doctors.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Available Doctors:</h2>
          <ul>
            {doctors.map((doctor, index) => (
              <li key={index} className="mb-2">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p><strong>Name:</strong> {doctor.name}</p>
                  <p><strong>Department:</strong> {doctor.department}</p>
                  <p><strong>Specialty:</strong> {doctor.specialty}</p>
                  <p><strong>Location:</strong> {doctor.location}</p>
                  <p><strong>Rating:</strong> {doctor.rating}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
        </div>
      )}

      <div className="flex flex-col justify-center items-center">
        <div className="w-full bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <div className="text-4xl font-bold text-blue-500 mb-2">Symptom Checker</div>
            <p className="text-gray-600 text-lg">Select your symptoms:</p>
            <p className="text-red-500 text-base">Please select at least 10 symptoms to predict the disease</p>
          </div>

          <div>
            <h1 className="text-black text-base">Total symptoms Selected : {selectedSymptoms.length}</h1>
          </div>
          
          <Button
            onClick={handleSubmit}
            className="m-4 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-3xl border-2 w-48"
            disabled={isLoading}
          >
            {isLoading ? (
              <div>
                Loading..
                <CirclePowerIcon size={16} className="animate-spin ml-2" />
              </div>
            ) : 'Submit'}
          </Button>

          <Symptoms handleSymptomSelection={handleSymptomSelection} />
        </div>
      </div>
    </div>
  );
};

export default Home;
