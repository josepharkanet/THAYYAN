import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { productsApi, contactApi } from '../../lib/api';
import { 
  House, Package, Envelope, SignOut, Plus, Pencil, Trash, 
  ArrowLeft, MagnifyingGlass, Gear 
} from '@phosphor-icons/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';

const navItems = [
  { path: '/admin', icon: House, label: 'Dashboard' },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/contacts', icon: Envelope, label: 'Contacts' },
  { path: '/admin/settings', icon: Gear, label: 'Settings' },
];

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] fixed h-full" data-testid="admin-sidebar">
        <div className="p-6 border-b border-[#E5E5E5]">
          <h1 className="font-heading text-xl font-medium text-[#1A1A1A]">STONIC</h1>
          <p className="font-body text-xs text-[#4A4A4A]">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm font-body text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-[#4A5D4E]/10 text-[#4A5D4E]'
                  : 'text-[#4A4A4A] hover:bg-[#F9F8F6]'
              }`}
              data-testid={`admin-nav-${item.label.toLowerCase()}`}
            >
              <item.icon size={20} weight={location.pathname === item.path ? 'fill' : 'regular'} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E5E5E5]">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-[#4A5D4E] rounded-full flex items-center justify-center">
              <span className="font-body text-xs text-white">{user?.name?.[0] || 'A'}</span>
            </div>
            <div>
              <p className="font-body text-sm text-[#1A1A1A]">{user?.name || 'Admin'}</p>
              <p className="font-body text-xs text-[#4A4A4A]">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-sm font-body text-sm text-red-600 hover:bg-red-50 transition-colors"
            data-testid="admin-logout-btn"
          >
            <SignOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-[#4A4A4A] hover:text-[#1A1A1A]">
            <ArrowLeft size={16} />
            Back to Website
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, contacts: 0 });
  const [recentProducts, setRecentProducts] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [products, contacts] = await Promise.all([
        productsApi.getAll(),
        contactApi.getAll().catch(() => [])
      ]);
      setStats({ products: products.length, contacts: contacts.length });
      setRecentProducts(products.slice(0, 5));
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl text-[#1A1A1A] mb-8" data-testid="admin-dashboard-title">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-sm border border-[#E5E5E5]" data-testid="stat-products">
          <Package size={32} className="text-[#4A5D4E] mb-4" weight="duotone" />
          <p className="font-heading text-3xl text-[#1A1A1A]">{stats.products}</p>
          <p className="font-body text-sm text-[#4A4A4A]">Total Products</p>
        </div>
        <div className="bg-white p-6 rounded-sm border border-[#E5E5E5]" data-testid="stat-contacts">
          <Envelope size={32} className="text-[#4A5D4E] mb-4" weight="duotone" />
          <p className="font-heading text-3xl text-[#1A1A1A]">{stats.contacts}</p>
          <p className="font-body text-sm text-[#4A4A4A]">Contact Inquiries</p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-[#E5E5E5]">
        <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center">
          <h2 className="font-heading text-lg text-[#1A1A1A]">Recent Products</h2>
          <Link to="/admin/products" className="font-body text-sm text-[#4A5D4E] hover:underline">
            View All
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Featured</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-body text-sm">{product.name}</TableCell>
                <TableCell className="font-body text-sm capitalize">{product.category.replace('-', ' ')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${product.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {product.featured ? 'Yes' : 'No'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteDialog.product) return;
    try {
      await productsApi.delete(deleteDialog.product.id);
      setProducts(products.filter(p => p.id !== deleteDialog.product.id));
      setDeleteDialog({ open: false, product: null });
    } catch {
      // Silent fail
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-2xl text-[#1A1A1A]" data-testid="admin-products-title">Products</h1>
        <Button
          onClick={() => navigate('/admin/products/new')}
          className="bg-[#1A1A1A] text-white"
          data-testid="add-product-btn"
        >
          <Plus size={18} className="mr-2" />
          Add Product
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-xs">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]" />
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="admin-search-input"
          />
        </div>
      </div>

      <div className="bg-white rounded-sm border border-[#E5E5E5]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">No products found</TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                  <TableCell>
                    <img src={product.image_url} alt="" className="w-12 h-12 object-cover rounded" />
                  </TableCell>
                  <TableCell className="font-body text-sm">{product.name}</TableCell>
                  <TableCell className="font-body text-sm capitalize">{product.category.replace('-', ' ')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${product.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                        data-testid={`edit-product-${product.id}`}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteDialog({ open: true, product })}
                        data-testid={`delete-product-${product.id}`}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, product: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm text-[#4A4A4A]">
            Are you sure you want to delete "{deleteDialog.product?.name}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, product: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} data-testid="confirm-delete-btn">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    try {
      const data = await contactApi.getAll();
      setContacts(data);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl text-[#1A1A1A] mb-8" data-testid="admin-contacts-title">Contact Inquiries</h1>

      <div className="bg-white rounded-sm border border-[#E5E5E5]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">No contacts yet</TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id} data-testid={`contact-row-${contact.id}`}>
                  <TableCell className="font-body text-sm">{contact.name}</TableCell>
                  <TableCell className="font-body text-sm">{contact.email}</TableCell>
                  <TableCell className="font-body text-sm">{contact.phone || '-'}</TableCell>
                  <TableCell className="font-body text-sm max-w-xs truncate">{contact.message}</TableCell>
                  <TableCell className="font-body text-sm">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
