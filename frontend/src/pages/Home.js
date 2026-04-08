import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, WhatsappLogo, Cube, Globe, Certificate, Truck } from '@phosphor-icons/react';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { productsApi, categoriesApi } from '../lib/api';

const HERO_IMAGE = "https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/3eda6b8e24809bd6028cb07fecfdd62dc519881e7e26072e0318301ceb793ef5.png";

const categoryImages = {
  'indian-marbles': 'https://images.unsplash.com/photo-1694378061058-bb6532de3bba?w=600',
  'imported-marbles': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600',
  'granite': 'https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/f11360bcab07e833ac42c1125d6072727a090078e13e0c7262e777b9a23c9a3c.png',
  'paving-stones': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'cobbles': 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=600',
  'artistic-handicrafts': 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600',
  'cemetery-works': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
};

const features = [
  { icon: Certificate, title: '8+ Years Excellence', description: 'Industry expertise and quality commitment' },
  { icon: Globe, title: 'Global Delivery', description: 'Shipping to Europe, America and beyond' },
  { icon: Cube, title: 'Premium Quality', description: 'Every piece meets export standards' },
  { icon: Truck, title: 'Full Service', description: 'From quarry to installation' },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, products] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll(null, true)
        ]);
        setCategories(cats);
        setFeaturedProducts(products.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <SEO 
        title="Premium Indian Natural Stones"
        description="Stonic Export - India's premier source for luxury natural stones. Premium Marble, Granite, Paving Stones, and Cobbles. 8+ years of excellence delivering worldwide."
        keywords="Indian marble, granite export, natural stones India, paving stones, cobblestones, stone supplier, marble exporter, Stonic Export"
      />
      {/* Hero Section */}
      <section className="hero-section" data-testid="hero-section">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="hero-overlay" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-32">
          <div className="max-w-2xl">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-white/80 mb-6 animate-fade-in">
              Premium Indian Natural Stones
            </p>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-none mb-6 animate-fade-in animate-delay-100">
              Crafting<br />Timeless<br />Elegance
            </h1>
            <p className="font-body text-base sm:text-lg text-white/80 leading-relaxed mb-10 max-w-lg animate-fade-in animate-delay-200">
              From India's finest quarries to your dream space. Marble, Granite, and Natural Stones delivered globally with unmatched quality.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-300">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A1A1A] font-body text-sm uppercase tracking-wider hover:bg-[#F9F8F6] transition-colors"
                data-testid="hero-explore-btn"
              >
                Explore Collection
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white text-white font-body text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                data-testid="hero-services-btn"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24" data-testid="categories-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">Our Collection</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#1A1A1A]">
              Premium Stone Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="category-card group aspect-[4/5] rounded-sm overflow-hidden"
                data-testid={`category-card-${category.id}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={categoryImages[category.id] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="category-card-content absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h3 className="font-heading text-2xl sm:text-3xl text-white mb-2">{category.name}</h3>
                  <p className="font-body text-sm text-white/70">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[#F9F8F6]" data-testid="featured-section">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-2">Featured</p>
                <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#1A1A1A]">
                  Exceptional Selections
                </h2>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-wider text-[#1A1A1A] hover:text-[#4A5D4E] transition-colors"
                data-testid="view-all-products-btn"
              >
                View All <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="product-card bg-white rounded-sm overflow-hidden border border-[#E5E5E5]"
                  data-testid={`featured-product-${product.id}`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="product-card-image w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-body text-xs uppercase tracking-wider text-[#4A5D4E] mb-2">
                      {product.category.replace('-', ' ')}
                    </p>
                    <h3 className="font-heading text-xl text-[#1A1A1A] mb-2">{product.name}</h3>
                    <p className="font-body text-sm text-[#4A4A4A] line-clamp-2">{product.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">Why Choose Us</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#1A1A1A]">
              Excellence in Every Slab
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6" data-testid={`feature-${index}`}>
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#4A5D4E]/10 rounded-full">
                  <feature.icon size={32} className="text-[#4A5D4E]" weight="duotone" />
                </div>
                <h3 className="font-heading text-xl text-[#1A1A1A] mb-2">{feature.title}</h3>
                <p className="font-body text-sm text-[#4A4A4A]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[#1A1A1A]" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="font-body text-base text-white/70 mb-10 max-w-2xl mx-auto">
            Connect with us directly on WhatsApp for personalized assistance, pricing, and samples.
          </p>
          <a
            href="https://wa.me/919544982471?text=Hello%20Stonic%20Export!%20I%20am%20interested%20in%20your%20premium%20natural%20stones."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#25D366] text-white font-body text-sm uppercase tracking-wider hover:bg-[#20bd5a] transition-colors whatsapp-pulse"
            data-testid="cta-whatsapp-btn"
          >
            <WhatsappLogo size={24} weight="fill" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </Layout>
  );
}
