import React, { useState, useEffect } from "react";
import axios from "axios";

interface Provider {
  _id: string;
  name: string;
}

interface Product {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  provider?: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const [formData, setFormData] = useState<Product>({
    name: "",
    price: 0,
    description: "",
    provider: "",
    ...product,
  });

  const [providers, setProviders] = useState<Provider[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    } else {
      setFormData({
        name: "",
        price: 0,
        description: "",
        provider: "",
      });
    }
  }, [product]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get<{ providers: Provider[] }>(
          "/api/providers"
        );
        setProviders(response.data.providers);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setProviders([]);
      }
    };
    fetchProviders();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.name) newErrors.push("Name is required.");
    if (formData.price <= 0) newErrors.push("Price must be greater than 0.");
    if (!formData.provider) newErrors.push("Provider is required.");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (product?._id) {
        await axios.put(`/api/products/${product._id}`, formData);
      } else {
        await axios.post("/api/products", formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white shadow-md rounded-md"
    >
      {errors.length > 0 && (
        <div className="text-red-500">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
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
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          type="number"
          name="price"
          id="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label
          htmlFor="provider"
          className="block text-sm font-medium text-gray-700"
        >
          Provider
        </label>
        <select
          name="provider"
          id="provider"
          value={formData.provider || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        >
          <option value="">Select a provider</option>
          {providers.map((provider) => (
            <option key={provider._id} value={provider._id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-custom-gradient text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        {product?._id ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
