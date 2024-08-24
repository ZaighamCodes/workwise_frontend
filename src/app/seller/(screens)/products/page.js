"use client";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Jwt from "jsonwebtoken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/app/layout";
const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const productsPerPage = 5;
  const { logout } = useGlobal();
  // Fetch products from API
  const token = localStorage.getItem("token");
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // for deleting product
  const deleteHandler = async (id) => {
    const boolean = window.confirm("Are you sure to delete this product ?");
    if (boolean) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        fetchProducts();
      } catch (err) {
        console.log(response);
      }
    }
  };

  const editHandler = (id) => {
    router.push(`/seller/addproducts?id=${id}`); // Redirect to the AddProduct page with the product ID
  };
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Discount Price</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{product.name}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">{product.description}</td>
                <td className="px-4 py-2">{product.price}</td>
                <td className="px-4 py-2">{product.discount}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 mx-2"
                    onClick={() => editHandler(product.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 mx-2"
                    onClick={() => deleteHandler(product.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;
