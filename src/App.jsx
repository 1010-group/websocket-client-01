import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Home from './pages/Home';

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-9/12">
        <Navbar />
        <div className="flex-1 bg-base-100 flex justify-center items-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;