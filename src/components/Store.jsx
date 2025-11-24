import { useState } from "react";
import { MdStore, MdCardGiftcard, MdLocalOffer, MdEdit, MdDelete, MdAdd, MdVisibility, MdStorefront } from "react-icons/md";
import Swal from "sweetalert2";
import "./Store.css";

export default function Store() {
  const [activeTab, setActiveTab] = useState('stores');
  
  const [giftCards, setGiftCards] = useState([
    { id: 1, code: "GIFT100", amount: 100, status: "active", expiryDate: "2024-12-31", usedBy: null },
    { id: 2, code: "GIFT500", amount: 500, status: "used", expiryDate: "2024-12-31", usedBy: "John Doe" },
    { id: 3, code: "GIFT250", amount: 250, status: "active", expiryDate: "2024-12-31", usedBy: null }
  ]);

  const [coupons, setCoupons] = useState([
    { id: 1, code: "SAVE20", discount: 20, type: "percentage", minAmount: 100, status: "active", expiryDate: "2024-12-31", storeId: 1 },
    { id: 2, code: "FLAT50", discount: 50, type: "fixed", minAmount: 200, status: "active", expiryDate: "2024-12-31", storeId: 2 },
    { id: 3, code: "DAIRY10", discount: 10, type: "percentage", minAmount: 50, status: "expired", expiryDate: "2024-01-15", storeId: 1 }
  ]);

  const [stores, setStores] = useState([
    { id: 1, name: "Main Store", location: "Downtown", manager: "John Smith", phone: "9876543210", status: "active" },
    { id: 2, name: "Branch Store", location: "Mall Road", manager: "Jane Doe", phone: "9876543211", status: "active" },
    { id: 3, name: "Outlet Store", location: "City Center", manager: "Bob Wilson", phone: "9876543212", status: "inactive" }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    amount: '',
    discount: '',
    type: 'percentage',
    minAmount: '',
    status: 'active',
    expiryDate: '',
    storeId: '',
    name: '',
    location: '',
    manager: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: editingItem ? 'Update Item?' : 'Create Item?',
      text: editingItem ? 'Are you sure you want to update this item?' : 'Are you sure you want to create this item?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: editingItem ? 'Yes, Update!' : 'Yes, Create!'
    });

    if (result.isConfirmed) {
      if (activeTab === 'giftcards') {
        if (editingItem) {
          setGiftCards(giftCards.map(item => 
            item.id === editingItem.id 
              ? { ...formData, id: editingItem.id, usedBy: editingItem.usedBy }
              : item
          ));
        } else {
          const newItem = { ...formData, id: Date.now(), usedBy: null };
          setGiftCards([...giftCards, newItem]);
        }
      } else if (activeTab === 'coupons') {
        if (editingItem) {
          setCoupons(coupons.map(item => 
            item.id === editingItem.id 
              ? { ...formData, id: editingItem.id }
              : item
          ));
        } else {
          const newItem = { ...formData, id: Date.now() };
          setCoupons([...coupons, newItem]);
        }
      } else {
        if (editingItem) {
          setStores(stores.map(item => 
            item.id === editingItem.id 
              ? { ...formData, id: editingItem.id }
              : item
          ));
        } else {
          const newItem = { ...formData, id: Date.now() };
          setStores([...stores, newItem]);
        }
      }
      const itemType = activeTab === 'giftcards' ? 'Gift Card' : activeTab === 'coupons' ? 'Coupon' : 'Store';
      Swal.fire('Success!', `${itemType} ${editingItem ? 'updated' : 'created'} successfully.`, 'success');
      resetForm();
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'giftcards') {
      setFormData({
        code: item.code,
        amount: item.amount.toString(),
        status: item.status,
        expiryDate: item.expiryDate
      });
    } else if (activeTab === 'coupons') {
      setFormData({
        code: item.code,
        discount: item.discount.toString(),
        type: item.type,
        minAmount: item.minAmount.toString(),
        status: item.status,
        expiryDate: item.expiryDate,
        storeId: item.storeId?.toString() || ''
      });
    } else {
      setFormData({
        name: item.name,
        location: item.location,
        manager: item.manager,
        phone: item.phone,
        status: item.status
      });
    }
    setShowForm(true);
  };

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: 'Delete Item?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete!'
    });

    if (result.isConfirmed) {
      if (activeTab === 'giftcards') {
        setGiftCards(giftCards.filter(item => item.id !== itemId));
      } else if (activeTab === 'coupons') {
        setCoupons(coupons.filter(item => item.id !== itemId));
      } else {
        setStores(stores.filter(item => item.id !== itemId));
      }
      const itemType = activeTab === 'giftcards' ? 'Gift Card' : activeTab === 'coupons' ? 'Coupon' : 'Store';
      Swal.fire('Deleted!', `${itemType} deleted successfully.`, 'success');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      amount: '',
      discount: '',
      type: 'percentage',
      minAmount: '',
      status: 'active',
      expiryDate: '',
      storeId: '',
      name: '',
      location: '',
      manager: '',
      phone: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : 'All Stores';
  };

  return (
    <div className="store-container">
      <div className="store-header">
        <h2><MdStore /> Store Management</h2>
        <button onClick={() => setShowForm(true)} className="add-store-btn">
          <MdAdd /> Add New {activeTab === 'giftcards' ? 'Gift Card' : activeTab === 'coupons' ? 'Coupon' : 'Store'}
        </button>
      </div>

      <div className="store-tabs">
        <button 
          className={`tab-btn ${activeTab === 'stores' ? 'active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          <MdStorefront /> Stores
        </button>
        <button 
          className={`tab-btn ${activeTab === 'giftcards' ? 'active' : ''}`}
          onClick={() => setActiveTab('giftcards')}
        >
          <MdCardGiftcard /> Gift Cards
        </button>
        <button 
          className={`tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setActiveTab('coupons')}
        >
          <MdLocalOffer /> Coupons
        </button>
      </div>

      {showForm && (
        <div className="store-form-overlay">
          <div className="store-form-modal">
            <div className="form-header">
              <h3>{editingItem ? 'Edit' : 'Add New'} {activeTab === 'giftcards' ? 'Gift Card' : activeTab === 'coupons' ? 'Coupon' : 'Store'}</h3>
              <button className="close-form-btn" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="form-grid">
                {activeTab === 'stores' ? (
                  <>
                    <div className="input-group">
                      <label>Store Name</label>
                      <input
                        type="text"
                        placeholder="Enter store name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Location</label>
                      <input
                        type="text"
                        placeholder="Enter location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Manager</label>
                      <input
                        type="text"
                        placeholder="Enter manager name"
                        value={formData.manager}
                        onChange={(e) => setFormData({...formData, manager: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="input-group">
                    <label>Code</label>
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      required
                    />
                  </div>
                )}
                
                {activeTab === 'giftcards' ? (
                  <div className="input-group">
                    <label>Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      required
                    />
                  </div>
                ) : activeTab === 'coupons' ? (
                  <>
                    <div className="input-group">
                      <label>Discount</label>
                      <input
                        type="number"
                        placeholder="Enter discount value"
                        value={formData.discount}
                        onChange={(e) => setFormData({...formData, discount: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Minimum Amount (₹)</label>
                      <input
                        type="number"
                        placeholder="Enter minimum amount"
                        value={formData.minAmount}
                        onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Apply to Store</label>
                      <select
                        value={formData.storeId}
                        onChange={(e) => setFormData({...formData, storeId: e.target.value})}
                      >
                        <option value="">All Stores</option>
                        {stores.filter(store => store.status === 'active').map(store => (
                          <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : null}
                
                <div className="input-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                
                {activeTab !== 'stores' && (
                  <div className="input-group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      required
                    />
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingItem ? 'Update' : 'Create'} {activeTab === 'giftcards' ? 'Gift Card' : activeTab === 'coupons' ? 'Coupon' : 'Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="store-table">
        <table>
          <thead>
            <tr>
              {activeTab === 'stores' ? (
                <>
                  <th>Store Name</th>
                  <th>Location</th>
                  <th>Manager</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              ) : (
                <>
                  <th>Code</th>
                  {activeTab === 'giftcards' ? (
                    <>
                      <th>Amount</th>
                      <th>Used By</th>
                    </>
                  ) : (
                    <>
                      <th>Discount</th>
                      <th>Type</th>
                      <th>Min Amount</th>
                      <th>Store</th>
                    </>
                  )}
                  <th>Status</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'stores' ? stores : activeTab === 'giftcards' ? giftCards : coupons).map((item) => (
              <tr key={item.id}>
                {activeTab === 'stores' ? (
                  <>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.location}</td>
                    <td>{item.manager}</td>
                    <td>{item.phone}</td>
                    <td>
                      <span className={`status ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-container">
                        <button onClick={() => handleEdit(item)} className="action-btn edit-btn" title="Edit">
                          <MdEdit style={{fontSize: '16px'}} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="action-btn delete-btn" title="Delete">
                          <MdDelete style={{fontSize: '16px'}} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td><strong>{item.code}</strong></td>
                    {activeTab === 'giftcards' ? (
                      <>
                        <td>₹{item.amount}</td>
                        <td>{item.usedBy || 'Not Used'}</td>
                      </>
                    ) : (
                      <>
                        <td>{item.discount}{item.type === 'percentage' ? '%' : '₹'}</td>
                        <td>{item.type === 'percentage' ? 'Percentage' : 'Fixed'}</td>
                        <td>₹{item.minAmount}</td>
                        <td>{getStoreName(item.storeId)}</td>
                      </>
                    )}
                    <td>
                      <span className={`status ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.expiryDate}</td>
                    <td>
                      <div className="actions-container">
                        <button onClick={() => handleEdit(item)} className="action-btn edit-btn" title="Edit">
                          <MdEdit style={{fontSize: '16px'}} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="action-btn delete-btn" title="Delete">
                          <MdDelete style={{fontSize: '16px'}} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}