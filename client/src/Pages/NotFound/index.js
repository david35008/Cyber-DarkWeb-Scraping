import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'center',
    textAlign: 'center',
  },
  h3: {
    fontSize: '50px',
  },
  p: {
    fontSize: '30px',
  },
  goHome: {
    width: '200px',
    fontSize: '30px',
    margin: 'auto',
  },
}));
const NotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h3 className={classes.h3}>404 page not found</h3>
      <p className={classes.p}>We are sorry but the page you are looking for does not exist.</p>
      <Link to="/"><div className={classes.goHome}>Go Home</div></Link>
    </div>
  );
};

export default NotFound;
