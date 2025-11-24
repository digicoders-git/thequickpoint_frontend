import API from "../api/axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { MdEdit,MdDelete, MdBlock, MdFileDownload, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import Swal from "sweetalert2";
import "./Users.css";

export default function Users({ onDataChange }) {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // console.log('Fetching users...');
      const res = await API.get("/admin/users");
      // console.log('Users fetched:', res.data);
      setUsers(res.data);
    } catch (error) {
      // console.error("Failed to fetch users:", error);
      alert('Failed to fetch users. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: editingUser ? 'Update User?' : 'Create User?',
      text: editingUser ? 'Are you sure you want to update this user?' : 'Are you sure you want to create this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: editingUser ? 'Yes, Update!' : 'Yes, Create!'
    });

    if (result.isConfirmed) {
      try {
        if (editingUser) {
          await API.put(`/admin/users/${editingUser._id}`, formData);
          Swal.fire('Updated!', 'User has been updated successfully.', 'success');
        } else {
          await API.post("/admin/users", formData);
          Swal.fire('Created!', 'User has been created successfully.', 'success');
        }
        fetchUsers();
        if (onDataChange) onDataChange();
        resetForm();
      } catch (error) {
        // console.error("Failed to save user:", error);
        Swal.fire('Error!', error.response?.data?.message || 'Failed to save user', 'error');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete!'
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/admin/users/${userId}`);
        Swal.fire('Deleted!', 'User has been deleted successfully.', 'success');
        fetchUsers();
        if (onDataChange) onDataChange();
      } catch (error) {
        // console.error("Failed to delete user:", error);
        Swal.fire('Error!', 'Failed to delete user', 'error');
      }
    }
  };

  const handleBlock = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'inactive' ? 'Block' : 'Unblock';
    
    const result = await Swal.fire({
      title: `${action} User?`,
      text: `Are you sure you want to ${action.toLowerCase()} this user?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'inactive' ? '#d33' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${action}!`
    });

    if (result.isConfirmed) {
      try {
        await API.put(`/admin/users/${userId}`, { status: newStatus });
        Swal.fire(`${action}ed!`, `User has been ${action.toLowerCase()}ed successfully.`, 'success');
        fetchUsers();
        if (onDataChange) onDataChange();
      } catch (error) {
        // console.error("Failed to update user status:", error);
        Swal.fire('Error!', 'Failed to update user status', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'user', status: 'active' });
    setEditingUser(null);
  };

  const downloadExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Role,Status,Created\n" +
      users.map(user => `${user.name},${user.email},${user.role},${user.status},${new Date(user.createdAt).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <button onClick={downloadExcel} className="download-btn">
            <MdFileDownload /> Download List
          </button>

        </div>
      </div>



      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="actions-container">
                    <button onClick={() => handleEdit(user)} className="action-btn edit-btn" title="Edit">
                      <MdEdit style={{fontSize: '16px'}} />
                    </button>
                    <button onClick={() => handleBlock(user._id, user.status)} className="action-btn block-btn" title={user.status === 'active' ? 'Block' : 'Unblock'}>
                      <MdBlock style={{fontSize: '16px'}} />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="action-btn delete-btn" title="Delete">
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
          Page {currentPage} of {totalPages} ({users.length} total users)
        </div>
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next <MdNavigateNext />
        </button>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button onClick={resetForm} className="close-btn">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}