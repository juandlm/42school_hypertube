import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';
import { getUserSettings } from './actions/settings';
import createRouteMiddleware from './createRouteMiddleware';
import Register from './components/Register';
import RegisterValidation from './components/RegisterValidation';
import Login from './components/Login';
import LoginForgotten from './components/LoginForgotten';
import LoginNewPassword from './components/LoginNewPassword';
import Settings from './components/Settings';
import NoMatch from './components/NoMatch';
import Home from './components/Home';
import VideoView from './components/VideoView';
import User from './components/User';
import Alert from './components/Alert';
import AlertRedux from './components/AlertRedux';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { indigo } from '@material-ui/core/colors';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const ReactLanguage = require('react-language');
ReactLanguage.setLanguage(sessionStorage.getItem('lang') || 'en');

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: {
            main: indigo['500'],
        },
    }
});

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: indigo['500'],
        },
    }
});

const privateRoute = process.env.REACT_APP_IS_PRIVATE_ROUTE;
const publicRoute = process.env.REACT_APP_IS_PUBLIC_ROUTE;

class App extends React.Component {

    constructor(props) {
        super(props);
        document.body.onmousedown = e => { if (e.button === 1) return false; };
        if (localStorage.jwtToken) {
            const currentTime = Date.now() / 1000;
            const decoded = jwt_decode(localStorage.jwtToken);
			setAuthToken(localStorage.jwtToken);
			props.setCurrentUser(decoded);
			props.getUserSettings(decoded._id);
			if (decoded.exp < currentTime) {
                console.log('zobe user');
				props.logoutUser();
				window.location.href = '/login';
			}
		}
	}

    handleAlert = () => {
        let data;

        if ((data = sessionStorage.getItem('alert_success'))) {
            sessionStorage.removeItem('alert_success');
            return (<Alert message={data} variant="success" />);
        }
        if ((data = sessionStorage.getItem('alert_warning'))) {
            sessionStorage.removeItem('alert_warning');
            return (<Alert message={data} variant="warning" />);
        }
        if ((data = sessionStorage.getItem('alert_error'))) {
            sessionStorage.removeItem('alert_error');
            return (<Alert message={data} variant="error" />);
        }
        if ((data = sessionStorage.getItem('alert_info'))) {
            sessionStorage.removeItem('alert_info');
            return (<Alert message={data} variant="info" />);
        }
    }

    switchTheme = () => {
        if (localStorage.getItem('theme') === 'false')
            return (darkTheme);
        if (this.props.theme.theme)
            return (lightTheme);
        return (darkTheme);
    }

    render() {
        return (
            <MuiThemeProvider theme={this.switchTheme()}>
                <CssBaseline />
                <Router>
                    <Switch>
                        <Route exact path="/register"
                            {...createRouteMiddleware({
                                component: Register
                            }, publicRoute)} />
                        <Route exact path="/registerValidation"
                            {...createRouteMiddleware({
                                component: RegisterValidation
                            }, publicRoute)} />
                        <Route exact path="/login"
                            {...createRouteMiddleware({
                                component: Login
                            }, publicRoute)} />
                        <Route exact path="/loginForgotten"
                            {...createRouteMiddleware({
                                component: LoginForgotten
                            }, publicRoute)} />
                        <Route exact path="/loginNewPassword"
                            {...createRouteMiddleware({
                                component: LoginNewPassword
                            }, publicRoute)} />
                        <Route exact path="/"
                            {...createRouteMiddleware({
                                component: Home
                            }, privateRoute)} />
                        <Route exact path="/films"
                            {...createRouteMiddleware({
                                component: VideoView
                            }, privateRoute)} />
                        <Route exact path="/settings"
                            {...createRouteMiddleware({
                                component: Settings
                            }, privateRoute)} />
                        <Route path="/user/:user"
                            {...createRouteMiddleware({
                                component: User
                            }, privateRoute)} />
                        <Route component={NoMatch} />
                    </Switch>
                </Router>
                <AlertRedux />
                {this.handleAlert()}
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
    getUserSettings: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	theme: state.theme,
});

export default connect(mapStateToProps, { setCurrentUser, getUserSettings, logoutUser })(App);
