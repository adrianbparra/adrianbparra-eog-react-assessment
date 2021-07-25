import React from 'react';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Metrics from '../Features/Metrics/Metrics';
import Chart from '../Features/Chart/Chart';

const useStyles = makeStyles({
  container: {
    marginTop: '5%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

});


const ContainerMetrics = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Metrics />
      <Chart />
    </Container>
  )
};

export default ContainerMetrics;