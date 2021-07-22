import React, { useEffect, useState } from "react";
import { Provider, createClient, useQuery } from 'urql';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from './reducer';
import {IState} from '../../store';
import {LineChart, XAxis, YAxis, Tooltip, Legend, Line, CartesianGrid} from 'recharts';
import { Input } from "./reducer";
import { LinearProgress } from "@material-ui/core";


const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});


const subscription = `
subscription{
    newMeasurement{
    metric
    value
    at
    unit
    }
}
`;

const query = `
query ($input: [MeasurementQuery]){
  getMultipleMeasurements(input: $input){
    metric
    measurements {
      metric
      at
      unit
      value
    }
  }
}
`;

const updateSubscription = (state: IState) => {
    const activeMetrics = state.metrics.activeMetrics;
  
    return activeMetrics.length > 0 ? true : false
}

const getActiveMetrics = (state: IState) => {
  const activeMetrics = state.metrics.activeMetrics;

  return activeMetrics
};

const getChartData = (state: IState) => {
  const {chartData, lines} = state.chart;
  return {
    chartData,
    lines
  }
}

export default  () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};



const Chart = () => {
  const [input, setInput] = useState<Input[]>([]);
  const [date, setDate] = useState<number>(0);
  const [pauseQuery, setPauseQuery] = useState<boolean>(true);

  const dispatch = useDispatch();
  
  const activeMetrics = useSelector(getActiveMetrics);
  const updateSub = useSelector(updateSubscription);
  const { chartData, lines } = useSelector(getChartData);

  

  useEffect(()=>{
    const today = new Date();
    const thirtyMinuitesAgo = new Date(today.getTime() - 1000*60*30);
    // if no activeMetrics then set date
    // and pause
    // when MultipleInput then update input

    if(activeMetrics.length < 1){
      setDate(thirtyMinuitesAgo.getTime());
      setPauseQuery(true)

    } else {

      setPauseQuery(false)

      const MultipleInput = activeMetrics.map(metric => {
        return {
          "metricName": metric,
          after: date
        }
      });
      setInput(MultipleInput)
    
    }

  },[activeMetrics])



  const [result] = useQuery({
    query,
    pause: pauseQuery,
    variables:{
      input
    }
  })

  const { fetching, data, error } = result;
  // useEffect if activeMetrics updates then updated variables on use useQuery
  // if there is already an input then use the same time


  useEffect(()=>{
    if(!data) return;
    
    const {getMultipleMeasurements} = data;
    console.log(data);
    
    dispatch(actions.chartDataRecevied(getMultipleMeasurements));

  },[dispatch,data,error])

  if (fetching) return <LinearProgress/>;

  if(chartData.length > 0){

    return (
      
        <LineChart margin={{top:30, bottom:30}} width={1600} height={800} data={chartData}>
          <XAxis dataKey="xAxis" label={{value:"Time", position: 'insideBottomRight'}}/>
          {lines.map(l => <YAxis key={l.unit} width={40}  id={l.unit} dataKey={l.metric} />)}
          <Tooltip />
          <Legend/>
          {lines.map(l => <Line key={l.metric} id={l.metric} stroke="#8884d8" dataKey={l.metric} dot={false} />)}
        </LineChart>
    )
  };

  return <> </>
  

  
};
