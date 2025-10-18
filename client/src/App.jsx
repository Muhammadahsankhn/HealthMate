import React, { useEffect, useState } from 'react'

export default function App() {
  const [health, setHealth] = useState(null)
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(setHealth).catch(err => setError(err.message))
    fetch('/api/todos').then(r => r.json()).then(setTodos).catch(err => setError(err.message))
  }, [])

  async function addTodo(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) return
    try {
      const res = await fetch('/api/todos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })
      if (!res.ok) throw new Error('Failed to add')
      const t = await res.json()
      setTodos(prev => [t, ...prev])
      setTitle('')
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggleTodo(id, completed) {
    setError('')
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed }) })
      if (!res.ok) throw new Error('Failed to update')
      const t = await res.json()
      setTodos(prev => prev.map(x => (x.id === id || x._id === id ? t : x)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteTodo(id) {
    setError('')
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete')
      setTodos(prev => prev.filter(x => x.id !== id && x._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', margin: '2rem auto', maxWidth: 720 }}>
      <h1>MERN Starter</h1>
      <p>
        <strong>Health:</strong>{' '}
        {health ? `${health.status} (db: ${health.db}, ok: ${String(health.dbOk)})` : 'loading...'}
      </p>

      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Add a todo" style={{ flex: 1, padding: 8 }} />
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(t => {
          const id = t._id || t.id
          return (
            <li key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <input type="checkbox" checked={!!t.completed} onChange={e => toggleTodo(id, e.target.checked)} />
              <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</span>
              <button onClick={() => deleteTodo(id)} style={{ marginLeft: 'auto' }}>Delete</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
