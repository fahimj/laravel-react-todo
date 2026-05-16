import type { Task, TaskStatus } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api';

export async function fetchTasks(): Promise<Task[]> {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const json = await res.json();
    return json.data;
}

export async function createTask(data: {
    title: string;
    description?: string;
    status?: TaskStatus;
}): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create task');
    }
    const json = await res.json();
    return json.data;
}

export async function updateTask(
    id: number,
    data: { title?: string; description?: string; status?: TaskStatus },
): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update task');
    }
    const json = await res.json();
    return json.data;
}

export async function deleteTask(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete task');
    }
}
