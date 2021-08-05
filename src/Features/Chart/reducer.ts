import { createSlice, PayloadAction } from 'redux-starter-kit';

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
};

export type AverageSelector = boolean;

export type Input = {
    metricName : string;
    after: number;
}

export type InitialState = {
  "metrics":{
    [key:string] : {
      "unit" : string;
      "value" : number;
      "average"?: number;
    }
  },
  "lines": {
    metric:string;
    unit: string;
    color:string;
  }[],
  "chartData": {
    name: string;
    [key:string]: number | string;
  }[],
  "average" : boolean
}

const initialState: InitialState = {
    "metrics":{},
    "lines": [],
    "chartData" : [],
    "average" : false
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
      averageUpdate : (state, action: PayloadAction<AverageSelector>)=>{
        
        state.average = action.payload;

      },
      chartMetricReceived: (state, action: PayloadAction<MetricData>) => {

        const {metric,value,at,unit} = action.payload;

        const metrics = state.metrics

        metrics[metric] = {
          value,
          unit,
          average: 0
        }

        
        
        const lastMetricData = state.chartData[state.chartData.length - 1];
        
        const newChartData = [...state.chartData]
        
        
        const dateS = new Date(at)
        
        const name = dateS.toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute:'2-digit'
        })
        
        if (lastMetricData.name === name){
          lastMetricData[metric] = value;
          newChartData[newChartData.length - 1] = lastMetricData;
          
        } else {
          
          const newMetric = {
            name ,
            [metric]: value
          };


          newChartData.push(newMetric);
          
        }
        
        
        // get metric names
        const metricNamesOnly = Object.keys(newChartData[0])
        
        
        metricNamesOnly.forEach((m) => {
          
          if(m !== "name"){
            const total : number = newChartData.reduce((prev:any,cur:any) => {

              return prev + cur[m];
            },0);
            
            metrics[m].average = Number((total / newChartData.length).toFixed(2));
          }
          
          
        })
        
        
        state.metrics = metrics;
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
        
        var results: any = []
        
        if (modArray.length > 1){
          results = modArray.reduce((prev:any,cur:any) => {
            
            const array = prev.map((c:any,i:any) => {
              
              // it already prev so it will return with new format
              var newObj: any = {}
              
              if ("at" in c){
                const dateS = new Date(c.at)
                newObj["name"] = dateS.toLocaleTimeString(navigator.language, {
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
            newObj["name"] = dateS.toLocaleTimeString(navigator.language, {
              hour: '2-digit',
              minute:'2-digit'
            });
            newObj[cur.metric] =  cur.value;
            return newObj
          })
        };
        
        state.chartData = results;
        state.lines = newLines;
  
        return state;
      },
      chartDataErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
      
    },
});


export const reducer = slice.reducer;
export const actions = slice.actions;