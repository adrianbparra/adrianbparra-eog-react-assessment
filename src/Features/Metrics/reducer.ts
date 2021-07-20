import { createSlice, PayloadAction } from 'redux-starter-kit';


export type Metrics = string[]

export type ApiErrorAction = {
    error: string;
  };

const initialState = [
    ""
]

const slice = createSlice({
    name: "metrics",
    initialState,
    reducers: {
        metricsDataReceived: (state, action: PayloadAction<Metrics>) => {
            state = action.payload;
            console.log(state);
        },
        metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    },
});


export const reducer = slice.reducer;
export const actions = slice.actions;