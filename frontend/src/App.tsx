import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { ToastContainer } from 'react-toastify';

import NavbarTop from './components/NavbarTop';
import NavbarBottom from './components/NavbarBottom';
import ShoppingList from './components/ShoppingList';

function App() {
  return (
    <div className="App">

      <NavbarTop />

        <ShoppingList />
      
      <NavbarBottom />
      <ToastContainer />

    </div>
  );
}

export default App;
