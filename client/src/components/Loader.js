import React from 'react';
import { CircularProgress, Grid } from '@material-ui/core';
import circularStyle from '../css/circular';

const displayLoading = (isLoading) => {
    const circular = circularStyle;

    if (!isLoading) {
        return (
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                style={{height: '100%', backgroundColor: 'rgba(29,29,29,1)'}}
            >
                <CircularProgress className={circular.progress} />
            </Grid>
        )
    }
}

export default displayLoading;