import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, Mail, MapPin, Calendar, Globe, X } from 'lucide-react';
import apiService from '../utils/apiService';

const EditProfile = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    title: '',
    bio: '',
    email: '',
    location: '',
    joinDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = () => {
    const currentUser = apiService.getUser();
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        title: currentUser.profile?.title || '',
        bio: currentUser.profile?.bio || '',
        email: currentUser.email || '',
        location: currentUser.profile?.location || '',
        joinDate: currentUser.createdAt || '',
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentUser = apiService.getUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        username: formData.username,
        email: formData.email,
        profile: {
          ...currentUser.profile,
          title: formData.title,
          bio: formData.bio,
          location: formData.location
        }
      };
      
      apiService.setUser(updatedUser);
      
      if (onSave) {
        onSave(formData);
      }
    }
    
    onClose();
  };

  if (isOpen === undefined) {
    return (
      <button 
        className="edit-button"
        onClick={() => console.log('Edit profile clicked')}
      >
        <User size={16} />
        Edit Profile
      </button>
    );
  }

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit Profile</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <User size={16} className="form-label-icon" />
              Username
            </label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" placeholder="Enter your username" />
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="Your professional title" />
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} className="form-input form-textarea" rows="3" placeholder="Tell us about yourself" />
          </div>
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} className="form-label-icon" />
              Email
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} className="form-label-icon" />
              Location
            </label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" placeholder="Your location" />
          </div>
          <div className="buttons-container">
            <button type="submit" className="form-submit">Save Changes</button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditProfile;