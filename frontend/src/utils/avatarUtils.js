import React from 'react';


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


export const getDefaultEmoji = (username) => {
  if (!username) return '👤';
  
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % DEFAULT_EMOJIS.length;
  return DEFAULT_EMOJIS[index];
};


export const getInitials = (username) => {
  if (!username) return '?';
  
  
  const cleanName = username.replace(/[^a-zA-Z\s]/g, '');
  
  
  const parts = cleanName.split(/(?=[A-Z])|\s+/);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return cleanName.substring(0, 2).toUpperCase();
};


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
