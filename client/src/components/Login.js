import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';

import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography, Link, Checkbox, FormControlLabel, TextField, Button } from '@material-ui/core';
import styles from '../css/public';
import Legals from './Legals';


const AdapterLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: {}
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.errors)
            this.setState({ errors: nextProps.errors });
        if (nextProps.errors.email)
            this.setState({ email: '', password: '' });
        if (nextProps.errors.password)
            this.setState({ password: '' });
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            errors: {}
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
        }
        this.props.loginUser(user);
    }

    render() {
        const { classes } = this.props;
        const { email, password, errors } = this.state;

        return (
            <Grid container component="main" className={classes.root} >
                <Grid item xs={false} sm={4} md={7} className={classes.image}></Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square container>
                    <div className={classes.paper}>
                        <img
                            src="/logo.png"
                            alt="Logo Hypertube"
                            height="80px"
                            width="auto"
                            className="mb-5"
                        />
                        <Typography component="h1" variant="h5">
                            Connexion
                        </Typography>
                        <form className={classes.form} onSubmit={ this.handleSubmit }>
                            <TextField
                                name="email"
                                label="Nom d'utilisateur (ou email)"
                                value={email}
                                onChange={this.handleInputChange}
                                inputProps={{
                                    minLength: 3,
                                    maxLength: 50
                                }}
                                variant="filled"
                                margin="normal"
                                autoFocus
                                fullWidth
                                required
                                className={classnames('form-control form-control-lg', {
                                    'is-invalid': errors.email
                                })}
                            />
                            {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                            <TextField
                                name="password"
                                label="Mot de passe"
                                type="password"
                                className={classnames('form-control form-control-lg', {
                                    'is-invalid': errors.password
                                })}
                                value={password}
                                onChange={this.handleInputChange}
                                variant="filled"
                                margin="normal"
                                autoComplete="current-password"
                                required
                                fullWidth
                            />
                            {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="rememberMe"
                                        onChange={this.handleInputCheckedChange}
                                        color="primary"
                                    />}
                                label="Se souvenir de moi"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                fullWidth
                            >
                                Connexion
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link component={AdapterLink} to="/loginForgotten" color="primary">
                                        Mot de passe oublié ?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link component={AdapterLink} to="/register" color="primary">
                                        Pas encore membre ? Inscrivez-vous
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <div className={classes.legals}>
                        <Legals />
                    </div>
                </Grid>
            </Grid>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { loginUser })(withStyles(styles)(Login))
