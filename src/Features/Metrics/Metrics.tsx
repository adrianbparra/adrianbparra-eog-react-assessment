import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { IState } from '../../store';
import { useEffect } from "react";
import {Grid, LinearProgress  } from "@material-ui/core";
import MetricButton from "./MetricButton";

const client = createClient({
    url: 'https://react.eogresources.com/graphql',
});

const query = `
query {
    getMetrics
  }
`;



const getMetricsData = (state: IState) => {
    const metrics = state.metrics.allMetrics;

    return metrics;
};


export default () => {
    return (
        <Provider value={client}>
            <Grid container>
                <Metrics/>
            </Grid>
        </Provider>
    );
};

const Metrics = () => {

    const dispatch = useDispatch();

    const metrics = useSelector(getMetricsData);

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


    
    return <Grid container spacing={4}>{
        metrics.map((metric) => {
            return (
            <Grid item >
                <MetricButton metric={metric} />
            </Grid>
            )
        })
        } </Grid>
   
    

}
// fetch metrics here
// how would i make it show data for selected
    // subscription i guess


