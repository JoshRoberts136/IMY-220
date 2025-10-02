import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, Mail, X, Briefcase, FileText } from 'lucide-react';
import FormInput from './FormInput';
import Button from './Button';
import DeleteProfile from './DeleteProfile';
import apiService from '../utils/apiService';

const EditProfile = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    title: '',
    bio: '',
    email: '',
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
        }
      };
      
      apiService.setUser(updatedUser);
      
      if (onSave) {
        onSave(formData);
      }
    }
    
    onClose();
  };

  const handleProfileDeleted = () => {
    onClose();
  };

  if (isOpen === undefined) {
    return (
      <Button variant="warning" icon={User} onClick={() => console.log('Edit profile clicked')}>
        Edit Profile
      </Button>
    );
  }

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-[rgba(10,10,10,0.95)] border-2 border-apex-orange rounded-xl p-8 w-[90%] max-w-[500px] max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(139,0,0,0.3)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-apex-orange m-0">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-apex-orange"
          >
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <div className="text-red-400 bg-red-900/20 px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Username"
            icon={User}
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
          
          <FormInput
            label="Title"
            icon={Briefcase}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Your professional title"
          />
          
          <FormInput
            label="Bio"
            icon={FileText}
            type="textarea"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us about yourself"
          />
          
          <FormInput
            label="Email"
            icon={Mail}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
          />
          
          <div className="flex gap-4 mt-8">
            <Button 
              type="submit" 
              variant="primary"
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Delete Profile Section */}
        <DeleteProfile onDelete={handleProfileDeleted} />
      </div>
    </div>,
    document.body
  );
};

export default EditProfile;
