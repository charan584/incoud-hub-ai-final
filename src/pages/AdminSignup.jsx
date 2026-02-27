import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AntigravityCanvas from '../components/AntigravityCanvas';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    adminKey: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/admin-signup', formData);
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Admin signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white relative overflow-hidden">
      <AntigravityCanvas />
      
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Sign Up</h1>
            <p className="text-white/50">Create admin account for resource management</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-charcoal border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-charcoal border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-charcoal border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Admin Key</label>
                <input
                  type="password"
                  value={formData.adminKey}
                  onChange={(e) => setFormData({...formData, adminKey: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-charcoal border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange transition-colors"
                  placeholder="Secret admin key"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-orange hover:bg-[#e07d1f] text-black font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                Create Admin Account
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-white/40 text-sm">
            <button onClick={() => navigate('/')} className="text-brand-orange hover:text-white transition-colors">Back to Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
