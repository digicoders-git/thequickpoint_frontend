import { useState } from "react";
import { MdShoppingCart, MdVisibility, MdEdit, MdDelete, MdAdd, MdDeliveryDining, MdFileDownload, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import Swal from "sweetalert2";
import "./Orders.css";

export default function Orders() {
  // STATE MANAGEMENT
  // Orders data - stores all order information
  const [orders, setOrders] = useState([
    { id: 1, customer: "John Doe", product: "Fresh Milk", amount: 60, status: "pending", date: "2024-01-15", quantity: 2, deliveryBoy: "Raj Kumar", address: "123 Main St" },
    { id: 2, customer: "Jane Smith", product: "Greek Yogurt", amount: 120, status: "completed", date: "2024-01-14", quantity: 1, deliveryBoy: "Amit Singh", address: "456 Oak Ave" },
    { id: 3, customer: "Bob Johnson", product: "Pure Ghee", amount: 800, status: "shipped", date: "2024-01-13", quantity: 1, deliveryBoy: "Suresh Yadav", address: "789 Pine Rd" },
    { id: 4, customer: "Alice Brown", product: "Paneer", amount: 300, status: "cancelled", date: "2024-01-12", quantity: 1, deliveryBoy: "", address: "321 Elm St" }
  ]);

  // Delivery boys data - stores delivery personnel information
  const [deliveryBoys, setDeliveryBoys] = useState([
    { id: 1, name: "Raj Kumar", phone: "9876543210", status: "active", orders: 15 },
    { id: 2, name: "Amit Singh", phone: "9876543211", status: "active", orders: 12 },
    { id: 3, name: "Suresh Yadav", phone: "9876543212", status: "inactive", orders: 8 }
  ]);
  
  // FORM CONTROL STATES
  const [showForm, setShowForm] = useState(false); // Controls order form visibility
  const [editingOrder, setEditingOrder] = useState(null); // Stores order being edited
  const [showDeliveryForm, setShowDeliveryForm] = useState(false); // Controls delivery boy form visibility
  const [editingDeliveryBoy, setEditingDeliveryBoy] = useState(null); // Stores delivery boy being edited
  
  // FORM DATA STATES
  const [deliveryFormData, setDeliveryFormData] = useState({ // Delivery boy form data
    name: '',
    phone: '',
    status: 'active'
  });
  const [formData, setFormData] = useState({ // Order form data
    customer: '',
    product: '',
    amount: '',
    quantity: 1,
    status: 'pending',
    deliveryBoy: '',
    address: ''
  });
  
  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const itemsPerPage = 10; // Items per page limit

  // ORDER MANAGEMENT FUNCTIONS
  // Handles order form submission (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show confirmation dialog
    const result = await Swal.fire({
      title: editingOrder ? 'Update Order?' : 'Create Order?',
      text: editingOrder ? 'Are you sure you want to update this order?' : 'Are you sure you want to create this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: editingOrder ? 'Yes, Update!' : 'Yes, Create!'
    });

    if (result.isConfirmed) {
      if (editingOrder) {
        // Update existing order
        setOrders(orders.map(order => 
          order.id === editingOrder.id 
            ? { ...formData, id: editingOrder.id, date: editingOrder.date }
            : order
        ));
        Swal.fire('Updated!', 'Order has been updated successfully.', 'success');
      } else {
        // Create new order
        const newOrder = {
          ...formData,
          id: Date.now(),
          date: new Date().toISOString().split('T')[0]
        };
        setOrders([...orders, newOrder]);
        Swal.fire('Created!', 'Order has been created successfully.', 'success');
      }
      resetForm();
    }
  };

  // Prepares order for editing - fills form with existing data
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      customer: order.customer,
      product: order.product,
      amount: order.amount.toString(),
      quantity: order.quantity,
      status: order.status,
      deliveryBoy: order.deliveryBoy || '',
      address: order.address || ''
    });
    setShowForm(true);
  };

  // Deletes an order with confirmation
  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: 'Delete Order?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete!'
    });

    if (result.isConfirmed) {
      setOrders(orders.filter(order => order.id !== orderId));
      Swal.fire('Deleted!', 'Order has been deleted successfully.', 'success');
    }
  };

  // Shows order details in a popup modal
  const handleView = (order) => {
    Swal.fire({
      title: `Order #${order.id}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Customer:</strong> ${order.customer}</p>
          <p><strong>Product:</strong> ${order.product}</p>
          <p><strong>Quantity:</strong> ${order.quantity}</p>
          <p><strong>Amount:</strong> ₹${order.amount}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Address:</strong> ${order.address || 'Not provided'}</p>
          <p><strong>Delivery Boy:</strong> ${order.deliveryBoy || 'Not assigned'}</p>
          <p><strong>Date:</strong> ${order.date}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  };

  // Resets order form to initial state
  const resetForm = () => {
    setFormData({ customer: '', product: '', amount: '', quantity: 1, status: 'pending', deliveryBoy: '', address: '' });
    setEditingOrder(null);
    setShowForm(false);
  };

  // DELIVERY BOY MANAGEMENT FUNCTIONS
  // Handles delivery boy form submission (create/update)
  const handleDeliverySubmit = async (e) => {
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
        // Update existing delivery boy
        setDeliveryBoys(deliveryBoys.map(boy => 
          boy.id === editingDeliveryBoy.id 
            ? { ...deliveryFormData, id: editingDeliveryBoy.id, orders: editingDeliveryBoy.orders }
            : boy
        ));
        Swal.fire('Updated!', 'Delivery boy updated successfully.', 'success');
      } else {
        // Create new delivery boy
        const newDeliveryBoy = {
          ...deliveryFormData,
          id: Date.now(),
          orders: 0
        };
        setDeliveryBoys([...deliveryBoys, newDeliveryBoy]);
        Swal.fire('Added!', 'Delivery boy added successfully.', 'success');
      }
      resetDeliveryForm();
    }
  };

  // Prepares delivery boy for editing - fills form with existing data
  const handleEditDeliveryBoy = (boy) => {
    setEditingDeliveryBoy(boy);
    setDeliveryFormData({
      name: boy.name,
      phone: boy.phone,
      status: boy.status
    });
    setShowDeliveryForm(true);
  };

  // Deletes a delivery boy with confirmation
  const handleDeleteDeliveryBoy = async (boyId) => {
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

  // Resets delivery boy form to initial state
  const resetDeliveryForm = () => {
    setDeliveryFormData({ name: '', phone: '', status: 'active' });
    setEditingDeliveryBoy(null);
    setShowDeliveryForm(false);
  };

  // UTILITY FUNCTIONS
  // Downloads orders data as Excel/CSV file
  const downloadExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Order ID,Customer,Product,Quantity,Amount,Status,Delivery Boy,Date\n" +
      orders.map(order => `${order.id},${order.customer},${order.product},${order.quantity},${order.amount},${order.status},${order.deliveryBoy || 'Not assigned'},${order.date}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PAGINATION CALCULATIONS
  const totalPages = Math.ceil(orders.length / itemsPerPage); // Calculate total pages
  const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start index for current page
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage); // Get orders for current page

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2><MdShoppingCart /> Orders Management</h2>
        <div className="header-buttons" style={{display:"flex"}}>
          <button onClick={downloadExcel} className="download-btn">
            <MdFileDownload /> Download Excel
          </button>
          <button onClick={() => setShowForm(true)} className="add-order-btn">
            <MdAdd /> Add New Order
          </button>

        </div>
      </div>

      {showForm && (
        <div className="order-form-overlay">
          <div className="order-form-modal">
            <div className="form-header">
              <h3>{editingOrder ? 'Edit Order' : 'Add New Order'}</h3>
              <button className="close-form-btn" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="form-grid">
                <div className="input-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={formData.customer}
                    onChange={(e) => setFormData({...formData, customer: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Product</label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    required
                  >
                    <option value="">Select Product</option>
                    <option value="Fresh Milk">Fresh Milk</option>
                    <option value="Greek Yogurt">Greek Yogurt</option>
                    <option value="Pure Ghee">Pure Ghee</option>
                    <option value="Buttermilk">Buttermilk</option>
                    <option value="Paneer">Paneer</option>
                    <option value="Heavy Cream">Heavy Cream</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    min="1"
                    required
                  />
                </div>
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
                <div className="input-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Delivery Address</label>
                  <input
                    type="text"
                    placeholder="Enter delivery address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Delivery Boy</label>
                  <select
                    value={formData.deliveryBoy}
                    onChange={(e) => setFormData({...formData, deliveryBoy: e.target.value})}
                  >
                    <option value="">Select Delivery Boy</option>
                    {deliveryBoys.map((boy) => (
                      <option key={boy.id} value={boy.name}>{boy.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingOrder ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      
      <div className="orders-table-wrapper">
        {/* <div className="mobile-scroll-hint">← Scroll horizontally to see all columns →</div> */}
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Delivery Boy</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>₹{order.amount}</td>
                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.deliveryBoy || 'Not assigned'}</td>
                  <td>{order.date}</td>
                  <td>
                    <div className="actions-container vertical">
                      <button onClick={() => handleView(order)} className="action-btn view-btn" title="View">
                        <MdVisibility style={{fontSize: '16px'}} />
                      </button>
                      <button onClick={() => handleEdit(order)} className="action-btn edit-btn" title="Edit">
                        <MdEdit style={{fontSize: '16px'}} />
                      </button>
                      <button onClick={() => handleDelete(order.id)} className="action-btn delete-btn" title="Delete">
                        <MdDelete style={{fontSize: '16px'}} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          Page {currentPage} of {totalPages} ({orders.length} total orders)
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