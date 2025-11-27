import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete, MdLocalDrink, MdCoffee, MdFastfood, MdLiquor, MdLabel, MdFolder, MdAttachMoney, MdInventory, MdScale, MdAssignment, MdDescription, MdCheckCircle, MdCancel, MdBlock, MdFileDownload, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import Swal from "sweetalert2";
import { productApi } from "../api/productApi";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'milk',
    price: '',
    offerPrice: '',
    stock: '',
    unit: 'liter',
    description: '',
    status: 'available',
    images: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      // console.error('Error fetching products:', error);
      setProducts([
        { _id: '1', name: "Fresh Milk", category: "milk", price: 60, offerPrice: 55, stock: 50, unit: "liter", description: "Pure cow milk", status: "available", images: [], createdAt: new Date() },
        { _id: '2', name: "Greek Yogurt", category: "dahi", price: 120, offerPrice: 110, stock: 30, unit: "kg", description: "Thick creamy yogurt", status: "available", images: [], createdAt: new Date() },
        { _id: '3', name: "Pure Ghee", category: "ghee", price: 800, offerPrice: 750, stock: 20, unit: "kg", description: "Traditional clarified butter", status: "available", images: [], createdAt: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form data being submitted:', formData);
    
    const result = await Swal.fire({
      title: editingProduct ? 'Update Product?' : 'Add Product?',
      text: editingProduct ? 'Are you sure you want to update this product?' : 'Are you sure you want to add this product?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: editingProduct ? 'Yes, Update!' : 'Yes, Add!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        if (editingProduct) {
          await productApi.update(editingProduct._id, formData);
          Swal.fire('Updated!', 'Product has been updated successfully.', 'success');
        } else {
          await productApi.create(formData);
          Swal.fire('Added!', 'Product has been added successfully.', 'success');
        }
        fetchProducts();
        resetForm();
      } catch (error) {
        // console.error('Error saving product:', error);
        Swal.fire('Error!', 'Failed to save product. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      offerPrice: product.offerPrice?.toString() || '',
      stock: product.stock.toString(),
      unit: product.unit,
      description: product.description || '',
      status: product.status,
      images: product.images || []
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await productApi.delete(productId);
        Swal.fire('Deleted!', 'Product has been deleted successfully.', 'success');
        fetchProducts();
      } catch (error) {
        // console.error('Error deleting product:', error);
        Swal.fire('Error!', 'Failed to delete product. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'milk',
      price: '',
      offerPrice: '',
      stock: '',
      unit: 'liter',
      description: '',
      status: 'available',
      images: []
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // console.log('Files selected:', files.length);
    
    if (files.length > 3) {
      Swal.fire('Error!', 'You can only upload maximum 3 images', 'error');
      return;
    }
    
    if (files.length === 0) {
      // console.log('No files selected');
      return;
    }
    
    const imagePromises = files.map(file => {
      // console.log('Processing file:', file.name, file.type);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // console.log('File loaded successfully');
          resolve(e.target.result);
        };
        reader.onerror = (e) => {
          // console.error('Error reading file:', e);
          reject(e);
        };
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(imagePromises)
      .then(images => {
        // console.log('All images processed:', images.length);
        setFormData(prev => ({...prev, images: images}));
      })
      .catch(error => {
        // console.error('Error processing images:', error);
        Swal.fire('Error!', 'Failed to process images', 'error');
      });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({...formData, images: newImages});
  };

  const downloadExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Category,Price,Stock,Unit,Description,Status\n" +
      products.map(product => `${product.name},${product.category},${product.price},${product.stock},${product.unit},${product.description || ''},${product.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="products-container">
      <div className="products-header">
        <h2><MdLocalDrink /> Dairy Products Management</h2>
        <div className="header-actions">
          <button onClick={downloadExcel} className="download-btn">
            <MdFileDownload /> Download Excel
          </button>
          <button onClick={() => setShowForm(true)} className="add-product-btn">
            <MdAdd /> Add New Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="product-form-overlay">
          <div className="product-form-modal">
            <div className="form-header">
              <h3>{editingProduct ? <><MdEdit /> Edit Product</> : <><MdAdd /> Add New Product</>}</h3>
              <button className="close-form-btn" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="form-grid">
                <div className="input-group">
                  <label><MdLabel /> Product Name</label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label><MdFolder /> Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="milk">Milk Products</option>
                    <option value="dahi">Yogurt & Dahi</option>
                    <option value="ghee">Ghee & Butter</option>
                    <option value="buttermilk">Buttermilk</option>
                    <option value="cheese">Cheese</option>
                    <option value="cream">Cream</option>
                  </select>
                </div>
                <div className="input-group">
                  <label><MdAttachMoney /> Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label><MdAttachMoney /> Offer Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter offer price (optional)"
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({...formData, offerPrice: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label><MdInventory /> Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="Enter stock quantity"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label><MdScale /> Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                    <option value="liter">Liter</option>
                    <option value="kg">Kilogram</option>
                    <option value="gram">Gram</option>
                    <option value="ml">Milliliter</option>
                    <option value="box">Boxes</option>
                  </select>
                </div>
                <div className="input-group">
                  <label><MdAssignment /> Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="available">Available</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>
              <div className="input-group full-width">
                <label><MdDescription /> Description</label>
                <textarea
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="input-group full-width">
                <label>Product Images (Max 3)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-upload"
                />
                {formData.images.length > 0 && (
                  <div className="image-preview">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image} alt={`Product ${index + 1}`} />
                        <button type="button" onClick={() => removeImage(index)} className="remove-image">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      )}

      <div className="products-grid">
        {currentProducts.map((product) => (
          <div key={product._id || product.id} className="product-card">
            {product.images && product.images.length > 0 && (
              <div className="product-images">
                <img src={product.images[0]} alt={product.name} className="main-image" />
                {product.images.length > 1 && (
                  <div className="image-thumbnails">
                    {product.images.slice(1, 3).map((image, index) => (
                      <img key={index} src={image} alt={`${product.name} ${index + 2}`} className="thumbnail" />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="product-header">
              <div className="product-category">
                {product.category === 'milk' && <MdLocalDrink />}
                {product.category === 'dahi' && <MdCoffee />}
                {product.category === 'ghee' && <MdFastfood />}
                {product.category === 'buttermilk' && <MdLiquor />}
                {product.category === 'cheese' && <MdFastfood />}
                {product.category === 'cream' && <MdLocalDrink />}
                <span>{product.category}</span>
              </div>
              <div className="product-actions">
                <button onClick={() => handleEdit(product)} className="action-btn edit-btn" title="Edit">
                  <MdEdit style={{fontSize: '16px'}} />
                </button>
                <button onClick={() => handleDelete(product._id || product.id)} className="action-btn delete-btn" title="Delete">
                  <MdDelete style={{fontSize: '16px'}} />
                </button>
              </div>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <div className="price-section">
                  {product.offerPrice && product.offerPrice < product.price ? (
                    <>
                      <div className="offer-price">₹{product.offerPrice}/{product.unit}</div>
                      <div className="original-price">₹{product.price}/{product.unit}</div>
                    </>
                  ) : (
                    <div className="price">₹{product.price}/{product.unit}</div>
                  )}
                </div>
                <div className="stock">Stock: {product.stock} {product.unit}s</div>
              </div>
              <div className={`product-status ${product.status}`}>
                {product.status === 'available' && <><MdCheckCircle /> Available</>}
                {product.status === 'out-of-stock' && <><MdCancel /> Out of Stock</>}
                {product.status === 'discontinued' && <><MdBlock /> Discontinued</>}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <MdNavigateBefore /> Previous
        </button>
        
        <div className="pagination-info">
          Page {currentPage} of {totalPages} ({products.length} total products)
        </div>
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next <MdNavigateNext />
        </button>
      </div>
    </div>
  );
}