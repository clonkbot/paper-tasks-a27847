import { useState, useEffect } from 'react';
import './app.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('paper-todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: Todo) => ({ ...t, createdAt: new Date(t.createdAt) }));
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('paper-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTodos(prev => [newTodo, ...prev]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="app-container">
      {/* Paper texture overlay */}
      <div className="paper-texture" />

      {/* Decorative corner elements */}
      <div className="corner-decoration top-left" />
      <div className="corner-decoration top-right" />

      <main className={`main-content ${mounted ? 'mounted' : ''}`}>
        {/* Header */}
        <header className="header">
          <div className="header-line" />
          <h1 className="title">Daily Tasks</h1>
          <p className="subtitle">
            {new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            }).format(new Date())}
          </p>
          <div className="header-line" />
        </header>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="add-form">
          <div className="input-wrapper">
            <span className="input-bullet">+</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write something down..."
              className="todo-input"
            />
          </div>
          <button type="submit" className="add-button" aria-label="Add task">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="add-icon">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>

        {/* Active Todos */}
        {activeTodos.length > 0 && (
          <section className="todos-section">
            <h2 className="section-title">To Do</h2>
            <ul className="todo-list">
              {activeTodos.map((todo, index) => (
                <li
                  key={todo.id}
                  className="todo-item"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="checkbox"
                    aria-label="Mark as complete"
                  >
                    <span className="checkbox-inner" />
                  </button>
                  <div className="todo-content">
                    <span className="todo-text">{todo.text}</span>
                    <span className="todo-date">{formatDate(todo.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                    aria-label="Delete task"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="delete-icon">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
          <section className="todos-section completed-section">
            <h2 className="section-title">
              <span className="checkmark-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Done
            </h2>
            <ul className="todo-list">
              {completedTodos.map((todo, index) => (
                <li
                  key={todo.id}
                  className="todo-item completed"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="checkbox checked"
                    aria-label="Mark as incomplete"
                  >
                    <span className="checkbox-inner">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </button>
                  <div className="todo-content">
                    <span className="todo-text">{todo.text}</span>
                    <span className="todo-date">{formatDate(todo.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                    aria-label="Delete task"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="delete-icon">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="12" y="8" width="40" height="52" rx="2" />
                <line x1="20" y1="20" x2="44" y2="20" />
                <line x1="20" y1="28" x2="40" y2="28" />
                <line x1="20" y1="36" x2="36" y2="36" />
              </svg>
            </div>
            <p className="empty-text">Your notebook awaits</p>
            <p className="empty-subtext">Start by writing your first task above</p>
          </div>
        )}

        {/* Stats Bar */}
        {todos.length > 0 && (
          <div className="stats-bar">
            <span className="stat">
              <span className="stat-number">{activeTodos.length}</span>
              <span className="stat-label">remaining</span>
            </span>
            <span className="stat-divider">/</span>
            <span className="stat">
              <span className="stat-number">{completedTodos.length}</span>
              <span className="stat-label">completed</span>
            </span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Requested by @PauliusX · Built by @clonkbot</p>
      </footer>
    </div>
  );
}

export default App;
