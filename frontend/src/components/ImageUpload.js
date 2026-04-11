import { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon } from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const getAuthToken = () => sessionStorage.getItem('access_token');

export default function ImageUpload({ value, onChange, label, className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState('upload');
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, WebP, SVG allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post(`${API}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      onChange(res.data.url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={className} data-testid="image-upload">
      {label && <label className="block font-body text-sm text-[#4A4A4A] mb-2">{label}</label>}

      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="w-32 h-32 object-cover rounded border border-[#E5E5E5]" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            data-testid="image-remove-btn"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2 mb-2">
            <Button
              type="button"
              variant={mode === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('upload')}
              className={mode === 'upload' ? 'bg-[#1A1A1A] text-white' : ''}
            >
              <Upload size={14} className="mr-1" /> Upload File
            </Button>
            <Button
              type="button"
              variant={mode === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('url')}
              className={mode === 'url' ? 'bg-[#1A1A1A] text-white' : ''}
            >
              <LinkIcon size={14} className="mr-1" /> Paste URL
            </Button>
          </div>

          {mode === 'upload' ? (
            <div
              onClick={() => !uploading && fileRef.current?.click()}
              className="border-2 border-dashed border-[#E5E5E5] rounded-sm p-6 text-center cursor-pointer hover:border-[#4A5D4E] transition-colors"
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
                data-testid="image-file-input"
              />
              <Upload size={28} className="mx-auto mb-2 text-[#4A4A4A]" />
              <p className="font-body text-sm text-[#4A4A4A]">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              <p className="font-body text-xs text-[#999] mt-1">JPG, PNG, WebP, SVG (max 10MB)</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
                data-testid="image-url-input"
              />
              <Button type="button" variant="outline" onClick={handleUrlSubmit}>Add</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
