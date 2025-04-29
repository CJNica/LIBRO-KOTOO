import React from 'react';
import BookSearch from './components/BookSearch';
import axios from 'axios';
const App = () => {
  return (
    <div>
      <h1 style={{textAlign:'center'}}>Welcome to the Book Finder</h1>
      <BookSearch />
    </div>
  );
};


export default App;
