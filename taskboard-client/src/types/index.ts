export interface User {
  id: number;
  name: string;
  email: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Board {
  id: number;
  title: string;
  owner_id: number;
  created_at: string;
}

export interface Task {
  id: number;
  board_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee_id: number | null;
  due_date: string | null;
  created_at: string;
}

export interface UpdateTaskBody {
  title?: string
  description?: string
  status?: TaskStatus
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    fields?: { field: string; message: string }[];
  };
}