import React from 'react';
import Header from '../components/Header';
import Search from '../components/Search';
import QuickActions from '../components/QuickActions';
import HomeFeed from '../components/HomeFeed';

function Home() {
  const handleSearchResults = (result) => {
    console.log('Search result selected:', result);
  };

  const handleActionClick = (action) => {
    console.log('Action clicked:', action);
  };

  return (
    <div>
      <Header />
      <Search onSearchResults={handleSearchResults} />
      <QuickActions onActionClick={handleActionClick} />
      <HomeFeed />
    </div>
  );
}

export default Home;