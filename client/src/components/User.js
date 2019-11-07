import React, { Component } from 'react';
import axios from 'axios';
import PrimarySearchAppBar from './PrimarySearchAppBar';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Container, Avatar, Typography, Paper } from '@material-ui/core';
import userStyle from '../css/user';
import Loader from '../components/Loader';
import { userTranslate } from '../translate';

const ReactLanguage = require('react-language');
ReactLanguage.setLanguage('xxx');

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: props.match.params.user,
            userInfo: [],
            films: '',
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
                    this.setState({
                        userInfo: res.data,
                        isLoading: true
                    })
                } else {
                    this.props.history.push('/');
                }
            })
            .catch((error) => {
                return false
            });
    }

    // getFilms
    // Les infos des 10 derniers films vu par l'user sont dans this.state.userInfo.films_seen !
    // Gerer la recup des infos des films avec getFilms
    // Gerer l'affichage

    render() {
        const { classes } = this.props;
        const { userInfo, isLoading } = this.state;

        if (!isLoading)
            return Loader(isLoading);

        return (
            <div className="User">
                <div>
                    <PrimarySearchAppBar searchBar={false} />
                    <Container maxWidth="lg">
                        <Paper className={classes.paper}>
                            <Grid container justify="center" alignItems="center">
                                <Avatar
                                    alt="avatar"
                                    src={`/avatar_pictures/${userInfo.avatar}.png`}
                                    className={classes.bigAvatar} />
                            </Grid>
                            <hr />
                            <Typography variant="subtitle1">
                                {userTranslate('username')} : {userInfo.username}
                            </Typography>
                            <Typography variant="subtitle1">
                                {userTranslate('name')} : {userInfo.firstName} {userInfo.lastName}
                            </Typography>

                            <Typography variant="subtitle1">
                                {userTranslate('lastMovies')}  :<br /><br />
                            </Typography>

                            {this.state.userInfo.films_seen.map((film, index) => (
                                <p key={index}>{film.title}</p>
                            ))}
                        </Paper>
                    </Container>
                </div>
                {Loader(isLoading)}
            </div>
        )
    }
}

export default withStyles(userStyle)(User);