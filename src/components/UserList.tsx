import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    phone: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error loading users. Please try again later.');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      setError(null);
      
      if (editingId === null) {
        await axios.post('http://localhost:3001/users', formData);
      } else {
        await axios.put(`http://localhost:3001/users/${editingId}`, formData);
        setEditingId(null);
      }
      
      setFormData({ name: '', email: '', phone: '' });
      await fetchUsers();
    } catch (error) {
      setError(editingId ? 'Error updating user.' : 'Error creating user.');
      console.error('Error saving user:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({ name: user.name, email: user.email, phone: user.phone });
    setEditingId(user.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setError(null);
      await axios.delete(`http://localhost:3001/users/${id}`);
      await fetchUsers();
    } catch (error) {
      setError('Error deleting user.');
      console.error('Error deleting user:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="app-container">
      <div className="form-section">
        <h2 className="page-title">
          {editingId ? 'Edit User' : 'Add New User'}
        </h2>
        
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={submitLoading}
            >
              {submitLoading 
                ? 'Saving...' 
                : editingId 
                  ? 'Update User' 
                  : 'Add User'
              }
            </button>
            {editingId && (
              <button 
                type="button"
                className="btn-delete"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="list-section">
        <h2 className="page-title">Users List</h2>
        {users.length === 0 ? (
          <div className="loading">No users found. Add one using the form!</div>
        ) : (
          <div className="users-list">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <h3>{user.name}</h3>
                <div className="user-info">
                  <p>
                    <span>📧</span> {user.email}
                  </p>
                  <p>
                    <span>📱</span> {user.phone}
                  </p>
                </div>
                <div className="button-group">
                  <button
                    onClick={() => handleEdit(user)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;