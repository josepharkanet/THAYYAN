import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsApi, categoriesApi, formatApiError } from '../../lib/api';
import { ArrowLeft, Plus, X, Upload } from '@phosphor-icons/react';
import ImageUpload from '../../components/ImageUpload';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';

function GalleryUpload({ images, onAdd, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useState(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
    const token = sessionStorage.getItem('access_token');
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append('image', file);
        const res = await fetch(`${API}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });
        const data = await res.json();
        if (data.url) onAdd(data.url);
      } catch { /* skip failed */ }
    }
    setUploading(false);
    if (e.target) e.target.value = '';
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {images.map((img, index) => (
          <div key={`gallery-${index}`} className="relative">
            <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
            <button type="button" onClick={() => onRemove(index)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <label className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-[#E5E5E5] rounded cursor-pointer hover:border-[#4A5D4E] transition-colors">
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
        <Upload size={16} />
        <span className="font-body text-sm text-[#4A4A4A]">{uploading ? 'Uploading...' : 'Add gallery images'}</span>
      </label>
    </div>
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    origin: '',
    finish: '',
    thickness: '',
    applications: [],
    image_url: '',
    gallery_images: [],
    featured: false
  });

  const [newApplication, setNewApplication] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const cats = await categoriesApi.getAll();
      setCategories(cats);

      if (isEditing && id) {
        const product = await productsApi.getById(id);
        setFormData({
          name: product.name || '',
          category: product.category || '',
          description: product.description || '',
          origin: product.origin || '',
          finish: product.finish || '',
          thickness: product.thickness || '',
          applications: product.applications || [],
          image_url: product.image_url || '',
          gallery_images: product.gallery_images || [],
          featured: product.featured || false
        });
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setFetching(false);
    }
  }, [id, isEditing]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleFeaturedChange = (checked) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  const addApplication = () => {
    if (newApplication.trim()) {
      setFormData(prev => ({
        ...prev,
        applications: [...prev.applications, newApplication.trim()]
      }));
      setNewApplication('');
    }
  };

  const removeApplication = (index) => {
    setFormData(prev => ({
      ...prev,
      applications: prev.applications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await productsApi.update(id, formData);
        toast.success('Product updated successfully');
      } else {
        await productsApi.create(formData);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <p className="font-body text-sm text-[#4A4A4A]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-8 px-4 sm:px-8" data-testid="product-form-page">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 font-body text-sm text-[#4A4A4A] hover:text-[#1A1A1A] mb-6"
          data-testid="back-btn"
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        <div className="bg-white rounded-sm border border-[#E5E5E5] p-6 sm:p-8">
          <h1 className="font-heading text-2xl text-[#1A1A1A] mb-6" data-testid="form-title">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                  Product Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Carrara White Marble"
                  data-testid="product-name-input"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                  Category *
                </label>
                <Select value={formData.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger data-testid="product-category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                Description *
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the product..."
                data-testid="product-description-input"
              />
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                  Origin
                </label>
                <Input
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="e.g., India"
                  data-testid="product-origin-input"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                  Finish
                </label>
                <Input
                  name="finish"
                  value={formData.finish}
                  onChange={handleChange}
                  placeholder="e.g., Polished"
                  data-testid="product-finish-input"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                  Thickness
                </label>
                <Input
                  name="thickness"
                  value={formData.thickness}
                  onChange={handleChange}
                  placeholder="e.g., 18-20mm"
                  data-testid="product-thickness-input"
                />
              </div>
            </div>

            {/* Applications */}
            <div>
              <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                Applications
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newApplication}
                  onChange={(e) => setNewApplication(e.target.value)}
                  placeholder="e.g., Flooring, Countertops"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addApplication())}
                  data-testid="application-input"
                />
                <Button type="button" variant="outline" onClick={addApplication}>
                  <Plus size={18} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.applications.map((app) => (
                  <span
                    key={`app-${app}`}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#F9F8F6] rounded-full text-sm"
                  >
                    {app}
                    <button type="button" onClick={() => removeApplication(formData.applications.indexOf(app))}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Main Image */}
            <ImageUpload
              label="Main Image *"
              value={formData.image_url}
              onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            />

            {/* Gallery Images */}
            <div>
              <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                Gallery Images
              </label>
              <GalleryUpload
                images={formData.gallery_images}
                onAdd={(url) => setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, url] }))}
                onRemove={(index) => setFormData(prev => ({ ...prev, gallery_images: prev.gallery_images.filter((_, i) => i !== index) }))}
              />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.featured}
                onCheckedChange={handleFeaturedChange}
                data-testid="product-featured-switch"
              />
              <label className="font-body text-sm text-[#1A1A1A]">
                Featured Product
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/products')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#1A1A1A] text-white"
                data-testid="product-submit-btn"
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
