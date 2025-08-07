import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  unsplashImage?: string;
  quote?: string;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Omit<Task, 'id'>>) {
      const newTask = {
        id: new Date().toISOString(),
        ...action.payload,
      };
      state.tasks.push(newTask);
    },

    toggleTaskCompletion(state, action: PayloadAction<string>) {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },

    addTaskWithApiSuccess(state, action) {
      state.tasks.push(action.payload);
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    
  },
});

export const { addTask, toggleTaskCompletion, setLoading, setError } = taskSlice.actions;
export default taskSlice.reducer;