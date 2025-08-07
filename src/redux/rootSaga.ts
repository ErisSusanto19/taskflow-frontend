import { all, fork } from 'redux-saga/effects';
import { taskSaga } from '@/redux/features/tasks/taskSaga'

export default function* rootSaga() {
  yield all([
    fork(taskSaga),
  ]);
}