import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { IState } from '../../store';
import { Card, Collapse, CardActionArea, Typography, CardHeader, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const getActiveMetrics = (state: IState) => {
  const activeMetrics = state.metrics.activeMetrics;

  return activeMetrics;
};

const getAverageSelector = (state: IState) => {
  const { average } = state.chart;

  return average

}

const useStyles = makeStyles({
  cardContent: {
    textAlign: 'center',
  },
});

const MetricButton = (props: any) => {
  const { metric } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const activeMetrics = useSelector(getActiveMetrics);
  const averageSelector = useSelector(getAverageSelector);
  
  
  const getLiveMetrics = (state: IState) => {
    const metrics = state.chart.metrics;
    return metrics[metric];
  };
  
  const metricData = useSelector(getLiveMetrics);

  const onMetricUpdate = () => {
    dispatch(actions.metricsActiveUpdate(metric));
  };

  return (
    <Card>
      <CardActionArea onClick={onMetricUpdate} aria-label="show live">
        <CardHeader title={metric} />
        <Collapse in={activeMetrics.includes(metric) ? true : false} unmountOnExit>
          <CardContent className={classes.cardContent}>
            {/* <Typography>{metricData ? `${metricData.value} ${metricData.unit}` : ''}</Typography> */}
            <Typography>{ metricData ? averageSelector ? metricData.average : metricData.value : "" }</Typography>
          </CardContent>
        </Collapse>
      </CardActionArea>
    </Card>
  );
};

export default MetricButton;
