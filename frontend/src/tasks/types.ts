export type TaskStatus = 'pending' | 'done';

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
}