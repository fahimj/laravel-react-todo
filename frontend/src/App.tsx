import { useCallback, useEffect, useState } from 'react';
import type { Task } from './tasks/types';
import { fetchTasks } from './tasks/api';
import TaskForm from './tasks/TaskForm';
import TaskList from './tasks/TaskList';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
      setError('');
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">To-Do</h1>
      <TaskForm onTaskCreated={loadTasks} />

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <TaskList tasks={tasks} onTasksChanged={loadTasks} />
      )}
    </div>
  );
}