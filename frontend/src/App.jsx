import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = () => axios.get(`${API}/tasks`).then(r => setTasks(r.data));
  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post(`${API}/tasks`, { title });
    setTitle('');
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`${API}/tasks/${task.id}`, { done: !task.done });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>To-Do List</h1>
      <input value={title} onChange={e => setTitle(e.target.value)}
        placeholder="New task..." style={{ width: '70%', padding: 8 }} />
      <button onClick={addTask} style={{ padding: 8, marginLeft: 8 }}>Add</button>
      <ul>
        {tasks.map(t => (
          <li key={t.id} style={{ marginTop: 8 }}>
            <input type="checkbox" checked={t.done} onChange={() => toggleTask(t)} />
            <span style={{ textDecoration: t.done ? 'line-through' : 'none', marginLeft: 8 }}>
              {t.title}
            </span>
            <button onClick={() => deleteTask(t.id)} style={{ marginLeft: 12 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}