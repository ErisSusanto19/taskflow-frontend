import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { log } from 'console';

export const ADD_TASK_WITH_API_REQUEST = 'tasks/addTaskWithApiRequest';

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

export function* taskSaga() {
  yield takeLatest(ADD_TASK_WITH_API_REQUEST, fetchApiDataSaga);
}