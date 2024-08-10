import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Input } from "./ui/input";

interface Product {
  _id?: string;
  name: string;
  price: number;
  description?: string;
}

interface ProductListProps {
  editEnabled?: boolean;
  deleteEnabled?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  editEnabled = false,
  deleteEnabled = false,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async (page: number, query: string) => {
    try {
      const response = await axios.get(
        `/api/products?page=${page}&query=${query}`
      );
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleEdit = (product: Product) => {
    console.log("Edit product:", product);
  };

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Filtros */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 block"
        />
      </div>

      <ul className="space-y-2 max-h-96 overflow-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <li
              key={product._id}
              className="p-4 bg-white shadow-md rounded-md flex items-center justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">Price: ${product.price}</p>
                <p className="text-gray-600">{product.description}</p>
              </div>
              {(editEnabled || deleteEnabled) && (
                <div className="flex space-x-2">
                  {editEnabled && (
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <FaEdit />
                    </button>
                  )}
                  {deleteEnabled && (
                    <button
                      onClick={() => handleDelete(product._id as string)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              )}
            </li>
          ))
        ) : (
          <li className="p-4 bg-white shadow-md rounded-md text-center">
            No products found.
          </li>
        )}
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
  );
};

export default ProductList;
