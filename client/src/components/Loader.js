import React from 'react';
import { CircularProgress, Grid } from '@material-ui/core';
import circularStyle from '../css/circular';
import PrimarySearchAppBar from './PrimarySearchAppBar';

const displayLoading = (isLoading) => {
    const circular = circularStyle;

    if (!isLoading) {
        return (
            <div className="Loader">
                <PrimarySearchAppBar
                    searchBar={false}
                    hideButtons={true}
                />
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '90vh' }}
                >
                    <CircularProgress className={circular.progress} />
                </Grid>
            </div>
        )
    }
}

export default displayLoading;