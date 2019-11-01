import React, { Component } from 'react';
import axios from 'axios';
import PrimarySearchAppBar from './navBar';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Container, Avatar, Typography, Paper } from '@material-ui/core';
import userStyle from '../css/user';
import Loader from '../components/Loader';

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: props.match.params.user,
            userInfo: [],
            isUserExist: false,
            isLoading: false
        }
    }

    componentDidMount = () => {
        this.getUserInfo(this.state.username);
    }

    getUserInfo = (username) => {
        axios.post('/api/users/getUserInfo', { 'username': username }, { 'Content-Type': 'application/json' })
        .then((res) => {
            if (res.data != null) {
                console.log('data', res.data)
                this.setState({
                    userInfo: res.data,
                    isLoading: true,
                    isUserExist: true
                })
            } else {
                this.props.history.push('/');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        const { classes } = this.props;
        const { userInfo, isUserExist, isLoading } = this.state;

        if (!isUserExist) 
            return Loader(isLoading);

        return (
            <div className="User">
                <div>
                    <PrimarySearchAppBar 
                        // searchBar={true} 
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

                            <Typography variant="subtitle1">
                            <br /><br /><strong>Peux être rajouter les derniers films vu...</strong>
                            </Typography>
                        </Paper>
                    </Container>
                </div>
                {Loader(isLoading)}
            </div>
        )
    }
}

export default withStyles(userStyle)(User);