import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Image, Info, Check } from '@phosphor-icons/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    hero_image: '',
    about_image: '',
    logo_image: ''
  });
  const [requirements, setRequirements] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings({
        hero_image: response.data.hero_image || '',
        about_image: response.data.about_image || '',
        logo_image: response.data.logo_image || ''
      });
      setRequirements(response.data.image_requirements || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/settings`, settings, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const ImageField = ({ label, field, requirement }) => (
    <div className="bg-white rounded-sm border border-[#E5E5E5] p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading text-lg text-[#1A1A1A]">{label}</h3>
          {requirement && (
            <p className="font-body text-sm text-[#4A4A4A] mt-1">{requirement.description}</p>
          )}
        </div>
        <Image size={24} className="text-[#4A5D4E]" weight="duotone" />
      </div>
      
      {requirement && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-[#F9F8F6] rounded-sm">
          <Info size={16} className="text-[#4A5D4E]" />
          <span className="font-body text-xs text-[#4A4A4A]">
            Resolution: <strong>{requirement.width} x {requirement.height}px</strong> | Format: <strong>{requirement.format}</strong>
          </span>
        </div>
      )}

      <div className="space-y-3">
        <Input
          value={settings[field]}
          onChange={(e) => setSettings(prev => ({ ...prev, [field]: e.target.value }))}
          placeholder="Enter image URL..."
          className="w-full"
        />
        
        {settings[field] && (
          <div className="relative">
            <img 
              src={settings[field]} 
              alt={label}
              className="w-full h-40 object-cover rounded-sm border border-[#E5E5E5]"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <p className="font-body text-sm text-[#4A4A4A]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E5]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-[#4A4A4A] hover:text-[#1A1A1A]">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="font-heading text-xl text-[#1A1A1A]">Site Settings</h1>
                <p className="font-body text-xs text-[#4A4A4A]">Manage site images and appearance</p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#4A5D4E] text-white hover:bg-[#3d4d40]"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Site Images Section */}
        <div className="mb-8">
          <h2 className="font-heading text-lg text-[#1A1A1A] mb-4">Site Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageField 
              label="Hero Banner" 
              field="hero_image" 
              requirement={requirements.hero_image}
            />
            <ImageField 
              label="About Page Image" 
              field="about_image" 
              requirement={requirements.about_image}
            />
            <ImageField 
              label="Site Logo" 
              field="logo_image" 
              requirement={requirements.logo_image}
            />
          </div>
        </div>

        {/* Image Requirements Reference */}
        <div className="bg-white rounded-sm border border-[#E5E5E5] p-6">
          <h2 className="font-heading text-lg text-[#1A1A1A] mb-4">Image Requirements Reference</h2>
          <p className="font-body text-sm text-[#4A4A4A] mb-4">
            Use these guidelines when uploading images to ensure optimal display quality.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  <th className="text-left py-3 px-4 font-body text-xs uppercase tracking-wider text-[#4A4A4A]">Image Type</th>
                  <th className="text-left py-3 px-4 font-body text-xs uppercase tracking-wider text-[#4A4A4A]">Resolution</th>
                  <th className="text-left py-3 px-4 font-body text-xs uppercase tracking-wider text-[#4A4A4A]">Format</th>
                  <th className="text-left py-3 px-4 font-body text-xs uppercase tracking-wider text-[#4A4A4A]">Description</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(requirements).map(([key, req]) => (
                  <tr key={key} className="border-b border-[#E5E5E5] last:border-0">
                    <td className="py-3 px-4 font-body text-sm text-[#1A1A1A] capitalize">{key.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-4 font-body text-sm text-[#4A4A4A]">{req.width} x {req.height}px</td>
                    <td className="py-3 px-4 font-body text-sm text-[#4A4A4A]">{req.format}</td>
                    <td className="py-3 px-4 font-body text-sm text-[#4A4A4A]">{req.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4">
          <Link
            to="/admin/products"
            className="flex-1 p-4 bg-white rounded-sm border border-[#E5E5E5] hover:border-[#4A5D4E]/30 transition-colors"
          >
            <h3 className="font-heading text-base text-[#1A1A1A]">Manage Products</h3>
            <p className="font-body text-xs text-[#4A4A4A]">Add, edit, or remove products</p>
          </Link>
          <Link
            to="/admin/contacts"
            className="flex-1 p-4 bg-white rounded-sm border border-[#E5E5E5] hover:border-[#4A5D4E]/30 transition-colors"
          >
            <h3 className="font-heading text-base text-[#1A1A1A]">View Inquiries</h3>
            <p className="font-body text-xs text-[#4A4A4A]">Check contact form submissions</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
