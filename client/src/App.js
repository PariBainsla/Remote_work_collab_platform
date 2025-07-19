import React from 'react';
import AuthForm from './components/AuthForm';
import TaskManager from './components/TaskManager';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div>
      {token ? <TaskManager /> : <AuthForm />}
    </div>
  );
}

export default App;
