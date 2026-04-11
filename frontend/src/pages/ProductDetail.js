import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, WhatsappLogo, MapPin, Ruler, Palette, Buildings } from '@phosphor-icons/react';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { productsApi, categoriesApi, generateWhatsAppLink } from '../lib/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [prod, cats] = await Promise.all([
        productsApi.getById(id),
        categoriesApi.getAll()
      ]);
      setProduct(prod);
      setCategories(cats);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : catId?.replace('-', ' ') || '';
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-24 px-6 sm:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-sm" />
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-6" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="py-24 px-6 sm:px-12 lg:px-24 text-center" data-testid="product-not-found">
          <h1 className="font-heading text-3xl text-[#1A1A1A] mb-4">Product Not Found</h1>
          <Link to="/products" className="font-body text-[#4A5D4E] underline">
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  const allImages = [product.image_url, ...(product.gallery_images || [])];

  // Generate SEO keywords
  const seoKeywords = [
    product.name,
    getCategoryName(product.category),
    product.origin,
    product.finish,
    'natural stone',
    'Indian stone',
    'export quality',
    ...(product.applications || [])
  ].filter(Boolean).join(', ');

  return (
    <Layout>
      <SEO 
        title={product.name}
        description={`${product.name} - ${product.description}. Origin: ${product.origin || 'India'}. Finish: ${product.finish || 'Polished'}. Premium quality ${getCategoryName(product.category)} from Stonic Export.`}
        keywords={seoKeywords}
        image={product.image_url}
        url={`https://www.stonicexport.com/products/${product.id}`}
        type="product"
        product={product}
      />
      <section className="py-12 sm:py-16 px-6 sm:px-12 lg:px-24" data-testid="product-detail">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-body text-sm text-[#4A4A4A] hover:text-[#1A1A1A] mb-8 transition-colors"
            data-testid="back-to-products"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div>
              <div className="aspect-square overflow-hidden rounded-sm border border-[#E5E5E5] mb-4">
                <img
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="product-main-image"
                />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3">
                  {allImages.map((img, idx) => (
                    <button
                      key={`gallery-${idx}-${img.substring(img.lastIndexOf('/') + 1, img.lastIndexOf('/') + 10)}`}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-[#4A5D4E]' : 'border-[#E5E5E5]'
                      }`}
                      data-testid={`thumbnail-${idx}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-3">
                {getCategoryName(product.category)}
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl font-medium text-[#1A1A1A] mb-4" data-testid="product-name">
                {product.name}
              </h1>
              <p className="font-body text-base text-[#4A4A4A] leading-relaxed mb-8" data-testid="product-description">
                {product.description}
              </p>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.origin && (
                  <div className="flex items-start gap-3 p-4 bg-[#F9F8F6] rounded-sm" data-testid="spec-origin">
                    <MapPin size={20} className="text-[#4A5D4E] mt-0.5" weight="duotone" />
                    <div>
                      <p className="font-body text-xs uppercase tracking-wider text-[#4A4A4A]">Origin</p>
                      <p className="font-body text-sm text-[#1A1A1A]">{product.origin}</p>
                    </div>
                  </div>
                )}
                {product.finish && (
                  <div className="flex items-start gap-3 p-4 bg-[#F9F8F6] rounded-sm" data-testid="spec-finish">
                    <Palette size={20} className="text-[#4A5D4E] mt-0.5" weight="duotone" />
                    <div>
                      <p className="font-body text-xs uppercase tracking-wider text-[#4A4A4A]">Finish</p>
                      <p className="font-body text-sm text-[#1A1A1A]">{product.finish}</p>
                    </div>
                  </div>
                )}
                {product.thickness && (
                  <div className="flex items-start gap-3 p-4 bg-[#F9F8F6] rounded-sm" data-testid="spec-thickness">
                    <Ruler size={20} className="text-[#4A5D4E] mt-0.5" weight="duotone" />
                    <div>
                      <p className="font-body text-xs uppercase tracking-wider text-[#4A4A4A]">Thickness</p>
                      <p className="font-body text-sm text-[#1A1A1A]">{product.thickness}</p>
                    </div>
                  </div>
                )}
                {product.applications?.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-[#F9F8F6] rounded-sm col-span-2" data-testid="spec-applications">
                    <Buildings size={20} className="text-[#4A5D4E] mt-0.5" weight="duotone" />
                    <div>
                      <p className="font-body text-xs uppercase tracking-wider text-[#4A4A4A]">Applications</p>
                      <p className="font-body text-sm text-[#1A1A1A]">{product.applications.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <a
                  href={generateWhatsAppLink(product.name, getCategoryName(product.category))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-body text-sm uppercase tracking-wider hover:bg-[#20bd5a] transition-colors whatsapp-pulse"
                  data-testid="product-whatsapp-btn"
                >
                  <WhatsappLogo size={22} weight="fill" />
                  Inquire on WhatsApp
                </a>
                <p className="text-center font-body text-xs text-[#4A4A4A]">
                  Get instant pricing, samples, and availability
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
