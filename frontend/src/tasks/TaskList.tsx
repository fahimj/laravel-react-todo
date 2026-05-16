import { useState } from 'react';
import type { Task } from './types';
import { updateTask, deleteTask } from './api';

interface TaskListProps {
    tasks: Task[];
    onTasksChanged: () => void;
}

export default function TaskList({ tasks, onTasksChanged }: TaskListProps) {
    if (tasks.length === 0) {
        return <p className="text-sm text-gray-500">No tasks yet.</p>;
    }

    return (
        <ul className="space-y-2">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onTasksChanged={onTasksChanged} />
            ))}
        </ul>
    );
}

function TaskItem({ task, onTasksChanged }: { task: Task; onTasksChanged: () => void }) {
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description ?? '');
    const [saving, setSaving] = useState(false);

    async function handleToggleStatus() {
        const next = task.status === 'pending' ? 'done' : 'pending';
        try {
            await updateTask(task.id, { status: next });
            onTasksChanged();
        } catch {
            alert('Failed to update task');
        }
    }

    async function handleDelete() {
        try {
            await deleteTask(task.id);
            onTasksChanged();
        } catch {
            alert('Failed to delete task');
        }
    }

    async function handleSaveEdit() {
        if (!editTitle.trim()) return;
        setSaving(true);
        try {
            await updateTask(task.id, {
                title: editTitle.trim(),
                description: editDescription.trim() || undefined,
            });
            setEditing(false);
            onTasksChanged();
        } catch {
            alert('Failed to update task');
        } finally {
            setSaving(false);
        }
    }

    return (
        <li className={`rounded border p-3 text-sm ${task.status === 'done' ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
            {editing ? (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                        rows={2}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <span className={task.status === 'done' ? 'line-through text-gray-400' : ''}>
                            {task.title}
                        </span>
                        {task.description && (
                            <p className="mt-1 text-xs text-gray-500">{task.description}</p>
                        )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                        <button
                            onClick={handleToggleStatus}
                            className={`rounded px-2 py-1 text-xs font-medium ${task.status === 'done'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                }`}
                        >
                            {task.status === 'done' ? 'Done' : 'Pending'}
                        </button>
                        <button
                            onClick={() => { setEditTitle(task.title); setEditDescription(task.description ?? ''); setEditing(true); }}
                            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
}
