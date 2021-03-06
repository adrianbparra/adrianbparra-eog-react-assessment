import { createSlice, PayloadAction } from 'redux-starter-kit';

export type AllMetrics = string[];
export type MetricName = string;
export type ActiveMetrics = string[];

export type InitialState = {
  allMetrics: string[];
  activeMetrics: string[];
};

export type ApiErrorAction = {
  error: string;
};

const initialState: InitialState = {
  allMetrics: [],
  activeMetrics: [],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataReceived: (state, action: PayloadAction<AllMetrics>) => {
      const matricsArray = action.payload;
      state.allMetrics = matricsArray;
    },
    metricsActiveUpdate: (state, action: PayloadAction<MetricName>) => {
      const metric = action.payload;

      const activeMetrics: string[] = state.activeMetrics;

      if (activeMetrics.indexOf(metric) !== -1) {
        const filteractiveMetrics = activeMetrics.filter(met => metric !== met);
        state.activeMetrics = filteractiveMetrics;
      } else {
        activeMetrics.push(metric);
        state.activeMetrics = activeMetrics;
      }
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
