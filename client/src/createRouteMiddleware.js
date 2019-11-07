import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

// auth: state.auth
const mapStateToProps = (state) => ({ auth: state.auth });
const publicRoute = process.env.REACT_APP_IS_PUBLIC_ROUTE
const privateRoute = process.env.REACT_APP_IS_PRIVATE_ROUTE

function createRouteMiddleware({ component }, type) {
    const PrivateRoute = ({ auth, ...rest }) => {
        // ----> routes ou le user est log
        if (auth.isAuthenticated && type === privateRoute)
            return React.createElement(component, rest);

        // ----> routes ou le user n'est pas log
        if (!auth.isAuthenticated && type === publicRoute)
            return React.createElement(component, rest);

        return <Redirect to={{ pathname: type === privateRoute ? "/register" : "/", state: { from: rest.location } }} />;
    };

    const ConnectedComponent = connect(mapStateToProps)(PrivateRoute);

    return {
        render: props => <ConnectedComponent {...props} />
    };
}

export default createRouteMiddleware;
