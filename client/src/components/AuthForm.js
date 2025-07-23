import { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

function AuthForm({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await API.post(endpoint, payload);

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token); // ✅ This is now passed correctly from App

      toast.success(`${isLogin ? 'Login' : 'Signup'} successful!`);
    } catch (err) {
      console.error('Auth Error:', err);
      toast.error(err.response?.data?.message || 'Something went wrong');
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error("No token found. Please login first.");
      return;
    }

    try {
      const res = await API.get('/protected/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
    } catch (err) {
      console.error("Protected fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to access protected route");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              autoComplete="name"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            autoComplete="email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
        </form>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={toggleForm}
            className="text-indigo-600 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>

        <div className="mt-6 text-center">
          <button
            onClick={fetchDashboard}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Test Protected Dashboard Access
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
