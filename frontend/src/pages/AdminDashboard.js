import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AdminDashboard.css';
import BASE_URL from '../api.js';
const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const [editToolId, setEditToolId] = useState(null);
  const [toolForm, setToolForm] = useState({
    name: '',
    category: '',
    description: '',
    logo: ''
  });

  const [newTool, setNewTool] = useState({
    name: '',
    category: '',
    description: '',
    logo: '',
    priceType: '',
    toolLink: ''
  });

  const [bulkText, setBulkText] = useState('');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchTools();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/stats`, authHeader);
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/users`, authHeader);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTools = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/tools`, authHeader);
      setTools(res.data);
    } catch (err) {
      console.error('Error fetching tools:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${BASE_URL}/admin/users/${id}`, authHeader);
      fetchUsers();
    } catch {
      alert('Failed to delete user');
    }
  };

  const handleDeleteTool = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tool?')) return;
    try {
      await axios.delete(`${BASE_URL}/admin/tools/${id}`, authHeader);
      fetchTools();
    } catch {
      alert('Failed to delete tool');
    }
  };

  const startEditTool = (tool) => {
    setEditToolId(tool._id);
    setToolForm({
      name: tool.name,
      category: tool.category,
      description: tool.description,
      logo: tool.logo
    });
  };

  const cancelEdit = () => {
    setEditToolId(null);
    setToolForm({ name: '', category: '', description: '', logo: '' });
  };

  const handleToolChange = (e) => {
    setToolForm({ ...toolForm, [e.target.name]: e.target.value });
  };

  const submitToolEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${BASE_URL}/admin/tools/${editToolId}`, toolForm, authHeader);
      cancelEdit();
      fetchTools();
    } catch {
      alert('Failed to update tool');
    }
  };

  const handleNewToolChange = (e) => {
    setNewTool({ ...newTool, [e.target.name]: e.target.value });
  };

  const submitNewTool = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/admin/tools`, newTool, authHeader);
      setNewTool({
        name: '',
        category: '',
        description: '',
        logo: '',
        priceType: '',
        toolLink: ''
      });
      fetchTools();
    } catch {
      alert('Failed to create tool');
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkText) return alert('Paste some JSON first!');
    try {
      const parsed = JSON.parse(bulkText);
      if (!Array.isArray(parsed)) {
        return alert('Input must be a JSON array of tool objects');
      }

      const res = await axios.post(`${BASE_URL}/admin/bulk`, parsed, authHeader);
      alert(`✅ ${res.data.added} tools added, ${res.data.skippedDueToDuplicates} skipped`);
      setBulkText('');
      fetchTools();
    } catch (err) {
      console.error(err);
      alert('❌ Error uploading tools. Make sure JSON is valid.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>📊 Admin Dashboard</h1>

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="stats">
          <p><strong>Total Users :</strong> {users.filter(u => u.role !== 'admin').length}</p>
          <p><strong>Total Tools:</strong> {stats.totalTools}</p>
          <p><strong>Most Used Category:</strong> {stats.mostUsedCategory}</p>
        </div>
      )}

      <h2>👥 Manage Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(user => user.role !== 'admin')  // Only non-admin users listed
            .map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user._id)}>🗑 Delete</button>
                </td>
              </tr>
          ))}
        </tbody>
      </table>

      <h2>🛠 Manage Tools</h2>

      <form className="tool-form" onSubmit={submitNewTool}>
        <h3>➕ Add New Tool</h3>
        <input name="name" value={newTool.name} onChange={handleNewToolChange} placeholder="Name" required />
        <input name="category" value={newTool.category} onChange={handleNewToolChange} placeholder="Category" required />
        <input name="description" value={newTool.description} onChange={handleNewToolChange} placeholder="Description" required />
        <input name="logo" value={newTool.logo} onChange={handleNewToolChange} placeholder="Logo URL" />
        <input name="priceType" value={newTool.priceType} onChange={handleNewToolChange} placeholder="Price Type (Free, Paid, etc.)" required />
        <input name="toolLink" value={newTool.toolLink} onChange={handleNewToolChange} placeholder="Tool Link" required />
        <button type="submit">Add Tool</button>
      </form>

      <h3>📦 Bulk Upload Tools (Paste JSON)</h3>
      <textarea
        rows="10"
        placeholder='[ { "name": "...", "category": "...", "priceType": "Free", "toolLink": "..." }, ... ]'
        value={bulkText}
        onChange={(e) => setBulkText(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <button onClick={handleBulkUpload}>🚀 Upload Bulk Tools</button>

      <table className="tool-table">
        <thead>
          <tr>
            <th>Name</th><th>Category</th><th>Description</th><th>Logo</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map(tool => (
            <tr key={tool._id}>
              {editToolId === tool._id ? (
                <>
                  <td><input name="name" value={toolForm.name} onChange={handleToolChange} required /></td>
                  <td><input name="category" value={toolForm.category} onChange={handleToolChange} required /></td>
                  <td><input name="description" value={toolForm.description} onChange={handleToolChange} required /></td>
                  <td><input name="logo" value={toolForm.logo} onChange={handleToolChange} /></td>
                  <td>
                    <button onClick={submitToolEdit}>💾 Save</button>
                    <button onClick={cancelEdit}>❌ Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{tool.name}</td>
                  <td>{tool.category}</td>
                  <td>{tool.description}</td>
                  <td><img src={tool.logo} alt={tool.name} width="40" /></td>
                  <td>
                    <button onClick={() => startEditTool(tool)}>✏️ Edit</button>
                    <button onClick={() => handleDeleteTool(tool._id)}>🗑 Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
