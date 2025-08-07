import { put, call, takeLatest, takeEvery, select } from 'redux-saga/effects';
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
    addTask, 
    setLoading, 
    setError,
    toggleTaskCompletion,
    deleteTask,
    reorderTasks
} from './taskSlice';
import { RootState } from '@/redux/store';

export const ADD_TASK_WITH_API_REQUEST = 'tasks/addTaskWithApiRequest';
export const LOAD_TASKS_FROM_LOCAL_STORAGE = 'tasks/loadTasksFromLocalStorage';
export const SAVE_TASKS_TO_LOCAL_STORAGE = 'tasks/saveTasksToLocalStorage';

interface AddTaskWithApiPayload {
  title: string;
  category: string;
  completed: boolean;
}

function* fetchApiDataSaga(action: PayloadAction<AddTaskWithApiPayload>) {
  try {

    yield put({ type: 'tasks/setLoading', payload: true });

    const unsplashAccessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=${action.payload.category}&client_id=${unsplashAccessKey}`;
    const unsplashResponse = yield call(axios.get, unsplashUrl);

    const quoteResponse = yield call(axios.get, 'http://localhost:3000/api/quotes');    
    const quoteData = quoteResponse.data[0];

    const newTask = {
      ...action.payload,
      id: new Date().toISOString(),
      unsplashImage: unsplashResponse.data.urls.small,
      quote: quoteData.q + ' - ' + quoteData.a,
    };

    yield put({ type: 'tasks/addTaskWithApiSuccess', payload: newTask });
  } catch (error) {
    yield put({ type: 'tasks/setError', payload: 'Gagal mengambil data dari API' });
  } finally {
    yield put({ type: 'tasks/setLoading', payload: false });
  }
}

function* loadTasksSaga() {
  try {
    const tasks = yield call([localStorage, 'getItem'], 'taskflow_tasks');
    if (tasks) {
      yield put({ type: 'tasks/setInitialTasks', payload: JSON.parse(tasks) });
    }
  } catch (e) {
    console.error("Failed to load tasks from local storage", e);
  }
}

function* saveTasksSaga() {
  try {
    const tasks = yield select((state: RootState) => state.tasks.tasks);
    yield call([localStorage, 'setItem'], 'taskflow_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks to local storage", e);
  }
}

export function* taskSaga() {
  yield takeLatest(ADD_TASK_WITH_API_REQUEST, fetchApiDataSaga);
  yield takeLatest(LOAD_TASKS_FROM_LOCAL_STORAGE, loadTasksSaga);

  yield takeEvery([addTask.type, toggleTaskCompletion.type, deleteTask.type, reorderTasks.type], saveTasksSaga);
}