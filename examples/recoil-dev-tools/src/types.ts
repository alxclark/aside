export interface Todo {
  id: number;
  completed?: boolean;
  description: string;
}

export type TodoFilter = 'all' | 'completed' | 'active';
