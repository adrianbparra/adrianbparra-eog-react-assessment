import { createSlice, PayloadAction } from 'redux-starter-kit';


// data has to be in
//[{name: 'a', value: 12}]
// name is the date 
// data has to be updated to 
// [
// {"name": date, oilTemp: 23, waterTemp: 210},
// {"name": date, oilTemp: 85, waterTemp: 452},
// ]


export type DataObject = {
    metric: string;
    measurements: {
      metric:string;
      at: number;
      unit: string;
      value: number;
    }[];
};

export type ApiErrorAction = {
  error: string;
};

export type DataForChart = [
  DataObject
];

export type MetricData = {
  metric: string;
  value: number;
  at: number;
  unit: string;
}

export type Input = {
    metricName : string;
    after: number;
}

export type InitialState = {
  "metrics":{
    [key:string] : {
      "unit" : string;
      "value" : number;
    }
  },
  "lines": {
    metric:string;
    unit: string;
    color:string;
  }[],
  "chartData": {
    name: number;
    [key:string]: number;
  }[]
}

const initialState: InitialState = {
    "metrics":{},
    "lines": [],
    "chartData" : []
};

const generateRandomColor = ( ) => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const slice = createSlice({
    name: "chart",
    initialState,
    reducers: {
      chartMetricReceived: (state, action: PayloadAction<MetricData>) => {

        const {metric,value,at,unit} = action.payload;
        // save to metrics
        const metrics = state.metrics

        metrics[metric] = {
          value,
          unit
        }

        state.metrics = metrics;


        const lastMetricData = state.chartData[state.chartData.length - 1];
        
        const newChartData = [...state.chartData]

        if (lastMetricData.name === at){
          lastMetricData[metric] = value;
          newChartData[newChartData.length - 1] = lastMetricData;

        } else {
          
          const newMetric = {
            "name":at ,
            [metric]: value
          };
          newChartData.push(newMetric);

        }

        state.chartData = newChartData;
        return state

      },

      chartMetricErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
      chartDataRecevied: (state, action: PayloadAction<DataForChart>) => {
        
        const newArray: DataForChart = action.payload
        
        const newLines = newArray.map((m) => {
          
          const {metric} = m;
          const {unit} = m.measurements[0];
          return {
            color: generateRandomColor(),
            metric,
            unit
          }
        });
        
        const modArray: any = newArray.map((m) => m.measurements);
        
        var results = []
        
        if (modArray.length > 1){
          results = modArray.reduce((prev:any,cur:any) => {
            
            const array = prev.map((c:any,i:any) => {
              
              // it already prev so it will return with new format
              var newObj: any = {}
              
              if ("at" in c){
                const dateS = new Date(c.at)
                newObj["name"] = dateS.toLocaleString();
                newObj["xAxis"] = dateS.toLocaleTimeString(navigator.language, {
                  hour: '2-digit',
                  minute:'2-digit'
                });
                newObj[c.metric] =  c.value;
                newObj[cur[i].metric] = cur[i].value;
                
              } else {
                
                newObj = {...c}
                newObj[cur[i].metric] = cur[i].value;
                
              }
              
              return newObj
            });
            return array
          });

        } else {
          results = modArray[0].map((cur:any) => {
            const newObj : any = {}
            const dateS = new Date(cur.at)
            newObj["name"] = dateS.toLocaleString();
            newObj["xAxis"] = dateS.toLocaleTimeString(navigator.language, {
              hour: '2-digit',
              minute:'2-digit'
            });
            newObj[cur.metric] =  cur.value;
            return newObj
          })
        }
        
        state.chartData = results;
        state.lines = newLines;
        
        return state
      },
      chartDataErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
      
    },
});


export const reducer = slice.reducer;
export const actions = slice.actions;