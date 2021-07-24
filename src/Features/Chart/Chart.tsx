import React, { useEffect, useState } from "react";
import { Provider,defaultExchanges, subscriptionExchange, createClient, useQuery } from 'urql';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from './reducer';
import {IState} from '../../store';
import {LineChart, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts';
import { Input } from "./reducer";
import { LinearProgress } from "@material-ui/core";


const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  // exchanges:[
  //   ...defaultExchanges,
  //   subscriptionExchange({
  //     forwardSubscription,
  //   }),
  // ]
});


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
  const { chartData, lines } = useSelector(getChartData);

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

  },[activeMetrics])



  const [result] = useQuery({
    query,
    pause: pauseQuery,
    variables:{
      input
    }
  })

  const { fetching, data, error } = result;


  useEffect(()=>{
    if(!data) return;
    
    const {getMultipleMeasurements} = data;
    console.log(data);

    if(activeMetrics.length <0){
      console.log("No metrics")
    }
    
    dispatch(actions.chartDataRecevied(getMultipleMeasurements));

  },[dispatch,data,error])

  if (fetching) return <LinearProgress/>;

  if(activeMetrics.length > 0){

    return (
      
        <LineChart margin={{top:60, bottom:60}} width={1600} height={800} data={chartData}>
          <XAxis dataKey="xAxis" label={{value:"Time", position: 'insideBottomRight'}}/>
          {lines.map((l) => <YAxis key={l.unit} id={l.unit} width={70} yAxisId={l.unit} type="number" domain={[-50,"dataMax"]} label={{value:l.unit, angle:-90, position: 'insideLeft'}} dataKey={l.metric} />)}
          <Tooltip />
          <Legend/>
          {lines.map(l => <Line key={l.metric} id={l.metric} yAxisId={l.unit} stroke={l.color} dataKey={l.metric} dot={false} />)}
        </LineChart>
    )
  };

  return <> </>
  

  
};
