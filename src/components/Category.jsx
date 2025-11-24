import { useState } from "react";
import { MdCategory, MdEdit, MdDelete, MdAdd, MdLabel, MdDescription } from "react-icons/md";
import Swal from "sweetalert2";
import "./Category.css";

export default function Category() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Milk Products", description: "Fresh milk and milk-based products", products: 15 },
    { id: 2, name: "Yogurt & Dahi", description: "Traditional and Greek yogurt varieties", products: 12 },
    { id: 3, name: "Ghee & Butter", description: "Pure ghee and clarified butter products", products: 8 },
    { id: 4, name: "Buttermilk", description: "Fresh churned buttermilk varieties", products: 6 },
    { id: 5, name: "Cheese", description: "Fresh and aged cheese varieties", products: 10 },
    { id: 6, name: "Cream", description: "Fresh cream and whipped cream", products: 5 }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: editingCategory ? 'Update Category?' : 'Add Category?',
      text: editingCategory ? 'Are you sure you want to update this category?' : 'Are you sure you want to add this category?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: editingCategory ? 'Yes, Update!' : 'Yes, Add!'
    });

    if (result.isConfirmed) {
      if (editingCategory) {
        setCategories(categories.map(c => c.id === editingCategory.id ? {...formData, id: editingCategory.id, products: editingCategory.products} : c));
        Swal.fire('Updated!', 'Category has been updated successfully.', 'success');
      } else {
        const newCategory = {...formData, id: Date.now(), products: 0};
        setCategories([...categories, newCategory]);
        Swal.fire('Added!', 'Category has been added successfully.', 'success');
      }
      resetForm();
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    const result = await Swal.fire({
      title: 'Delete Category?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete!'
    });

    if (result.isConfirmed) {
      setCategories(categories.filter(c => c.id !== categoryId));
      Swal.fire('Deleted!', 'Category has been deleted successfully.', 'success');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <h2><MdCategory /> Category Management</h2>
        <button onClick={() => setShowForm(true)} className="add-btn">
          <MdAdd /> Add New Category
        </button>
      </div>

      {showForm && (
        <div className="category-form-overlay">
          <div className="category-form-modal">
            <div className="form-header">
              <h3>{editingCategory ? <><MdEdit /> Edit Category</> : <><MdAdd /> Add New Category</>}</h3>
              <button className="close-form-btn" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="input-group">
                <label><MdLabel /> Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label><MdDescription /> Description</label>
                <textarea
                  placeholder="Enter category description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="category-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="product-count">{category.products} Products</span>
            </div>
            <div className="category-actions">
              <button onClick={() => handleEdit(category)} className="action-btn edit-btn" title="Edit">
                <MdEdit style={{fontSize: '16px'}} />
              </button>
              <button onClick={() => handleDelete(category.id)} className="action-btn delete-btn" title="Delete">
                <MdDelete style={{fontSize: '16px'}} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}