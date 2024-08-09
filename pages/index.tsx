import Link from "next/link";
import ProductList from "../components/ProductList";
import ProviderList from "../components/ProviderList";

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="md:flex mb-4">
        <div className="md:w-1/2 pr-4">
          <ProductList />
          <div className="text-center mt-4">
            <Link
              href="/products"
              className="inline-block bg-custom-gradient text-white py-2 px-4 rounded-md"
            >
              View All Products
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 pl-4">
          <ProviderList />
          <div className="text-center mt-4">
            <Link
              href="/providers"
              className="inline-block bg-custom-gradient text-white py-2 px-4 rounded-md"
            >
              View All Providers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
