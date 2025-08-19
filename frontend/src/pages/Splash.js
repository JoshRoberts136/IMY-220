import React from 'react';
import Login from '../components/Login';
import Signup from '../components/SignUp';

function Splash() {
  return (
    <div>
      <h1>Welcome to Version Control Website</h1>
      <p>Start your journey here!</p>
      <div>
        <h2>Get Started</h2>
        <Login />
        <Signup />
      </div>
    </div>
  );
}

export default Splash;