import React from 'react';
import { CircularProgress, Grid } from '@material-ui/core';
import circularStyle from '../css/circular';

const displayLoading = (isLoading) => {
    const circular = circularStyle;

    if (!isLoading) {
        return (
            <div className="Loader">
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '50vh' }}
                >
                    <CircularProgress className={circular.progress} />
                </Grid>
            </div>
        )
    }
}

export default displayLoading;