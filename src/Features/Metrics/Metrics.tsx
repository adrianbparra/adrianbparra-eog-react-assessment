import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { IState } from '../../store';
import { useEffect } from "react";
import {Grid, LinearProgress, Card, CardContent  } from "@material-ui/core";

const client = createClient({
    url: 'https://react.eogresources.com/graphql',
});

const query = `
query {
    getMetrics
  }
`;

const getMetricsData = (state: IState) => {
    console.log(state)
    const metrics = state.metrics;

    return [...metrics];
};

const getWeather = (state: IState) => {
    const { temperatureinFahrenheit, description, locationName } = state.weather;
    return {
      temperatureinFahrenheit,
      description,
      locationName,
    };
  };

export default () => {
    return (
        <Provider value={client}>
            {/* map over metrics and  */}
            <Grid container>

                <Metrics/>

            </Grid>
        </Provider>
    );
};

const Metrics = () => {

    const dispatch = useDispatch();

    const metrics = useSelector(getMetricsData);
    const {locationName} = useSelector(getWeather);

    const [result] = useQuery({
        query
    });

    const { fetching, data, error } = result;

    useEffect(() => {
        if (error) {
            dispatch(actions.metricsApiErrorReceived({ error: error.message }));
            return;
        }
        if (!data) return;
        const { getMetrics } = data;
        dispatch(actions.metricsDataReceived(getMetrics));
    }, [dispatch, data, error]);

    if (fetching) return <LinearProgress />;

    console.log(metrics)
    
    return <Grid container>{
        metrics.map((metric) => {
            return (
            <Card>
                <CardContent>
                    {metric}
                </CardContent>
            </Card>
            )
        })
        } </Grid>
   
    

}
// fetch metrics here
// how would i make it show data for selected
    // subscription i guess


