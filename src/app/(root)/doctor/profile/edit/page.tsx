"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const UpdateHospitalDetails: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<HospitalDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    registrationNumber: '',
    numberOfBeds: '',
    specializations: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the existing hospital details to populate the form
    const fetchHospitalDetails = async () => {
      try {
        const response = await axios.get('/api/hospital/details');
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching hospital details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('/api/hospital/details/update', formData);
      setSuccess('Hospital details updated successfully');
    } catch (error: any) {
      setError('Failed to update hospital details: ' + error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Update Hospital Details</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
                placeholder="Hospital Name"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
                placeholder="Phone Number"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
                placeholder="Hospital Address"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
                placeholder="Registration Number"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Number of Beds</label>
              <input
                type="text"
                name="numberOfBeds"
                value={formData.numberOfBeds}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
                placeholder="Number of Beds"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Specializations</label>
              <input
                type="text"
                name="specializations"
                value={formData.specializations}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
                placeholder="Specializations (comma separated)"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
                placeholder="Short description about the hospital"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
            >
              Update Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateHospitalDetails;
