import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/Weather/saga';
import metricSaga from "../Features/Metrics/saga";
import {watchApiError,watchSubscriptionError} from "../Features/Chart/saga";

export default function* root() {
  yield spawn(weatherSaga);
  yield spawn(metricSaga);
  yield spawn(watchApiError);
  yield spawn (watchSubscriptionError);
}
