import React, { Component } from 'react';
import axios from 'axios';
import NoMatch from './NoMatch';
import PrimarySearchAppBar from './navBar';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
        color: '#fff',
        backgroundColor: indigo[500],
    },

});

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.match.params.user,
            userInfo: [],
            isUserExist: false,
        }
    }

    componentDidMount = () => {
        this.getUserInfo(this.state.username);
    }

    getUserInfo = (username) => {
        axios.post('/api/users/getUserInfo', { 'username': username }, { 'Content-Type': 'application/json' })
        .then((res) => {
            if(res.data != null) {
                console.log(res.data)
                this.setState({
                    userInfo: res.data,
                    isUserExist: true
                })
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // ************************************************

    render() {
        const { classes } = this.props;
        const { userInfo, isUserExist } = this.state;
        return (
 
            <div className="User">

                {!isUserExist ? (
                    <NoMatch />
                ) : (

                    <div>
                        <PrimarySearchAppBar 
                            searchBar={true} 
                            // refresh={this.refreshComponent.bind(this)} 
                            //  updateFilms={this.updateFilms.bind(this)} 
                        />

                        <Container maxWidth="lg">
                            <Paper className={classes.paper}>
                                <Grid container justify="center" alignItems="center">
                                    <Avatar className={classes.bigAvatar}>Avatar</Avatar>
                                </Grid>
                                <hr />
                                <Typography variant="subtitle1">
                                    Username : {userInfo.username}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Full name : {userInfo.firstName} {userInfo.lastName}
                                </Typography>
                            </Paper>
                        </Container>
                    </div>
                )}
            </div>
        )
    }
}

export default withStyles(styles)(User);