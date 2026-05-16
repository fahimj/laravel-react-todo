import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';
import * as api from './api';

describe('TaskForm', () => {
    afterEach(() => { vi.restoreAllMocks(); });
    it('renders title input, description textarea, and submit button', () => {
        render(<TaskForm onTaskCreated={vi.fn()} />);

        expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
    });

    it('calls createTask and resets form on successful submit', async () => {
        const user = userEvent.setup();
        const onTaskCreated = vi.fn();
        vi.spyOn(api, 'createTask').mockResolvedValue({
            id: 1, title: 'Buy milk', description: null, status: 'pending',
            created_at: '', updated_at: '',
        });

        render(<TaskForm onTaskCreated={onTaskCreated} />);

        await user.type(screen.getByPlaceholderText('Task title'), 'Buy milk');
        await user.click(screen.getByRole('button', { name: 'Add Task' }));

        expect(api.createTask).toHaveBeenCalledWith({ title: 'Buy milk', description: undefined });
        expect(onTaskCreated).toHaveBeenCalled();
        expect(screen.getByPlaceholderText('Task title')).toHaveValue('');
    });

    it('shows error when createTask fails', async () => {
        const user = userEvent.setup();
        vi.spyOn(api, 'createTask').mockRejectedValue(new Error('Network error'));

        render(<TaskForm onTaskCreated={vi.fn()} />);

        await user.type(screen.getByPlaceholderText('Task title'), 'Test');
        await user.click(screen.getByRole('button', { name: 'Add Task' }));

        expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('disables button while submitting', async () => {
        const user = userEvent.setup();
        vi.spyOn(api, 'createTask').mockImplementation(() => new Promise(() => { }));

        render(<TaskForm onTaskCreated={vi.fn()} />);

        await user.type(screen.getByPlaceholderText('Task title'), 'Test');
        await user.click(screen.getByRole('button'));

        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByRole('button')).toHaveTextContent('Adding...');
    });

    it('does not submit with empty title', async () => {
        const user = userEvent.setup();
        const onTaskCreated = vi.fn();
        vi.spyOn(api, 'createTask');

        render(<TaskForm onTaskCreated={onTaskCreated} />);

        await user.click(screen.getByRole('button', { name: 'Add Task' }));

        expect(api.createTask).not.toHaveBeenCalled();
    });
});
