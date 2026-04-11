import { Globe, Wrench, Truck, Certificate, Package, Headset, Leaf } from '@phosphor-icons/react';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const specializedServices = [
  {
    id: 'cemetery-works',
    icon: Certificate,
    title: 'Global Cemetery Works',
    subtitle: 'Customized Tombstones',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    description: 'We specialize in creating bespoke memorials and tombstones tailored to international designs. Serving clients primarily in Europe and America, we provide high-precision carving and respectful craftsmanship, ensuring every memorial is a lasting tribute.',
    highlights: ['International Designs', 'High-Precision Carving', 'Respectful Craftsmanship', 'Europe & America Delivery']
  },
  {
    id: 'installation',
    icon: Wrench,
    title: 'Professional Installation & Fitting',
    subtitle: 'Expert Craftsmen Team',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    description: 'We go beyond supply. Stonic Export has a dedicated team of highly skilled craftsmen available to lay and fix your Marble, Granite, and Paving stones. Our team ensures perfect leveling, precision cutting, and a flawless professional finish for every installation.',
    highlights: ['Skilled Craftsmen', 'Perfect Leveling', 'Precision Cutting', 'Flawless Finish']
  },
  {
    id: 'shipping',
    icon: Truck,
    title: 'Worldwide Shipping & Forwarding',
    subtitle: 'End-to-End Logistics',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    description: 'We offer a seamless end-to-end logistics solution. Our shipping and forwarding services cover the entire globe. From professional export-grade packaging (lashing and crating) to handling customs documentation, we ensure your order reaches your doorstep anywhere in the world safely and on time.',
    highlights: ['Global Coverage', 'Export-Grade Packaging', 'Customs Documentation', 'Safe & Timely Delivery']
  },
];

const productCategories = [
  {
    id: 'indian-marbles',
    title: 'Indian Marbles',
    image: 'https://images.unsplash.com/photo-1694378061058-bb6532de3bba?w=600',
    description: 'Premium Indian marble in various shades and finishes—polished, semi-polished, leather-finished.',
  },
  {
    id: 'imported-marbles',
    title: 'Imported Marbles',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600',
    description: 'High-quality imported marbles with unique patterns and rich textures from around the world.',
  },
  {
    id: 'granite',
    title: 'Granite',
    image: 'https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/f11360bcab07e833ac42c1125d6072727a090078e13e0c7262e777b9a23c9a3c.png',
    description: 'Durable granite for countertops, flooring, and exterior applications. Scratch and weather resistant.',
  },
  {
    id: 'paving-stones',
    title: 'Paving & Natural Stones',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    description: 'Bangalore stone, Kadappa, Kota stone, and more for driveways, walkways, and outdoor spaces.',
  },
  {
    id: 'cobbles',
    title: 'Cobblestones',
    image: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=600',
    description: 'Heavy-duty cobblestones for elegant driveways, pathways, and courtyards.',
  },
  {
    id: 'artistic-handicrafts',
    title: 'Artistic Handicrafts',
    image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600',
    description: 'Handcrafted fountains, sculptures, basins, and balusters with exquisite craftsmanship.',
  },
  {
    id: 'cemetery-works',
    title: 'Cemetery Works',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    description: 'Bespoke memorials and tombstones with high-precision carving for international clients.',
  },
];

const whyChooseUs = [
  { id: 'excellence', icon: Certificate, title: '8+ Years Excellence', description: 'Industry expertise and quality commitment' },
  { id: 'global', icon: Globe, title: 'Global Delivery', description: 'Shipping to Europe, America and beyond' },
  { id: 'quality', icon: Package, title: 'Premium Quality', description: 'Every piece meets export standards' },
  { id: 'eco', icon: Leaf, title: 'Eco-Friendly Sourcing', description: 'Sustainable, responsibly sourced materials' },
];

export default function Services() {
  return (
    <Layout>
      <SEO 
        title="Our Services"
        description="Stonic Export offers complete stone solutions - Cemetery Works, Professional Installation, Worldwide Shipping. From custom tombstones to global delivery of premium natural stones."
        keywords="stone installation, cemetery works, tombstones, worldwide shipping, natural stone services, marble installation, granite fitting"
        url="https://www.stonicexport.com/services"
      />
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[#1A1A1A]" data-testid="services-hero">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">What We Offer</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
            Our Services
          </h1>
          <p className="font-body text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            Complete stone solutions from premium sourcing to professional installation and worldwide delivery.
          </p>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24" data-testid="specialized-services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">Specialized Services</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#1A1A1A]">
              Beyond Just Supply
            </h2>
          </div>

          <div className="space-y-20">
            {specializedServices.map((service, index) => (
              <div 
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
                data-testid={`service-${service.id}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-lg">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 flex items-center justify-center bg-[#4A5D4E]/10 rounded-full">
                      <service.icon size={28} className="text-[#4A5D4E]" weight="duotone" />
                    </div>
                    <div>
                      <p className="font-body text-xs uppercase tracking-wider text-[#4A5D4E]">{service.subtitle}</p>
                      <h3 className="font-heading text-2xl sm:text-3xl text-[#1A1A1A]">{service.title}</h3>
                    </div>
                  </div>
                  <p className="font-body text-base text-[#4A4A4A] leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {service.highlights.map((highlight) => (
                      <div key={`${service.id}-${highlight}`} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#4A5D4E]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-body text-sm text-[#4A4A4A]">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[#F9F8F6]" data-testid="product-categories">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">Our Products</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#1A1A1A]">
              Premium Stone Collection
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group bg-white rounded-sm overflow-hidden border border-[#E5E5E5] hover:border-[#4A5D4E]/30 transition-all hover:shadow-lg"
                data-testid={`category-${category.id}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl text-[#1A1A1A] mb-2">{category.title}</h3>
                  <p className="font-body text-sm text-[#4A4A4A] line-clamp-2">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24" data-testid="why-choose-us">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">Why Stonic Export</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#1A1A1A]">
              Your Trusted Stone Partner
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item) => (
              <div key={item.id} className="text-center p-6" data-testid={`why-${item.id}`}>
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#4A5D4E]/10 rounded-full">
                  <item.icon size={32} className="text-[#4A5D4E]" weight="duotone" />
                </div>
                <h3 className="font-heading text-xl text-[#1A1A1A] mb-2">{item.title}</h3>
                <p className="font-body text-sm text-[#4A4A4A]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[#1A1A1A]" data-testid="services-cta">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-light text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="font-body text-base text-white/70 mb-10 max-w-2xl mx-auto">
            Whether it's residential, commercial, or large-scale projects, we combine precision, reliability, and craftsmanship to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919544982471?text=Hello%20Stonic%20Export!%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-body text-sm uppercase tracking-wider hover:bg-[#20bd5a] transition-colors"
              data-testid="cta-whatsapp"
            >
              Get a Quote on WhatsApp
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white text-white font-body text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
              data-testid="cta-contact"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
