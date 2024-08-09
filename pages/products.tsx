import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../components/ProductForm";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

interface Product {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  provider?: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const fetchProducts = async (page: number) => {
    try {
      const response = await axios.get(`/api/products?page=${page}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`/api/products/${productToDelete}`);
        setProducts(
          products.filter((product) => product._id !== productToDelete)
        );
      } catch (error) {
        console.error("Error deleting product:", error);
      }
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="md:flex">
        <div className="md:w-1/3 pr-4">
          <ProductForm
            product={selectedProduct}
            onSuccess={() => {
              setSelectedProduct(null);
              fetchProducts(currentPage);
            }}
          />
        </div>
        <div className="md:w-2/3 overflow-y-auto mt-5 md:mt-0">
          <h1 className="text-2xl font-bold mb-4">Products</h1>
          <ul className="space-y-2">
            {products.map((product) => (
              <li
                key={product._id}
                className="p-4 bg-white shadow-md rounded-md flex items-center justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-600">Price: ${product.price}</p>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product._id as string)}
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

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDelete}
        onCancel={handleCancel}
        itemName={
          products.find((product) => product._id === productToDelete)?.name ||
          ""
        }
      />
    </div>
  );
};

export default ProductsPage;
