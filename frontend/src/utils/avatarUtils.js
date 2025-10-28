import React from 'react';

// Default emoji avatars to choose from
const DEFAULT_EMOJIS = [
  '👤', '🎮', '💻', '🚀', '⚡', '🔥', 
  '🎯', '💡', '🎨', '🎭', '🎪', '🎬',
  '🎸', '🎹', '🎺', '🎻', '🥁', '🎤',
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐',
  '🌟', '✨', '💫', '🌙', '☀️', '🌈',
  '🦁', '🦊', '🐺', '🦅', '🦉', '🐉',
  '🍕', '🍔', '🍣', '🍩', '🍰', '🎂',
  '☕', '🍺', '🍷', '🍸', '🥤', '🧃'
];

// Get a consistent emoji based on username
export const getDefaultEmoji = (username) => {
  if (!username) return '👤';
  
  // Simple hash function to get consistent emoji for same username
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % DEFAULT_EMOJIS.length;
  return DEFAULT_EMOJIS[index];
};

// Generate initials from username (kept for potential future use)
export const getInitials = (username) => {
  if (!username) return '?';
  
  // Remove numbers and special characters
  const cleanName = username.replace(/[^a-zA-Z\s]/g, '');
  
  // Split by spaces or camelCase
  const parts = cleanName.split(/(?=[A-Z])|\s+/);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return cleanName.substring(0, 2).toUpperCase();
};

// React component for default avatar with emoji
export const DefaultAvatar = ({ username, size = 150, className = '' }) => {
  const emoji = getDefaultEmoji(username);
  
  return (
    <div
      className={`default-avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.2) 0%, rgba(255, 51, 51, 0.2) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size / 2.5}px`,
        userSelect: 'none'
      }}
    >
      {emoji}
    </div>
  );
};

export default {
  getDefaultEmoji,
  getInitials,
  DefaultAvatar
};
