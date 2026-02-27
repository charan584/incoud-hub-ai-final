import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AntigravityCanvas from '../components/AntigravityCanvas';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState({
    branch: '',
    year: '',
    section: '',
    subject: '',
    unit: '',
    link: ''
  });

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/');
      return;
    }
    fetchResources();
  }, [navigate]);

  const fetchResources = async () => {
    try {
      const response = await api.get('/admin/resources');
      setResources(response.data.resources || []);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/resources', newResource);
      setShowAddModal(false);
      setNewResource({ branch: '', year: '', section: '', subject: '', unit: '', link: '' });
      fetchResources();
    } catch (error) {
      alert('Failed to add resource');
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Delete this resource?')) {
      try {
        await api.delete(`/admin/resources/${id}`);
        fetchResources();
      } catch (error) {
        alert('Failed to delete resource');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white relative overflow-hidden">
      <AntigravityCanvas />
      
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-brand-orange hover:bg-[#e07d1f] text-black font-bold rounded-xl transition-all"
              >
                Add Resource
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">All Resources</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4">Branch</th>
                    <th className="text-left p-4">Year</th>
                    <th className="text-left p-4">Section</th>
                    <th className="text-left p-4">Subject</th>
                    <th className="text-left p-4">Unit</th>
                    <th className="text-left p-4">Link</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">{resource.branch}</td>
                      <td className="p-4">{resource.year}</td>
                      <td className="p-4">{resource.section}</td>
                      <td className="p-4">{resource.subject}</td>
                      <td className="p-4">{resource.unit}</td>
                      <td className="p-4">
                        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
                          View
                        </a>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteResource(resource._id)}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-brand-charcoal border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Add New Resource</h2>
            <form onSubmit={handleAddResource} className="space-y-4">
              <input
                type="text"
                placeholder="Branch (e.g., CSE)"
                value={newResource.branch}
                onChange={(e) => setNewResource({...newResource, branch: e.target.value})}
                className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                required
              />
              <input
                type="text"
                placeholder="Year (e.g., 1st Year)"
                value={newResource.year}
                onChange={(e) => setNewResource({...newResource, year: e.target.value})}
                className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                required
              />
              <input
                type="text"
                placeholder="Section (e.g., A)"
                value={newResource.section}
                onChange={(e) => setNewResource({...newResource, section: e.target.value})}
                className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                required
              />
              <input
                type="text"
                placeholder="Subject (e.g., C Language)"
                value={newResource.subject}
                onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                required
              />
              <input
                type="text"
                placeholder="Unit (e.g., Unit 1)"
                value={newResource.unit}
                onChange={(e) => setNewResource({...newResource, unit: e.target.value})}
                className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                required
              />
              <input
                type="url"
                placeholder="Link URL"
                value={newResource.link}
                onChange={(e) => setNewResource({...newResource, link: e.target.value})}
                className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange"
                required
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-brand-orange hover:bg-[#e07d1f] text-black font-bold py-3 rounded-xl transition-all"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
