import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

const fetchTasks = async () => {
  setLoading(true); // Start loading
  try {
    const res = await API.get('/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  } catch (err) {
    console.error('Fetch error:', err);
    setError(err.response?.data?.message || 'Failed to load tasks');
  } finally {
    setLoading(false); // Stop loading regardless of success or error
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
      editingText,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setTasks(
  tasks.map((task) =>
    task._id === taskId ? { ...task, ...res.data.task } : task
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
  if (!token) {
    navigate('/login');
  } else {
    fetchTasks();
  }
}, []);



  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow-md mt-10">
      <div className="flex justify-between mb-4">
  <h2 className="text-2xl font-bold">Your Tasks</h2>
  <button
    onClick={() => {
      localStorage.removeItem('token');
      window.location.href = '/login'; // ✅ redirect to login page
    }}
    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
  >
    Logout
  </button>
</div>

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

{loading ? (
  <p className="text-gray-500">Loading tasks...</p>
) : (
 <div className="space-y-4">
  {tasks.map((task) => (
    <div
      key={task._id}
      className="bg-gray-100 p-4 rounded shadow flex justify-between items-start"
    >
      <div className="flex-1">
        {editingTaskId === task._id ? (
          <>
            <input
              placeholder="Title"
              value={editingText.title}
              onChange={(e) =>
                setEditingText({ ...editingText, title: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              placeholder="Description"
              value={editingText.description}
              onChange={(e) =>
                setEditingText({
                  ...editingText,
                  description: e.target.value,
                })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <div className="space-x-2">
              <button
                onClick={() => handleUpdateTask(task._id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditingTaskId(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-gray-700">{task.description}</p>
          </>
        )}
      </div>

      {editingTaskId !== task._id && (
        <div className="flex flex-col items-end space-y-2 ml-4">
          <button
            onClick={() => {
              setEditingTaskId(task._id);
              setEditingText({
                title: task.title,
                description: task.description,
              });
            }}
            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteTask(task._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  ))}
</div>

)}


      
    </div>
  );
}

export default TaskManager;
