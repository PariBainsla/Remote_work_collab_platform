import { useEffect, useState } from 'react';
import API from '../api';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const token = localStorage.getItem('token');


  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data); // Assumes API returns array of tasks
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load tasks');
    }
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/tasks', newTask);
      setTasks([...tasks, res.data]); // Add new task to list
      setNewTask({ title: '', description: '' }); // Reset form
    } catch (err) {
      console.error('Add task error:', err);
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId) => {
  try {
    await API.delete(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task._id !== taskId));
  } catch (err) {
    console.error('Delete Task Error:', err);
    alert(err.response?.data?.message || 'Failed to delete task');
  }
};

const handleUpdateTask = async (taskId) => {
  try {
    const res = await API.put(
      `/tasks/${taskId}`,
      { text: editingText },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setTasks(
      tasks.map((task) =>
        task._id === taskId ? { ...task, text: res.data.task.text } : task
      )
    );
    setEditingTaskId(null);
    setEditingText('');
  } catch (err) {
    console.error('Update Task Error:', err);
    alert(err.response?.data?.message || 'Failed to update task');
  }
};


  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>

      <form onSubmit={handleAddTask} className="mb-4">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Task
        </button>
      </form>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <ul>
  {tasks.map((task) => (
    <li key={task._id} style={{ marginBottom: '10px' }}>
      {editingTaskId === task._id ? (
        <>
          <input
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
          />
          <button onClick={() => handleUpdateTask(task._id)}>Save</button>
          <button onClick={() => setEditingTaskId(null)}>Cancel</button>
        </>
      ) : (
        <>
          {task.text}{' '}
          <button onClick={() => {
            setEditingTaskId(task._id);
            setEditingText(task.text);
          }}>Edit</button>{' '}
          <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
        </>
      )}
    </li>
  ))}
</ul>

    </div>
  );
}

export default TaskManager;
