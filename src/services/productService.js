const API_URL = 'http://localhost:3001/api/products';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const productService = {
  getAllProducts: async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  },

  getProductsByVendor: async (vendorId) => {
    const res = await fetch(`${API_URL}/vendor/${vendorId}`);
    if (!res.ok) throw new Error('Failed to fetch vendor products');
    return await res.json();
  },

  createProduct: async (productData) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
  }
};

