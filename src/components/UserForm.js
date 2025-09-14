import React, { useState } from 'react';
import axios from 'axios';

function UserForm({ onUserLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/users', formData);
      onUserLogin(response.data);
      
      // Show success message based on status code
      if (response.status === 201) {
        // New user created
        console.log('New user account created successfully!');
      } else if (response.status === 200) {
        // Existing user logged in
        console.log('Welcome back!');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="user-form">
        <h2>🎬 Welcome to Movie Booking System</h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Enter your details to sign in or create a new account
        </p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In / Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserForm;