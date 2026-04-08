import { Link } from 'react-router-dom';
import { Phone, Envelope, MapPin, WhatsappLogo, InstagramLogo, FacebookLogo } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-3xl font-medium mb-4">STONIC</h3>
            <p className="font-body text-sm text-gray-400 leading-relaxed mb-6">
              Premium Indian Natural Stones. 8+ years of industry excellence delivering quality marble, granite, and natural stones worldwide.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/919544982471" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#25D366] transition-colors" data-testid="footer-whatsapp">
                <WhatsappLogo size={24} weight="fill" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-instagram">
                <InstagramLogo size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-facebook">
                <FacebookLogo size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="font-body text-sm text-gray-400 hover:text-white transition-colors">Our Products</Link></li>
              <li><Link to="/services" className="font-body text-sm text-gray-400 hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/about" className="font-body text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="font-body text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-xl mb-6">Categories</h4>
            <ul className="space-y-3">
              <li><Link to="/products?category=indian-marbles" className="font-body text-sm text-gray-400 hover:text-white transition-colors">Indian Marbles</Link></li>
              <li><Link to="/products?category=imported-marbles" className="font-body text-sm text-gray-400 hover:text-white transition-colors">Imported Marbles</Link></li>
              <li><Link to="/products?category=granite" className="font-body text-sm text-gray-400 hover:text-white transition-colors">Granite</Link></li>
              <li><Link to="/products?category=paving-stones" className="font-body text-sm text-gray-400 hover:text-white transition-colors">Paving Stones</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xl mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-[#4A5D4E] mt-0.5" />
                <div>
                  <p className="font-body text-sm text-gray-400">+91 9544982471</p>
                  <p className="font-body text-sm text-gray-400">+91 7559912233</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Envelope size={20} className="text-[#4A5D4E] mt-0.5" />
                <p className="font-body text-sm text-gray-400">info@stonicexport.com</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#4A5D4E] mt-0.5" />
                <p className="font-body text-sm text-gray-400">India</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-gray-500">
            © {new Date().getFullYear()} Stonic Export. All rights reserved.
          </p>
          <p className="font-body text-xs text-gray-500">
            Proprietor: Shijo Thayyil
          </p>
        </div>
      </div>
    </footer>
  );
}
