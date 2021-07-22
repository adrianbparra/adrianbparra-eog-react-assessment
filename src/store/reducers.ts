import { reducer as weatherReducer } from '../Features/Weather/reducer';
import {reducer as metricReducer} from '../Features/Metrics/reducer';
import {reducer as chartReducer} from '../Features/Chart/reducer';
export default {
  weather: weatherReducer,
  metrics: metricReducer,
  chart: chartReducer,
};
