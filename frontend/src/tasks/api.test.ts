import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';

afterEach(() => { vi.restoreAllMocks(); });

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({}),
        ...response,
    } as Response);
}

const task = { id: 1, title: 'Test', description: null, status: 'pending' as const, created_at: '', updated_at: '' };

describe('fetchTasks', () => {
    it('returns parsed tasks from the data envelope', async () => {
        mockFetch({ json: async () => ({ data: [task] }) });

        const result = await fetchTasks();

        expect(result).toEqual([task]);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/tasks');
    });

    it('throws on non-ok response', async () => {
        mockFetch({ ok: false });

        await expect(fetchTasks()).rejects.toThrow('Failed to fetch tasks');
    });
});

describe('createTask', () => {
    it('POSTs and returns the created task', async () => {
        mockFetch({ json: async () => ({ data: task }) });

        const result = await createTask({ title: 'Test' });

        expect(result).toEqual(task);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/tasks', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ title: 'Test' }),
        }));
    });

    it('throws with server error message on failure', async () => {
        mockFetch({ ok: false, json: async () => ({ message: 'Title required' }) });

        await expect(createTask({ title: '' })).rejects.toThrow('Title required');
    });
});

describe('updateTask', () => {
    it('PUTs and returns the updated task', async () => {
        mockFetch({ json: async () => ({ data: { ...task, title: 'Updated' } }) });

        const result = await updateTask(1, { title: 'Updated' });

        expect(result.title).toBe('Updated');
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/tasks/1', expect.objectContaining({
            method: 'PUT',
        }));
    });
});

describe('deleteTask', () => {
    it('sends DELETE and resolves on success', async () => {
        mockFetch({ ok: true, json: undefined });

        await expect(deleteTask(1)).resolves.toBeUndefined();
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/tasks/1', { method: 'DELETE' });
    });

    it('throws with server message on failure', async () => {
        mockFetch({ ok: false, json: async () => ({ message: 'Not found' }) });

        await expect(deleteTask(1)).rejects.toThrow('Not found');
    });
});
