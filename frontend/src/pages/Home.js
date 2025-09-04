import React from 'react';
import Header from '../components/Header';
import HomeFeed from '../components/HomeFeed';
import '../styles.css';

function Home() {
  return (
    <div className="wireframe-container">
      <Header />
      <HomeFeed />
    </div>
  );
}

export default Home;