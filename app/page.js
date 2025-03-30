"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Flowers() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/flowers", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: false,
        });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .sort((a, b) => {
      if (selectedFilter === "all") {
        if (a.isNewArrival && !b.isNewArrival) return -1;
        if (!a.isNewArrival && b.isNewArrival) return 1;
      }
      return 0;
    })
    .filter((product) => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "new") return product.isNewArrival;
      if (selectedFilter === "bestseller") return product.isBestSeller;
      if (selectedFilter === "comingsoon") return product.isComingSoon;
      return true;
    });

  function determineStrain(sativa, indica) {
    if ((sativa === 60 || sativa === 40) && (indica === 40 || indica === 60)) {
      return "Hybrid";
    } else if (sativa > 60 && indica < 40) {
      return "Sativa";
    } else if (indica > 60 && sativa < 40) {
      return "Indica";
    } else {
      return "Hybrid";
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        {/* Header */}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-1">
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === "comingsoon"
                  ? "bg-white text-gray-900"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setSelectedFilter("comingsoon")}
            >
              Coming Soon
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === "bestseller"
                  ? "bg-white text-gray-900"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setSelectedFilter("bestseller")}
            >
              Best Sellers
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === "new"
                  ? "bg-white text-gray-900"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setSelectedFilter("new")}
            >
              New Arrivals
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === "all"
                  ? "bg-white text-gray-900"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setSelectedFilter("all")}
            >
              All Strains
            </button>
          </div>

          {/* Loading and Error States */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                Try Again
              </button>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid mt-5 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 shadow-sm hover:shadow-md transition-all group relative flex flex-col"
                >
                  <div className="relative h-36 sm:h-48">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 
                      ${product.isComingSoon ? "blur-sm brightness-50" : ""}`}
                    />

                    {/* Coming Soon Overlay */}
                    {product.isComingSoon && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 transform -rotate-12">
                          <span className="text-white font-bold text-lg sm:text-xl">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      {!product.isComingSoon && product.isNewArrival && (
                        <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          New
                        </span>
                      )}
                      {!product.isComingSoon && product.isBestSeller && (
                        <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          Best Seller
                        </span>
                      )}
                    </div>
                    {!product.isComingSoon && product.stock <= 14 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                        Low Stock
                      </span>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 flex-1">
                    {/* Product Name and Price */}
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg text-gray-100 font-bold group-hover:text-gray-300 transition-colors">
                          {product.name}
                        </h2>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            determineStrain(product.sativa, product.indica) ===
                            "Sativa"
                              ? "bg-amber-500/20 text-amber-300"
                              : determineStrain(
                                  product.sativa,
                                  product.indica
                                ) === "Indica"
                              ? "bg-purple-500/20 text-purple-300"
                              : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {determineStrain(product.sativa, product.indica)}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5">
                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-transparent bg-clip-text">
                          ฿{product.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">/gram</span>
                      </div>
                    </div>

                    {/* THC Badge */}
                    <div className="space-y-3 mb-4">
                      <div className="inline-flex items-center bg-indigo-950/50 px-2 py-1 rounded-full">
                        <span className="text-xs sm:text-sm font-bold text-indigo-400">
                          THC: {product.thc}%
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="font-medium text-gray-300">
                            Sativa
                          </span>
                          <span className="text-gray-400">
                            {product.sativa}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500/80 rounded-full"
                            style={{ width: `${product.sativa}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="font-medium text-gray-300">
                            Indica
                          </span>
                          <span className="text-gray-400">
                            {product.indica}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500/80 rounded-full"
                            style={{ width: `${product.indica}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Effects and Flavors */}
                    <div className="space-y-4 mb-4">
                      {/* Effects */}
                      {product.effects && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs uppercase tracking-wider">
                              Effects
                            </span>
                            <div className="h-px flex-1 bg-gray-700"></div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {product.effects.map((effect, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-900/30 border border-purple-700/30 rounded-full text-xs font-medium text-purple-300"
                              >
                                {effect}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Flavors */}
                      {product.flavors && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs uppercase tracking-wider">
                              Flavors
                            </span>
                            <div className="h-px flex-1 bg-gray-700"></div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {product.flavors.map((flavor, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-emerald-900/30 border border-emerald-700/30 rounded-full text-xs font-medium text-emerald-300"
                              >
                                {flavor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
                      {product.description}
                    </p>
                  </div>

                  {!product.isComingSoon ? (
                    <a
                      href="https://t.me/+XVdOvrRz3e8zNjM9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 text-center transition-colors duration-200 text-sm tracking-wide flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                      </svg>
                      Order on Telegram
                    </a>
                  ) : (
                    <div className="w-full bg-gray-700 text-gray-400 font-medium py-2.5 text-center text-sm tracking-wide">
                      Coming Soon
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </main>
      <Footer />
    </>
  );
}
