import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AntigravityCanvas from '../components/AntigravityCanvas';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        setSuccess('OTP sent to your email');
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      console.log('Resetting password for:', email);
      const response = await api.post('/auth/reset-password', { email, otp, newPassword });
      
      console.log('Reset response:', response.data);
      
      if (response.data.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      console.error('Reset error:', err);
      setError(err.response?.data?.error || 'Failed to reset password');
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
            <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
            <p className="text-white/50">Reset your password with OTP</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
                {success}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-charcoal border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-[#e07d1f] text-black font-bold py-3 rounded-xl transition-all active:scale-95"
                >
                  Send OTP
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-charcoal border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange transition-colors"
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-charcoal border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-[#e07d1f] text-black font-bold py-3 rounded-xl transition-all active:scale-95"
                >
                  Reset Password
                </button>
              </form>
            )}
          </div>

          <p className="text-center mt-6 text-white/40 text-sm">
            <button onClick={() => navigate('/')} className="text-brand-orange hover:text-white transition-colors">Back to Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
