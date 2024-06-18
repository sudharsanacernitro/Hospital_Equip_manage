import logo from './logo.svg';
import './App.css';
import Machine from './components/main/machine';
import Login from './components/login/login';
import Profile from './components/profile/profile';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState,useEffect } from 'react';

function App() {
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      try{
        const result=await fetch('http://localhost:5000/logout',{
            method:'GET',
            headers:{'Content-Type':'application/json'},
            credentials:'include'
            });
           
    }
    catch(error)
    {
            console.error(error);
    }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Machine />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;