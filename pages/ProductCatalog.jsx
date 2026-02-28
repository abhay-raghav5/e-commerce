import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import FilterBar from '@/components/FilterBar.jsx';
import SearchBar from '@/components/SearchBar.jsx';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    priceRange: [0, 500],
    minRating: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [filters, searchTerm, sortBy, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let filterQuery = [];
      
      if (filters.category !== 'All') {
        filterQuery.push(`category = "${filters.category}"`);
      }
      
      filterQuery.push(`price >= ${filters.priceRange[0]} && price <= ${filters.priceRange[1]}`);
      
      if (filters.minRating > 0) {
        filterQuery.push(`rating >= ${filters.minRating}`);
      }
      
      if (searchTerm) {
        filterQuery.push(`(name ~ "${searchTerm}" || description ~ "${searchTerm}")`);
      }

      let sortQuery = '-created';
      if (sortBy === 'price-low') sortQuery = 'price';
      if (sortBy === 'price-high') sortQuery = '-price';
      if (sortBy === 'popularity') sortQuery = '-reviews_count';

      const result = await pb.collection('products').getList(currentPage, perPage, {
        filter: filterQuery.join(' && '),
        sort: sortQuery,
        $autoCancel: false
      });

      setProducts(result.items);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Shop - FashionHub</title>
        <meta name="description" content="Browse our premium fashion collections. Find the perfect style for every occasion." />
      </Helmet>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shop All Products</h1>

          <div className="mb-8">
            <SearchBar onSearch={setSearchTerm} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterBar filters={filters} onFilterChange={setFilters} />
            </div>

            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {products.length} products found
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-600">No products found</p>
                  <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-12">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-900"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-900"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductCatalog;
