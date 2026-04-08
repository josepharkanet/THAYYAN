import { useState } from 'react';
import { Phone, Envelope, MapPin, WhatsappLogo, Clock } from '@phosphor-icons/react';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { contactApi, formatApiError } from '../lib/api';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactApi.submit(formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEO 
        title="Contact Us"
        description="Contact Stonic Export for premium natural stones. Phone: +91 9544982471. Get quotes for marble, granite, paving stones, and custom cemetery works."
        keywords="contact Stonic Export, stone supplier contact, marble quote, granite inquiry, natural stone order"
        url="https://www.stonicexport.com/contact"
      />
      {/* Header */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-24 bg-[#F9F8F6]" data-testid="contact-header">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-[#4A5D4E] mb-4">Get in Touch</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium text-[#1A1A1A] mb-4">
            Contact Us
          </h1>
          <p className="font-body text-base text-[#4A4A4A] max-w-2xl">
            Have questions about our products or services? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-24" data-testid="contact-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl text-[#1A1A1A] mb-8">
                Let's Start a Conversation
              </h2>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#4A5D4E]/10 rounded-full flex-shrink-0">
                    <Phone size={24} className="text-[#4A5D4E]" weight="duotone" />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-wider text-[#4A4A4A] mb-1">Phone</p>
                    <a href="tel:+919544982471" className="block font-body text-base text-[#1A1A1A] hover:text-[#4A5D4E] transition-colors">
                      +91 9544982471
                    </a>
                    <a href="tel:+917559912233" className="block font-body text-base text-[#1A1A1A] hover:text-[#4A5D4E] transition-colors">
                      +91 7559912233
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#4A5D4E]/10 rounded-full flex-shrink-0">
                    <Envelope size={24} className="text-[#4A5D4E]" weight="duotone" />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-wider text-[#4A4A4A] mb-1">Email</p>
                    <a href="mailto:info@stonicexport.com" className="font-body text-base text-[#1A1A1A] hover:text-[#4A5D4E] transition-colors">
                      info@stonicexport.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#4A5D4E]/10 rounded-full flex-shrink-0">
                    <MapPin size={24} className="text-[#4A5D4E]" weight="duotone" />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-wider text-[#4A4A4A] mb-1">Location</p>
                    <p className="font-body text-base text-[#1A1A1A]">India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#4A5D4E]/10 rounded-full flex-shrink-0">
                    <Clock size={24} className="text-[#4A5D4E]" weight="duotone" />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-wider text-[#4A4A4A] mb-1">Business Hours</p>
                    <p className="font-body text-base text-[#1A1A1A]">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="p-6 bg-[#25D366]/10 rounded-sm border border-[#25D366]/20">
                <div className="flex items-center gap-4 mb-4">
                  <WhatsappLogo size={32} className="text-[#25D366]" weight="fill" />
                  <h3 className="font-heading text-xl text-[#1A1A1A]">Quick Response via WhatsApp</h3>
                </div>
                <p className="font-body text-sm text-[#4A4A4A] mb-4">
                  For faster responses, reach out to us directly on WhatsApp. We typically respond within minutes during business hours.
                </p>
                <a
                  href="https://wa.me/919544982471?text=Hello%20Stonic%20Export!%20I%20have%20a%20query."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-body text-sm uppercase tracking-wider hover:bg-[#20bd5a] transition-colors"
                  data-testid="contact-whatsapp-btn"
                >
                  <WhatsappLogo size={20} weight="fill" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#E5E5E5]">
              <h2 className="font-heading text-2xl text-[#1A1A1A] mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full"
                    data-testid="contact-name-input"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full"
                    data-testid="contact-email-input"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full"
                    data-testid="contact-phone-input"
                  />
                </div>

                <div>
                  <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your project or inquiry..."
                    rows={5}
                    className="w-full resize-none"
                    data-testid="contact-message-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1A1A1A] text-white font-body text-sm uppercase tracking-wider hover:bg-[#2D2D2D] transition-colors disabled:opacity-50"
                  data-testid="contact-submit-btn"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
