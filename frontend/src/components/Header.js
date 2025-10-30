import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function Header() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  const handleSignOut = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header className="flex justify-between items-center px-10 py-4 backdrop-blur-[10px] border-b-[3px] border-apex-orange relative mb-5" style={{ backgroundColor: 'var(--apex-darker)' }}>
      {/* Animated gradient line */}
      <div className="absolute bottom-[-3px] left-0 w-full h-px bg-gradient-to-r from-transparent via-apex-blue to-transparent"></div>
      
      {/* Logo */}
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/home')}>
        {/* Logo Icon with rotating border */}
        <div className="relative w-[60px] h-[60px] bg-apex-red shadow-[0_0_25px_rgba(139,0,0,0.8)]" 
             style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}>
          {/* Inner triangle */}
          <div className="absolute top-[20%] left-[35%] w-[30%] h-[50%] bg-black" 
               style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
          {/* Rotating border */}
          <div className="absolute w-[60px] h-[60px] border-2 border-black animate-spin" 
               style={{ animationDuration: '10s' }}></div>
        </div>
        
        {/* Logo Text */}
        <div className="font-orbitron text-[32px] font-black bg-gradient-to-r from-apex-red to-apex-orange bg-clip-text text-transparent"
             style={{ textShadow: '0 0 30px #8b0000' }}>
          ApexCoding
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-5">
        <Link 
          to="/home" 
          className={`px-6 py-3 bg-transparent border-2 font-rajdhani font-semibold text-sm cursor-pointer transition-all duration-300 uppercase tracking-wider relative overflow-hidden ${
            location.pathname === '/home' 
              ? 'border-apex-red bg-apex-orange' 
              : 'border-apex-orange'
          } hover:shadow-[0_0_20px_rgba(139,0,0,0.5)] group`}
          style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)', color: 'var(--text-color)' }}>
          <span className="relative z-10">Feed</span>
          <div className={`absolute top-0 left-0 right-0 bottom-0 ${
            location.pathname === '/home' ? 'bg-apex-red' : 'bg-apex-orange'
          } -z-10 transition-transform duration-300 origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left`}></div>
        </Link>

        <Link 
          to="/profile" 
          className={`px-6 py-3 bg-transparent border-2 font-rajdhani font-semibold text-sm cursor-pointer transition-all duration-300 uppercase tracking-wider relative overflow-hidden ${
            location.pathname === '/profile' 
              ? 'border-apex-red bg-apex-orange' 
              : 'border-apex-orange'
          } hover:shadow-[0_0_20px_rgba(139,0,0,0.5)] group`}
          style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)', color: 'var(--text-color)' }}>
          <span className="relative z-10">Profile</span>
          <div className={`absolute top-0 left-0 right-0 bottom-0 ${
            location.pathname === '/profile' ? 'bg-apex-red' : 'bg-apex-orange'
          } -z-10 transition-transform duration-300 origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left`}></div>
        </Link>

        <button 
          onClick={handleSignOut} 
          className="px-6 py-3 bg-transparent border-2 border-apex-orange font-rajdhani font-semibold text-sm cursor-pointer transition-all duration-300 uppercase tracking-wider relative overflow-hidden hover:shadow-[0_0_20px_rgba(139,0,0,0.5)] group"
          style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)', color: 'var(--text-color)' }}>
          <span className="relative z-10">Sign out</span>
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-apex-orange -z-10 transition-transform duration-300 origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left"></div>
        </button>
      </div>
    </header>
  );
}

export default Header;
