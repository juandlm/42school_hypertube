import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';
import { getUserSettings } from './actions/settings';
import createRouteMiddleware from "./createRouteMiddleware";

//import Navbar from './components/Navbar2';
import Register from './components/Register';
import Login from './components/Login';
import LoginForgotten from './components/LoginForgotten';
import LoginNewPassword from './components/LoginNewPassword';
import Settings from './components/settings';
import NoMatch from './components/NoMatch';
import Home from './components/home';
import VideoView from './components/videoView';
import User from './components/User';

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

class App extends Component {
	render() {
		return (
			<Provider store = { store }>
				<Router>
					<Switch>

						<Route exact path="/register"
							{...createRouteMiddleware({
								component: Register
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
						<Route exact path="/films"
							{...createRouteMiddleware({
								component: VideoView
							}, privateRoute)} />
						<Route exact path="/settings"
							{...createRouteMiddleware({
								component: Settings
							}, privateRoute)} />
						<Route exact path="/"
							{...createRouteMiddleware({
								component: Home
							}, privateRoute)} />
						<Route path="/user/:user"
							{...createRouteMiddleware({
								component: User
							}, privateRoute)} />
							
						<Route component={NoMatch} />

					</Switch>
				</Router>
			</Provider>
		);
	}
}

export default App;
