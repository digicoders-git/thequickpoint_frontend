import { useState } from "react";
import { MdDeliveryDining, MdEdit, MdDelete, MdAdd, MdFileDownload, MdNavigateBefore, MdNavigateNext, MdPerson, MdPhone, MdLock, MdLocationCity, MdImage, MdVisibility } from "react-icons/md";
import Swal from "sweetalert2";
import "./DeliveryBoy.css";

export default function DeliveryBoy() {
  const [deliveryBoys, setDeliveryBoys] = useState([
    { id: 1, name: "Raj Kumar", phone: "9876543210", password: "raj123", city: "Mumbai", status: "active", orders: 15, image: null },
    { id: 2, name: "Amit Singh", phone: "9876543211", password: "amit123", city: "Delhi", status: "active", orders: 12, image: null },
    { id: 3, name: "Suresh Yadav", phone: "9876543212", password: "suresh123", city: "Pune", status: "inactive", orders: 8, image: null }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingDeliveryBoy, setEditingDeliveryBoy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    city: '',
    status: 'active',
    image: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: editingDeliveryBoy ? 'Update Delivery Boy?' : 'Add Delivery Boy?',
      text: editingDeliveryBoy ? 'Are you sure you want to update this delivery boy?' : 'Are you sure you want to add this delivery boy?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: editingDeliveryBoy ? 'Yes, Update!' : 'Yes, Add!'
    });

    if (result.isConfirmed) {
      if (editingDeliveryBoy) {
        setDeliveryBoys(deliveryBoys.map(boy => 
          boy.id === editingDeliveryBoy.id 
            ? { ...formData, id: editingDeliveryBoy.id, orders: editingDeliveryBoy.orders }
            : boy
        ));
        Swal.fire('Updated!', 'Delivery boy updated successfully.', 'success');
      } else {
        const newDeliveryBoy = {
          ...formData,
          id: Date.now(),
          orders: 0
        };
        setDeliveryBoys([...deliveryBoys, newDeliveryBoy]);
        Swal.fire('Added!', 'Delivery boy added successfully.', 'success');
      }
      resetForm();
    }
  };

  const handleEdit = (boy) => {
    setEditingDeliveryBoy(boy);
    setFormData({
      name: boy.name,
      phone: boy.phone,
      password: boy.password,
      city: boy.city,
      status: boy.status,
      image: boy.image
    });
    setShowForm(true);
  };

  const handleDelete = async (boyId) => {
    const result = await Swal.fire({
      title: 'Delete Delivery Boy?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete!'
    });

    if (result.isConfirmed) {
      setDeliveryBoys(deliveryBoys.filter(boy => boy.id !== boyId));
      Swal.fire('Deleted!', 'Delivery boy deleted successfully.', 'success');
    }
  };

  const handleViewDetails = (boy) => {
    Swal.fire({
      title: `Delivery Boy Details`,
      html: `
        <div style="text-align: left; padding: 20px;">
          ${boy.image ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${boy.image}" alt="${boy.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;"/></div>` : ''}
          <p><strong>Name:</strong> ${boy.name}</p>
          <p><strong>Phone:</strong> ${boy.phone}</p>
          <p><strong>City:</strong> ${boy.city}</p>
          <p><strong>Status:</strong> <span style="color: ${boy.status === 'active' ? '#28a745' : '#dc3545'}; font-weight: bold;">${boy.status.toUpperCase()}</span></p>
          <p><strong>Orders Delivered:</strong> ${boy.orders}</p>
          <p><strong>Join Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#28a745',
      width: '500px'
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({...formData, image: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', password: '', city: '', status: 'active', image: null });
    setEditingDeliveryBoy(null);
    setShowForm(false);
  };

  const downloadExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Phone,City,Status,Orders Delivered\\n" +
      deliveryBoys.map(boy => `${boy.name},${boy.phone},${boy.city},${boy.status},${boy.orders}`).join("\\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "delivery_boys_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(deliveryBoys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDeliveryBoys = deliveryBoys.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <h2><MdDeliveryDining /> Delivery Boys Management</h2>
        <div className="header-actions">
          <button onClick={downloadExcel} className="download-btn">
            <MdFileDownload /> Download Excel
          </button>
          <button onClick={() => setShowForm(true)} className="add-delivery-btn">
            <MdAdd /> Add New Delivery Boy
          </button>
        </div>
      </div>

      {showForm && (
        <div className="delivery-form-overlay">
          <div className="delivery-form-container">
            <div className="form-sidebar">
              <div className="sidebar-header">
                <h3>{editingDeliveryBoy ? 'Edit Delivery Boy' : 'Add New Delivery Boy'}</h3>
                <button className="close-form-btn" onClick={resetForm}>✕</button>
              </div>
              
              <div className="image-upload-section">
                <div className="image-preview">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" />
                  ) : (
                    <div className="image-placeholder">
                      <MdImage />
                      <span>Upload Photo</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-input"
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" className="upload-btn">
                  Choose Photo
                </label>
              </div>
            </div>

            <div className="form-content">
              <form onSubmit={handleSubmit} className="delivery-form">
                <div className="form-grid">
                  <div className="input-group">
                    <label><MdPerson /> Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label><MdPhone /> Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label><MdLock /> Password</label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label><MdLocationCity /> City</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="input-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingDeliveryBoy ? 'Update Delivery Boy' : 'Add Delivery Boy'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="delivery-table">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>Status</th>
              <th>Orders Delivered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDeliveryBoys.map((boy) => (
              <tr key={boy.id}>
                <td>
                  <div className="table-image">
                    {boy.image ? (
                      <img src={boy.image} alt={boy.name} />
                    ) : (
                      <div className="no-image">
                        <MdPerson />
                      </div>
                    )}
                  </div>
                </td>
                <td>{boy.name}</td>
                <td>{boy.phone}</td>
                <td>{boy.city}</td>
                <td>
                  <span className={`status ${boy.status}`}>
                    {boy.status}
                  </span>
                </td>
                <td>{boy.orders}</td>
                <td>
                  <div className="actions-container">
                    <button onClick={() => handleViewDetails(boy)} className="action-btn view-btn" title="View Details">
                      <MdVisibility style={{fontSize: '16px'}} />
                    </button>
                    <button onClick={() => handleEdit(boy)} className="action-btn edit-btn" title="Edit">
                      <MdEdit style={{fontSize: '16px'}} />
                    </button>
                    <button onClick={() => handleDelete(boy.id)} className="action-btn delete-btn" title="Delete">
                      <MdDelete style={{fontSize: '16px'}} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          Page {currentPage} of {totalPages} ({deliveryBoys.length} total delivery boys)
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