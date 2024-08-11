import { useState } from "react";
import Link from "next/link";
import ProductList from "@/components/ProductList";
import ProviderList from "@/components/ProviderList";

const Home = () => {
  const [activeTab, setActiveTab] = useState<"products" | "providers">(
    "providers"
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col md:flex-row justify-center">
        <div className="flex mb-4 md:mb-0 md:w-1/2">
          <button
            className={`flex-1 p-2 text-center font-semibold ${
              activeTab === "providers"
                ? "bg-custom-gradient text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-l-md`}
            onClick={() => setActiveTab("providers")}
          >
            Providers
          </button>
          <button
            className={`flex-1 p-2 text-center font-semibold ${
              activeTab === "products"
                ? "bg-custom-gradient text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-r-md`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </div>
      </div>

      <div className="mb-4">
        {activeTab === "providers" ? (
          <>
            <ProviderList />
            <div className="text-center mt-4">
              <Link
                href="/providers"
                className="inline-block bg-custom-gradient text-white py-2 px-4 rounded-md"
              >
                View All Providers
              </Link>
            </div>
          </>
        ) : (
          <>
            <ProductList />
            <div className="text-center mt-4">
              <Link
                href="/products"
                className="inline-block bg-custom-gradient text-white py-2 px-4 rounded-md"
              >
                View All Products
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
