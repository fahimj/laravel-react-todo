import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from './TaskList';
import * as api from './api';

const task = (overrides = {}) => ({
    id: 1, title: 'Test task', description: 'A description', status: 'pending' as const,
    created_at: '', updated_at: '', ...overrides,
});

afterEach(() => { vi.restoreAllMocks(); });

describe('TaskList', () => {
    it('shows empty state when no tasks', () => {
        render(<TaskList tasks={[]} onTasksChanged={vi.fn()} />);

        expect(screen.getByText('No tasks yet.')).toBeInTheDocument();
    });

    it('renders each task title and description', () => {
        const tasks = [task(), task({ id: 2, title: 'Another', description: null })];

        render(<TaskList tasks={tasks} onTasksChanged={vi.fn()} />);

        expect(screen.getByText('Test task')).toBeInTheDocument();
        expect(screen.getByText('A description')).toBeInTheDocument();
        expect(screen.getByText('Another')).toBeInTheDocument();
    });

    it('shows line-through for done tasks with green styling', () => {
        const tasks = [task({ id: 1, status: 'done' as const })];

        render(<TaskList tasks={tasks} onTasksChanged={vi.fn()} />);

        const title = screen.getByText('Test task');
        expect(title.className).toContain('line-through');
        expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('toggles task status and refreshes', async () => {
        const user = userEvent.setup();
        const onTasksChanged = vi.fn();
        vi.spyOn(api, 'updateTask').mockResolvedValue(task({ status: 'done' }));

        render(<TaskList tasks={[task()]} onTasksChanged={onTasksChanged} />);

        await user.click(screen.getByText('Pending'));

        expect(api.updateTask).toHaveBeenCalledWith(1, { status: 'done' });
        expect(onTasksChanged).toHaveBeenCalled();
    });

    it('deletes task and refreshes', async () => {
        const user = userEvent.setup();
        const onTasksChanged = vi.fn();
        vi.spyOn(api, 'deleteTask').mockResolvedValue(undefined);

        render(<TaskList tasks={[task()]} onTasksChanged={onTasksChanged} />);

        await user.click(screen.getByText('Delete'));

        expect(api.deleteTask).toHaveBeenCalledWith(1);
        expect(onTasksChanged).toHaveBeenCalled();
    });

    it('switches to edit mode and saves', async () => {
        const user = userEvent.setup();
        const onTasksChanged = vi.fn();
        vi.spyOn(api, 'updateTask').mockResolvedValue(task({ title: 'Edited', description: 'New desc' }));

        render(<TaskList tasks={[task()]} onTasksChanged={onTasksChanged} />);

        await user.click(screen.getByText('Edit'));
        await user.clear(screen.getByDisplayValue('Test task'));
        await user.type(screen.getByDisplayValue(''), 'Edited');
        await user.clear(screen.getByDisplayValue('A description'));
        await user.type(screen.getByDisplayValue(''), 'New desc');
        await user.click(screen.getByText('Save'));

        expect(api.updateTask).toHaveBeenCalledWith(1, { title: 'Edited', description: 'New desc' });
        expect(onTasksChanged).toHaveBeenCalled();
    });

    it('cancels edit mode without saving', async () => {
        const user = userEvent.setup();
        vi.spyOn(api, 'updateTask');

        render(<TaskList tasks={[task()]} onTasksChanged={vi.fn()} />);

        await user.click(screen.getByText('Edit'));
        await user.click(screen.getByText('Cancel'));

        expect(api.updateTask).not.toHaveBeenCalled();
        expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('alerts on toggle failure', async () => {
        const user = userEvent.setup();
        vi.spyOn(api, 'updateTask').mockRejectedValue(new Error());
        vi.spyOn(window, 'alert').mockImplementation(() => { });

        render(<TaskList tasks={[task()]} onTasksChanged={vi.fn()} />);

        await user.click(screen.getByText('Pending'));

        expect(window.alert).toHaveBeenCalledWith('Failed to update task');
    });

    it('alerts on delete failure', async () => {
        const user = userEvent.setup();
        vi.spyOn(api, 'deleteTask').mockRejectedValue(new Error());
        vi.spyOn(window, 'alert').mockImplementation(() => { });

        render(<TaskList tasks={[task()]} onTasksChanged={vi.fn()} />);

        await user.click(screen.getByText('Delete'));

        expect(window.alert).toHaveBeenCalledWith('Failed to delete task');
    });
});
