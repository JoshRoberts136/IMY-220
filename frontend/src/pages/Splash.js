import React, { useState } from 'react';
import Login from '../components/Login';
import Signup from '../components/SignUp';

function Splash() {
  const [activeForm, setActiveForm] = useState('login');

  return (
    <div className="min-h-screen relative">
      {/* Apex Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(139,0,0,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(0,212,255,0.1)_0%,transparent_50%),linear-gradient(135deg,var(--apex-darker)_0%,var(--apex-dark)_100%)]">
        <div className="absolute w-full h-full opacity-[0.03] bg-[radial-gradient(circle_at_25px_25px,#fff_2px,transparent_2px),radial-gradient(circle_at_75px_75px,#fff_2px,transparent_2px)] bg-[length:100px_100px] bg-[position:0_0,50px_50px]"></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-10 py-4 bg-[rgba(10,10,10,0.95)] backdrop-blur-[10px] border-b-[3px] border-apex-orange relative mb-5">
        <div className="absolute bottom-[-3px] left-0 w-full h-px bg-gradient-to-r from-transparent via-apex-blue to-transparent"></div>
        
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative w-[60px] h-[60px] bg-apex-red shadow-[0_0_25px_rgba(139,0,0,0.8)]" 
               style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}>
            <div className="absolute top-[20%] left-[35%] w-[30%] h-[50%] bg-black" 
                 style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
            <div className="absolute w-[60px] h-[60px] border-2 border-black animate-spin" 
                 style={{ animationDuration: '10s' }}></div>
          </div>
          <div className="font-orbitron text-[32px] font-black bg-gradient-to-r from-apex-red to-apex-orange bg-clip-text text-transparent"
               style={{ textShadow: '0 0 30px var(--apex-orange)' }}>
            ApexCoding
          </div>
        </div>

        {/* Nav Buttons - Matching Header Style */}
        <div className="flex gap-5">
          <button
            onClick={() => setActiveForm('login')}
            className={`px-6 py-3 bg-transparent border-2 text-white font-rajdhani font-semibold text-sm cursor-pointer transition-all duration-300 uppercase tracking-wider relative overflow-hidden ${
              activeForm === 'login' 
                ? 'border-apex-red bg-apex-orange' 
                : 'border-apex-orange'
            } hover:text-white hover:shadow-[0_0_20px_rgba(139,0,0,0.5)] group`}
            style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
          >
            <span className="relative z-10">Drop In</span>
            <div className={`absolute top-0 left-0 right-0 bottom-0 ${
              activeForm === 'login' ? 'bg-apex-red' : 'bg-apex-orange'
            } -z-10 transition-transform duration-300 origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left`}></div>
          </button>

          <button
            onClick={() => setActiveForm('signup')}
            className={`px-6 py-3 bg-transparent border-2 text-white font-rajdhani font-semibold text-sm cursor-pointer transition-all duration-300 uppercase tracking-wider relative overflow-hidden ${
              activeForm === 'signup' 
                ? 'border-apex-red bg-apex-orange' 
                : 'border-apex-orange'
            } hover:text-white hover:shadow-[0_0_20px_rgba(139,0,0,0.5)] group`}
            style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
          >
            <span className="relative z-10">Become Legend</span>
            <div className={`absolute top-0 left-0 right-0 bottom-0 ${
              activeForm === 'signup' ? 'bg-apex-red' : 'bg-apex-orange'
            } -z-10 transition-transform duration-300 origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left`}></div>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex min-h-[calc(100vh-80px)] items-center px-10 relative">
        {/* Hero Content */}
        <div className="flex-1 max-w-[650px] z-[2]">
          {/* Champion Badge */}
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-apex-red to-apex-orange text-white text-xs font-bold uppercase tracking-[2px] mb-5"
               style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 100%, 15px 100%)' }}>
            Battle-Tested Development
          </div>

          {/* Title */}
          <h1 className="font-orbitron text-[72px] font-black leading-[0.9] mb-3 bg-gradient-to-r from-white via-apex-orange to-apex-red bg-clip-text text-transparent"
              style={{ textShadow: '0 0 50px rgba(139, 0, 0, 0.3)' }}>
            CODE<br/>LIKE A<br/>CHAMPION
          </h1>

          {/* Subtitle */}
          <p className="text-[28px] text-apex-blue mb-3 font-semibold uppercase tracking-[2px]">
            The Arena for Elite Developers
          </p>

          {/* Description */}
          <p className="text-lg text-gray-300 leading-relaxed font-normal mb-8">
            Welcome to the Outlands of software development. ApexCoding brings the competitive spirit and teamwork of the Apex Games to collaborative coding. Squad up, dominate version control, and become the Champion developer your team needs.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Octane Speed', desc: 'Lightning-fast commits and deployments faster than a jump pad boost' },
              { icon: '🎯', title: 'Wraith Precision', desc: 'Track code changes with interdimensional accuracy and portal-perfect merges' },
              { icon: '🛡️', title: 'Gibraltar Defense', desc: 'Bulletproof code protection with dome shield-level security' }
            ].map((feature, idx) => (
              <div key={idx} className="relative bg-[rgba(20,20,20,0.9)] p-6 border-2 border-transparent rounded-lg text-center transition-all duration-300 backdrop-blur-[10px] group hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(139,0,0,0.2)]">
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-r from-apex-orange via-apex-blue to-apex-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}></div>
                
                <div className="text-4xl mb-4 bg-gradient-to-r from-apex-red to-apex-orange bg-clip-text text-transparent">
                  {feature.icon}
                </div>
                <div className="font-orbitron text-lg font-bold mb-3 text-white">
                  {feature.title}
                </div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex-1 max-w-[500px] ml-20 z-[2]">
          <div className="relative bg-[rgba(10,10,10,0.95)] p-10 border-2 border-apex-orange rounded-xl shadow-[0_0_50px_rgba(139,0,0,0.2)] backdrop-blur-[15px]">
            {/* Static gradient border - no animation */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-apex-orange via-apex-blue to-apex-red rounded-xl -z-10 opacity-75 blur-sm"></div>
            
            {activeForm === 'login' ? <Login /> : <Signup />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Splash;
