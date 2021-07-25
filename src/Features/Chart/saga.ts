import { takeEvery, call, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { actions as MetricActions, ApiErrorAction } from './reducer';
import { PayloadAction } from 'redux-starter-kit';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
    yield call(toast.error, `Error Received: ${action.payload.error}`);
}


export function* watchApiError(){
    yield takeEvery(MetricActions.chartDataErrorReceived.type, apiErrorReceived)
}

export function* watchSubscriptionError() {
    yield takeLatest(MetricActions.chartMetricErrorReceived.type, apiErrorReceived)
}