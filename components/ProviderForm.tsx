import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Provider {
  _id?: string;
  name: string;
  address?: string;
  phone?: string;
  description?: string;
}

interface ProviderFormProps {
  provider?: Provider | null;
  onSuccess: () => void;
}

const ProviderForm: React.FC<ProviderFormProps> = ({ provider, onSuccess }) => {
  const [formData, setFormData] = useState<Provider>({
    name: '',
    address: '',
    phone: '',
    description: '',
    ...provider,
  });

  useEffect(() => {
    if (provider) {
      setFormData({ ...provider });
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        description: '',
      });
    }
  }, [provider]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (provider?._id) {
        await axios.put(`/api/providers/${provider._id}`, formData);
      } else {
        await axios.post('/api/providers', formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          id="address"
          value={formData.address || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-custom-gradient text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        {provider?._id ? 'Update Provider' : 'Add Provider'}
      </button>
    </form>
  );
};

export default ProviderForm;
