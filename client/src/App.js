import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';
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
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


if (localStorage.jwtToken) {
	const currentTime = Date.now() / 1000;
	const decoded = jwt_decode(localStorage.jwtToken);

	setAuthToken(localStorage.jwtToken);
	store.dispatch(setCurrentUser(decoded));
	store.dispatch(getUserSettings(decoded._id));
	if (decoded.exp < currentTime) {
		store.dispatch(logoutUser());
		window.location.href = '/login';
	}
}

const privateRoute = process.env.REACT_APP_IS_PRIVATE_ROUTE;
const publicRoute = process.env.REACT_APP_IS_PUBLIC_ROUTE;

const App = () => {

	const handleAlert = () => {
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

	return (
		<Provider store={store}>
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
			{handleAlert()}
		</Provider>
	);
}

export default App;
