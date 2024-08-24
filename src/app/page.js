"use client";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import md5 from "md5";
import { useGlobal } from "./layout";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const pathname = usePathname();
  const router = useRouter();
  const { authenticated } = useGlobal();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/allproducts`);
      setProducts(response.data);
      setFilteredProducts(response.data); // Initialize filtered products
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to handle search
  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  // Function to clear the search query
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredProducts(products); // Reset to all products
  };

  return (
    <main className="parent">
      <div className="container mx-auto px-4 py-8">
        {/* Search field and button */}
        <div className="flex items-center mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            onClick={handleSearch}
            className="ml-4 px-4 py-2 bg-[var(--accent)] text-white rounded-md shadow-md hover:bg-[var(--accent2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            Search
          </button>
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Clear
            </button>
          )}
        </div>
        <h1 className="w-full text-xl pt-3 pb-3 flex font-bold">
          All Products
        </h1>
        <div className="product-cards flex items-center justify-evenly flex-wrap gap-10">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <ProductCard
                key={index}
                imageSrc={`${process.env.NEXT_PUBLIC_API_URL}/${item.image}`}
                title={item.name}
                price={item.price}
                discount={item.discount}
                id={item.id}
              />
            ))
          ) : (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
