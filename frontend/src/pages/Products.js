import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MagnifyingGlass, Funnel, WhatsappLogo, X } from '@phosphor-icons/react';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { productsApi, categoriesApi, generateWhatsAppLink } from '../lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  const fetchData = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    if (value === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', value);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : catId.replace('-', ' ');
  };

  const currentCategoryName = selectedCategory !== 'all' ? getCategoryName(selectedCategory) : 'All Products';

  return (
    <Layout>
      <SEO 
        title={currentCategoryName}
        description={`Browse our collection of premium ${currentCategoryName.toLowerCase()}. High-quality natural stones from India, perfect for flooring, countertops, and construction projects.`}
        keywords={`${currentCategoryName}, natural stones, Indian marble, granite, paving stones, stone supplier, Stonic Export`}
        url={`https://www.stonicexport.com/products${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
      />
      {/* Header */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-24 bg-[#F9F8F6]" data-testid="products-header">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">Collection</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium text-[#1A1A1A] mb-4">
            Our Products
          </h1>
          <p className="font-body text-base text-[#4A4A4A] max-w-2xl">
            Explore our curated collection of premium Indian natural stones. Each piece is carefully selected for quality and beauty.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-6 sm:px-12 lg:px-24 border-b border-[#E5E5E5]" data-testid="products-filters">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Funnel size={20} className="text-[#4A4A4A]" />
              <span className="font-body text-sm text-[#4A4A4A]">Filter:</span>
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[200px]" data-testid="category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => handleCategoryChange('all')}
                className="flex items-center gap-1 px-3 py-1 bg-[#4A5D4E]/10 rounded-full text-sm font-body"
                data-testid="clear-filter-btn"
              >
                {getCategoryName(selectedCategory)}
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className="relative w-full sm:w-auto">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]" />
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full sm:w-64"
              data-testid="search-input"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-16 px-6 sm:px-12 lg:px-24" data-testid="products-grid">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-sm mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20" data-testid="no-products">
              <p className="font-body text-lg text-[#4A4A4A]">No products found.</p>
              <button
                onClick={() => { setSearch(''); handleCategoryChange('all'); }}
                className="mt-4 font-body text-sm text-[#4A5D4E] underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group" data-testid={`product-card-${product.id}`}>
                  <Link to={`/products/${product.id}`} className="block">
                    <div className="product-card bg-white rounded-sm overflow-hidden border border-[#E5E5E5]">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="product-card-image w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 sm:p-5">
                        <p className="font-body text-xs uppercase tracking-wider text-[#4A5D4E] mb-1">
                          {getCategoryName(product.category)}
                        </p>
                        <h3 className="font-heading text-lg text-[#1A1A1A] mb-1">{product.name}</h3>
                        <p className="font-body text-sm text-[#4A4A4A] line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                  </Link>
                  <a
                    href={generateWhatsAppLink(product.name, getCategoryName(product.category))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-sm font-body text-sm hover:bg-[#20bd5a] transition-colors"
                    data-testid={`whatsapp-btn-${product.id}`}
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    Inquire on WhatsApp
                  </a>
                </div>
              ))}
            </div>
          )}

          <p className="text-center mt-12 font-body text-sm text-[#4A4A4A]">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </section>
    </Layout>
  );
}
