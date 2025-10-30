import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Camera, X, Upload } from 'lucide-react';
import { DefaultAvatar } from '../utils/avatarUtils';
import '../css/ProfileImageUpload.css';

const ProfileImageUpload = ({ currentAvatar, userId, onUploadSuccess, isOwnProfile = true, username = 'User' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  
  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndPreviewFile(file);
    }
  };

  const validateAndPreviewFile = (file) => {
    setError('');

    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only image files (JPEG, PNG, GIF, WebP) are allowed');
      return;
    }

    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image must be less than 5MB');
      return;
    }

    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('You must be logged in to upload an image');
        setIsUploading(false);
        return;
      }

      const response = await fetch(`/api/users/${userId}/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (onUploadSuccess) {
          onUploadSuccess(data.avatar);
        }
        setPreview(null);
        setIsModalOpen(false);
      } else {
        setError(data.message || 'Failed to upload image');
        setPreview(null);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('You must be logged in');
        return;
      }

      const response = await fetch(`/api/users/${userId}/profile/avatar`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        if (onUploadSuccess) {
          onUploadSuccess(null);
        }
        setIsModalOpen(false);
      } else {
        setError(data.message || 'Failed to delete image');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete image. Please try again.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  
  const hasRealImage = () => {
    if (!currentAvatar) return false;
    
    return currentAvatar.startsWith('/') || currentAvatar.startsWith('http');
  };

  const getImageUrl = () => {
    if (preview) return preview;
    if (hasRealImage()) return currentAvatar;
    return null;
  };

  const imageUrl = getImageUrl();

  
  if (!isOwnProfile) {
    return (
      <div className="user-avatar user-avatar-large">
        {hasRealImage() ? (
          <img 
            src={currentAvatar} 
            alt="Profile" 
            className="profile-avatar-image"
          />
        ) : (
          <DefaultAvatar username={username} size={150} />
        )}
      </div>
    );
  }

  
  return (
    <>
      <div 
        className="user-avatar user-avatar-large profile-avatar-clickable"
        onClick={() => setIsModalOpen(true)}
        title="Click to change profile picture"
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Profile" 
            className="profile-avatar-image"
          />
        ) : (
          <DefaultAvatar username={username} size={150} />
        )}
        <div className="avatar-hover-overlay">
          <Camera size={32} />
          <span>Change Photo</span>
        </div>
      </div>

      {/* Edit Profile Picture Modal - Same style as Edit Profile */}
      {isModalOpen && createPortal(
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-[9999] overflow-hidden"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[rgba(10,10,10,0.95)] border-2 border-apex-orange rounded-xl p-8 w-[90%] max-w-[500px] shadow-[0_0_50px_rgba(139,0,0,0.3)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Same as Edit Profile */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-apex-orange m-0">
                Edit Profile Picture
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-apex-orange"
              >
                <X size={24} />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 bg-red-900/20 px-4 py-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Current/Preview Image */}
            <div className="flex justify-center mb-6">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Profile Preview" 
                  className="modal-avatar-preview-image"
                />
              ) : (
                <DefaultAvatar username={username} size={200} />
              )}
            </div>

            {/* Upload Status */}
            {isUploading && (
              <div className="flex items-center justify-center gap-2 text-blue-400 bg-blue-900/20 px-4 py-3 rounded-md mb-4 text-sm">
                <Upload className="animate-spin" size={20} />
                <span>Uploading...</span>
              </div>
            )}

            {/* Action Buttons - Same style as Edit Profile */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={isUploading}
                className="flex-1 bg-apex-orange hover:bg-[#ff4500] text-white font-orbitron font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,0,0,0.3)] hover:shadow-[0_0_30px_rgba(139,0,0,0.5)]"
              >
                <Camera size={20} className="inline mr-2" />
                {hasRealImage() ? 'Change Photo' : 'Upload Photo'}
              </button>

              {hasRealImage() && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  disabled={isUploading}
                  className="flex-1 bg-gray-700 hover:bg-red-600 text-white font-orbitron font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={20} className="inline mr-2" />
                  Remove Photo
                </button>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ProfileImageUpload;
