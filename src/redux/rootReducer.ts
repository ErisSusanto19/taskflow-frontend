import { combineReducers } from 'redux';
import taskReducer from './features/tasks/taskSlice';

const rootReducer = combineReducers({
  tasks: taskReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;