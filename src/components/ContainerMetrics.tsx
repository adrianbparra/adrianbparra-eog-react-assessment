import React from 'react';
import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Metrics from '../Features/Metrics/Metrics';

// will hold the data that will be visualized
// grid with the metrics
// metric accordion


// chart with metric data when selected

const useStyles = makeStyles({
    container: {
      margin: '5% 20%',
    },
  });
  

const ContainerMetrics = () => {
    const classes = useStyles();
    return (
        <Container className={classes.container} fixed>
            <Metrics/>
            
        </Container>
    )
};

export default ContainerMetrics;