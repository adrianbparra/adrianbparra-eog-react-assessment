import React, { useEffect, useState } from "react";
import { Provider,defaultExchanges, subscriptionExchange, createClient, useQuery, useSubscription } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from './reducer';
import {IState} from '../../store';
import {LineChart, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts';
import { Input } from "./reducer";
import { LinearProgress, Checkbox } from "@material-ui/core";

const wsClient = new SubscriptionClient(
  'ws://react.eogresources.com/graphql',{
    reconnect: true,
  }
)

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return wsClient.request(operation);
      },
    }),
  ],
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

const getActiveMetrics = (state: IState) => {
  const activeMetrics = state.metrics.activeMetrics;

  return activeMetrics
};

const getChartData = (state: IState) => {
  const {chartData, lines,average} = state.chart;
  return {
    chartData,
    lines,
    average
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
  

  const handelAverageChange = (event:any) => {
    dispatch(actions.averageUpdate(event.target.checked));
    // console.log(event.target.checked)
    
  };

  const activeMetrics = useSelector(getActiveMetrics);
  const { chartData, lines, average } = useSelector(getChartData);

  useEffect(()=>{
    const today = new Date();
    const thirtyMinuitesAgo = new Date(today.getTime() - 1000*60*30);

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

  },[activeMetrics,date])

  const [resSub] = useSubscription({
    query: subscription,
    pause:pauseQuery,
  });

  const {data : subData, error: subError} = resSub;
  
  const [result] = useQuery({
    query,
    pause: pauseQuery,
    variables:{
      input
    },
  })

  const { fetching, data, error } = result;

  useEffect(()=>{
    if(!data) return;
    
    if(subData){
      const {newMeasurement} = subData;

      dispatch(actions.chartMetricReceived(newMeasurement));
    }

  },[dispatch, subData, subError, data])

  useEffect(()=>{
    if(error) {
      dispatch(actions.chartDataErrorReceived({error: error.message}));
      return;
    }
    if(!data) return;
    
    const {getMultipleMeasurements} = data;
    dispatch(actions.chartDataRecevied(getMultipleMeasurements));

  },[dispatch,data,error])

  if (fetching) return <LinearProgress/>;

  if(activeMetrics.length > 0){

    return (
      <>
        <Checkbox
          name="Average"
          checked={average}
          onChange = {handelAverageChange}
        />

        <LineChart margin={{top:60, bottom:60}} width={1600} height={600} data={chartData}>
          <XAxis dataKey="name" domain={['auto', 'auto']} interval={80} label={{value:"Time", position: 'insideBottomRight'}}/>
          {lines.map((l) => <YAxis key={l.unit} id={l.unit} width={80} yAxisId={l.unit} type="number" domain={[-50,"dataMax"]} label={{value:l.unit, angle:-90, position: 'insideLeft'}} dataKey={l.metric} />)}
          <Tooltip/>
          <Legend height={5} />
          {lines.map(l => <Line key={l.metric} id={l.metric} yAxisId={l.unit} stroke={l.color} dataKey={l.metric} dot={false} />)}
        </LineChart>
        </>
    )
  };

  return null
  
};
