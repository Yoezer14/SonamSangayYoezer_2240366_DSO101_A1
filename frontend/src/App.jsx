import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await axios.post(`${API}/tasks`, { title });
      setTitle('');
      fetchTasks();
    } catch (err) {
      console.error('Add error:', err.message);
    }
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
      <p style={{ color: '#999', fontSize: 12 }}>API: {API}</p>
      <div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="New task..."
          style={{ width: '70%', padding: 8, fontSize: 16 }}
        />
        <button onClick={addTask} style={{ padding: 8, marginLeft: 8, fontSize: 16 }}>
          Add
        </button>
      </div>
      {tasks.length === 0 && (
        <p style={{ color: '#888', marginTop: 20 }}>No tasks yet!</p>
      )}
      <ul style={{ paddingLeft: 0, listStyle: 'none', marginTop: 16 }}>
        {tasks.map(t => (
          <li key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 0', borderBottom: '1px solid #eee'
          }}>
            <input type="checkbox" checked={t.done} onChange={() => toggleTask(t)} />
            <span style={{
              textDecoration: t.done ? 'line-through' : 'none',
              color: t.done ? '#aaa' : '#000',
              flex: 1, fontSize: 16
            }}>
              {t.title}
            </span>
            <button onClick={() => deleteTask(t.id)}
              style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;