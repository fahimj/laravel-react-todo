import { useState, type FormEvent } from 'react';
import { createTask } from './api';

interface TaskFormProps {
    onTaskCreated: () => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;
        setSubmitting(true);
        setError('');
        try {
            await createTask({ title: title.trim(), description: description.trim() || undefined });
            setTitle('');
            setDescription('');
            onTaskCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                rows={2}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
                type="submit"
                disabled={submitting}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {submitting ? 'Adding...' : 'Add Task'}
            </button>
        </form>
    );
}
