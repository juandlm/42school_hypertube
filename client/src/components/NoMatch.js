import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    height: '100vh'
  },
  image: {
    height: '100vh',
    width: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    opacity: '0.5',
    position: 'absolute'
  }
});

class NoMatch extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid
        container
        className={`${classes.root} bgGradient`}
        direction="column"
        justify="center"
        alignItems="center"
      >
        <img
          src="https://source.unsplash.com/collection/1736993"
          alt="404 Movie"
          className={classes.image}
        />
        <Typography component="h1" variant="h1" fontFamily="Monospace">
          404
        </Typography>
        <Typography component="h2" variant="h6">
          Ressources inexistantes ou indisponibles
        </Typography>
      </Grid>
    );
  }
}

export default withStyles(styles)(NoMatch);
