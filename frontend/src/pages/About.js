import { Certificate, Globe, Cube, Truck, Users, MapPin } from '@phosphor-icons/react';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';

const PROPRIETOR_IMAGE = "https://customer-assets.emergentagent.com/job_design-preview-123/artifacts/yfzi6ael_image.png";

const GRANITE_IMAGE = "https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/f11360bcab07e833ac42c1125d6072727a090078e13e0c7262e777b9a23c9a3c.png";

const stats = [
  { id: 'years', value: '8+', label: 'Years of Excellence' },
  { id: 'products', value: '500+', label: 'Products Delivered' },
  { id: 'countries', value: '42+', label: 'Countries Served' },
  { id: 'quality', value: '100%', label: 'Quality Assured' },
];

const services = [
  {
    id: 'premium',
    icon: Certificate,
    title: 'Premium Quality',
    description: 'Every piece is carefully inspected to meet the highest export standards. We source only the finest stones from select quarries.'
  },
  {
    id: 'global',
    icon: Globe,
    title: 'Global Delivery',
    description: 'Seamless end-to-end logistics solution covering the entire globe, with professional export-grade packaging and customs handling.'
  },
  {
    id: 'diverse',
    icon: Cube,
    title: 'Diverse Collection',
    description: 'From classic marble to exotic granite, paving stones to artistic handicrafts - we offer a comprehensive range of natural stones.'
  },
  {
    id: 'installation',
    icon: Truck,
    title: 'Professional Installation',
    description: 'Our dedicated team ensures perfect leveling, precision cutting, and a flawless professional finish for every project.'
  },
];

export default function About() {
  return (
    <Layout>
      <SEO 
        title="About Us"
        description="Stonic Export - 8+ years of excellence in natural stone exports. Founded by Shijo Thayyil, we deliver premium Indian marble, granite, and natural stones worldwide."
        keywords="Stonic Export, Shijo Thayyil, natural stone exporter, Indian marble supplier, granite exporter, about us"
        url="https://www.stonicexport.com/about"
      />
      {/* Hero */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-12 lg:px-24 overflow-hidden" data-testid="about-hero">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${GRANITE_IMAGE})` }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">About Us</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-[#1A1A1A] leading-tight mb-6">
              Crafting Excellence<br />Since 2016
            </h1>
            <p className="font-body text-lg text-[#4A4A4A] leading-relaxed">
              Stonic Export is India's premier source for luxury natural stones. With over 8 years of industry excellence, we've built a reputation for delivering exceptional quality marble, granite, and natural stones to clients across Europe, America, and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-[#1A1A1A]" data-testid="about-stats">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center" data-testid={`stat-${stat.id}`}>
                <p className="font-heading text-4xl sm:text-5xl text-white mb-2">{stat.value}</p>
                <p className="font-body text-sm uppercase tracking-wider text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24" data-testid="about-story">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">Our Story</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#1A1A1A] mb-6">
                From India's Finest Quarries to Your Dream Space
              </h2>
              <div className="space-y-4 font-body text-base text-[#4A4A4A] leading-relaxed">
                <p>
                  Founded by Shijo Thayyil, Stonic Marble & Granite began with a simple vision: to bring the timeless beauty of Indian natural stones to the world. What started as a passion for exceptional craftsmanship has grown into a trusted name in the global stone industry.
                </p>
                <p>
                  Today, we are proud to serve clients across continents, providing not just stones, but complete solutions - from sourcing and procurement to artistic craftsmanship and professional installation. Our commitment to quality has never wavered, and every slab that bears our name is a testament to our dedication.
                </p>
                <p>
                  Whether it's the elegant veining of our marble, the robust beauty of our granite, or the artistic precision of our handicrafts, we bring the same level of excellence to every project.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={PROPRIETOR_IMAGE}
                alt="Shijo Thayyil - Proprietor"
                className="w-full aspect-[4/5] object-cover object-top rounded-sm"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#4A5D4E] p-6 rounded-sm">
                <p className="font-heading text-3xl text-white mb-1">Shijo Thayyil</p>
                <p className="font-body text-sm text-white/70">Proprietor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[#F9F8F6]" data-testid="about-services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">What We Offer</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-[#1A1A1A]">
              Complete Stone Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="p-8 bg-white rounded-sm border border-[#E5E5E5]"
                data-testid={`service-${service.id}`}
              >
                <div className="w-14 h-14 flex items-center justify-center bg-[#4A5D4E]/10 rounded-full mb-6">
                  <service.icon size={28} className="text-[#4A5D4E]" weight="duotone" />
                </div>
                <h3 className="font-heading text-xl text-[#1A1A1A] mb-3">{service.title}</h3>
                <p className="font-body text-sm text-[#4A4A4A] leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24" data-testid="about-contact">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1A1A1A] rounded-sm p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl sm:text-4xl font-medium text-white mb-4">
                  Let's Build Something Beautiful Together
                </h2>
                <p className="font-body text-base text-white/70 mb-8">
                  Ready to transform your space with premium natural stones? Get in touch with us for personalized consultation and quotes.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Users size={24} className="text-[#4A5D4E]" weight="duotone" />
                    <div>
                      <p className="font-body text-sm text-white/60">Proprietor</p>
                      <p className="font-body text-base text-white">Shijo Thayyil</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin size={24} className="text-[#4A5D4E]" weight="duotone" />
                    <div>
                      <p className="font-body text-sm text-white/60">Location</p>
                      <p className="font-body text-base text-white">India</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-end gap-4">
                <a
                  href="tel:+919544982471"
                  className="font-heading text-2xl sm:text-3xl text-white hover:text-[#4A5D4E] transition-colors"
                  data-testid="about-phone-1"
                >
                  +91 9544982471
                </a>
                <a
                  href="tel:+917559912233"
                  className="font-heading text-2xl sm:text-3xl text-white hover:text-[#4A5D4E] transition-colors"
                  data-testid="about-phone-2"
                >
                  +91 7559912233
                </a>
                <p className="font-body text-sm text-white/60">www.stonicexport.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
