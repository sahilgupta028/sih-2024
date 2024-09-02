"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/FormError';
import axios from 'axios';

interface HospitalSigninFormData {
  email: string;
  password: string;
}

const HospitalSignin: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<HospitalSigninFormData>({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/hospital/sign-in', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Redirect to the hospital dashboard or another protected page
        router.push('/hospital/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error: any) {
      setError('Failed to sign in: ' + error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <FormError message={error} />}

      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-center">Loading...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Hospital Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
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
            <div>
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
            <Button type="submit" className="w-full py-3">Sign In</Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <a href="/hospital/sign-up" className="text-blue-600">Sign up here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default HospitalSignin;
