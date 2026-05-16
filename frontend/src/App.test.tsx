import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import * as api from './tasks/api';

describe('App', () => {
    afterEach(() => { vi.restoreAllMocks(); });
    it('renders the heading', () => {
        vi.spyOn(api, 'fetchTasks').mockResolvedValue([]);
        render(<App />);
        expect(screen.getByText('To-Do')).toBeInTheDocument();
    });

    it('shows loading state initially', async () => {
        vi.spyOn(api, 'fetchTasks').mockImplementation(() => new Promise(() => { }));
        render(<App />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows error when fetch fails', async () => {
        vi.spyOn(api, 'fetchTasks').mockRejectedValue(new Error());
        render(<App />);
        expect(await screen.findByText('Failed to load tasks')).toBeInTheDocument();
    });

    it('renders TaskList when fetch succeeds', async () => {
        vi.spyOn(api, 'fetchTasks').mockResolvedValue([]);
        render(<App />);
        expect(await screen.findByText('No tasks yet.')).toBeInTheDocument();
    });
});
