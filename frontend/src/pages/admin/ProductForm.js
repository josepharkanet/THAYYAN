import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsApi, categoriesApi, formatApiError } from '../../lib/api';
import { ArrowLeft, Plus, X } from '@phosphor-icons/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';

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
  const [newGalleryImage, setNewGalleryImage] = useState('');

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

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, newGalleryImage.trim()]
      }));
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
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

            {/* Images */}
            <div>
              <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                Main Image URL *
              </label>
              <Input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
                placeholder="https://..."
                data-testid="product-image-input"
              />
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
              )}
            </div>

            <div>
              <label className="block font-body text-sm text-[#4A4A4A] mb-2">
                Gallery Images
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newGalleryImage}
                  onChange={(e) => setNewGalleryImage(e.target.value)}
                  placeholder="https://..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                  data-testid="gallery-image-input"
                />
                <Button type="button" variant="outline" onClick={addGalleryImage}>
                  <Plus size={18} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.gallery_images.map((img, index) => (
                  <div key={`gallery-${img.substring(img.lastIndexOf('/') + 1, img.lastIndexOf('/') + 15)}-${index}`} className="relative">
                    <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
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
