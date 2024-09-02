"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import axios from 'axios';

interface HospitalSignupFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  numberOfBeds: string;
  specializations: string;
  facilities: string;
  bio: string;
  password: string;
}

const HospitalSignup: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<HospitalSignupFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    registrationNumber: '',
    numberOfBeds: '',
    specializations: '',
    facilities: '',
    bio: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

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
      const updatedFormData = {
        ...formData,
      };

      const response = await fetch('/api/hospital/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFormData)
      });

      console.log(updatedFormData);

      if (response.ok) {
        setSuccess('Hospital signed up successfully');
      } else {
        setError('Failed to sign up');
      }
    } catch (error: any) {
      setError('Failed to sign up: ' + error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-center">Loading...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-blue-100 flex">
        <div className="hidden md:block md:w-1/2 bg-cover rounded-l-2xl" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}></div>
        <div className="flex flex-col justify-center md:w-1/2 p-8 bg-white">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Hospital Signup</h2>
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
              {/* <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Facilities</label>
                <textarea
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
                  placeholder="Facilities (comma separated)"
                  rows={3}
                />
              </div> */}
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4">
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
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
                >
                  Sign Up
                </Button>
              </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default HospitalSignup;
