import React, { useState } from 'react';
import Login from '../components/Login';
import Signup from '../components/SignUp';
import '../styles.css';

function Splash() {
  const [activeForm, setActiveForm] = useState('login');

  return (
    <div className="splash-page">
      <div className="apex-bg">
        <div className="hex-pattern"></div>
      </div>

      <header className="header">
        <div className="logo">
          <div className="logo-icon"></div>
          <div className="logo-text">ApexCoding</div>
        </div>
        <div className="nav-buttons">
          <button 
            className={activeForm === 'login' ? 'btn btn-primary' : 'btn'} 
            onClick={() => setActiveForm('login')}
          >
            Drop In
          </button>
          <button 
            className={activeForm === 'signup' ? 'btn btn-primary' : 'btn'} 
            onClick={() => setActiveForm('signup')}
          >
            Become Legend
          </button>
        </div>
      </header>

      <main className="hero">
        <div className="hero-content">
          <div className="champion-badge">Battle-Tested Development</div>
          <h1 className="hero-title">CODE<br/>LIKE A<br/>CHAMPION</h1>
          <p className="hero-subtitle">The Arena for Elite Developers</p>
          <p className="hero-description">
            Welcome to the Outlands of software development. ApexCoding brings the competitive spirit and teamwork of the Apex Games to collaborative coding. Squad up, dominate version control, and become the Champion developer your team needs.
          </p>
          <div className="hero-cta">
          </div>

          <div className="legends-features">
            <div className="legend-feature">
              <div className="feature-icon">⚡</div>
              <div className="feature-title">Octane Speed</div>
              <div className="feature-desc">Lightning-fast commits and deployments faster than a jump pad boost</div>
            </div>
            <div className="legend-feature">
              <div className="feature-icon">🎯</div>
              <div className="feature-title">Wraith Precision</div>
              <div className="feature-desc">Track code changes with interdimensional accuracy and portal-perfect merges</div>
            </div>
            <div className="legend-feature">
              <div className="feature-icon">🛡️</div>
              <div className="feature-title">Gibraltar Defense</div>
              <div className="feature-desc">Bulletproof code protection with dome shield-level security</div>
            </div>
          </div>
        </div>

        <div className="auth-section">
          <div className="auth-container">
            {activeForm === 'login' ? <Login /> : <Signup />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Splash;