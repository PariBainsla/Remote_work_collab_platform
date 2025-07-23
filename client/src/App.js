import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import TaskManager from './components/TaskManager';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken !== token) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div>
      {token ? (
        <TaskManager setToken={setToken} />
      ) : (
        <AuthForm setToken={setToken} />
      )}
      <ToastContainer position="top-right" autoClose={1300} />
    </div>
  );
}

export default App;
