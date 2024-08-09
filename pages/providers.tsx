import { useEffect, useState } from "react";
import axios from "axios";
import ProviderForm from "../components/ProviderForm";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Provider {
  _id?: string;
  name: string;
  address: string;
  phone: string;
  description?: string;
}

const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProviders = async (page: number) => {
    try {
      const response = await axios.get(`/api/providers?page=${page}`);
      setProviders(response.data.providers);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  useEffect(() => {
    fetchProviders(currentPage);
  }, [currentPage]);

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const handleDelete = async (providerId: string) => {
    try {
      await axios.delete(`/api/providers/${providerId}`);
      setProviders(providers.filter((provider) => provider._id !== providerId));
    } catch (error) {
      console.error("Error deleting provider:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="md:flex">
        <div className="md:w-1/3 pr-4">
          <ProviderForm
            provider={selectedProvider}
            onSuccess={() => {
              setSelectedProvider(null);
              fetchProviders(currentPage);
            }}
          />
        </div>
        <div className="md:w-2/3 overflow-y-auto mt-5 md:mt-0">
          <h1 className="text-2xl font-bold mb-4">Providers</h1>
          <ul className="space-y-2">
            {providers.map((provider) => (
              <li
                key={provider._id}
                className="p-4 bg-white shadow-md rounded-md flex items-center justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold">{provider.name}</h2>
                  <p className="text-gray-600">Address: {provider.address}</p>
                  <p className="text-gray-600">Phone: {provider.phone}</p>
                  <p className="text-gray-600">{provider.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(provider)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(provider._id as string)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Paginación */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-custom-gradient text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidersPage;
