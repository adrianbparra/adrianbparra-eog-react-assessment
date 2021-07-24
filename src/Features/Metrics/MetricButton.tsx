import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { IState } from '../../store';
import { Button } from "@material-ui/core";

const getActiveMetrics = (state: IState) => {
    const activeMetrics = state.metrics.activeMetrics;

    return activeMetrics
};

const MetricButton = (props: any) => {
    const { metric } = props;

    const dispatch = useDispatch();

    const activeMetrics = useSelector(getActiveMetrics);

    const onMetricUpdate = () => {

        dispatch(actions.metricsActiveUpdate(metric));

    }


    return (
        <Button variant="contained" color={activeMetrics.includes(metric) ? "primary" : "default"} onClick={onMetricUpdate}>
            {metric}
        </Button>
    )

};

export default MetricButton