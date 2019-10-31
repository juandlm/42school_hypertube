import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginCheckNewPasswordUser, loginNewPasswordUser } from '../actions/authentication';

import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography, Link, TextField, Button } from '@material-ui/core';
import Legals from './Legals';
import styles from '../css/public';
import extractParamsUrl from '../validation/extractParams';

const AdapterLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

class LoginNewPassword extends Component {

    constructor() {
        super();
        this.state = {
            password: '',
            password_confirm: '',
            errors: {}
        }
    }

    UcomponentDidMount = () => {
        this.checkNewPassword();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
                password: '',
                password_confirm: ''
            });
        }
    }

    checkNewPassword = () => {
        const getParams = extractParamsUrl(this.props.location.search);
        const user = {
            username: getParams.username,
            token: getParams.key
        }
        console.log(getParams);
        this.props.loginCheckNewPasswordUser(user);
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            password: this.state.password,
            password_confirm: this.state.password_confirm,
        }
        this.props.loginNewPasswordUser(user);
    }

    render() {
        const { classes } = this.props;
        const { password, password_confirm, errors } = this.state;

        return (
            <Grid container component="main" className={classes.root}>
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
                            Nouveau mot de passe
                        </Typography>
                        <Typography component="h2" variant="subtitle1" className={classes.subtitle}>
                            Vous pouvez maintenant réinitialiser votre mot de passe.
                        </Typography>
                        <form className={classes.form} onSubmit={ this.handleSubmit }>
                            <TextField
                                name="password"
                                label="Mot de passe"
                                type="password"
                                className={classnames('form-control form-control-lg', {
                                    'is-invalid': errors.password
                                })}
                                value={password}
                                onChange={this.handleInputChange}
                                inputProps={{
                                    minLength: 7,
                                    maxLength: 30
                                }}
                                variant="filled"
                                margin="normal"
                                autoComplete="current-password"
                                required
                                fullWidth
                            />
                            {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                            <TextField
                                name="password_confirm"
                                label="Confirmation mot de passe"
                                type="password"
                                className={classnames('form-control form-control-lg', {
                                    'is-invalid': errors.password
                                })}
                                // helperText="Le mot de passe doit contenir au moins 7 caractères avec des chiffres et des lettres minuscules et majuscules"
                                value={password_confirm}
                                onChange={this.handleInputChange}
                                inputProps={{
                                    minLength: 7,
                                    maxLength: 30
                                }}
                                variant="filled"
                                margin="normal"
                                autoComplete="current-password"
                                required
                                fullWidth
                            />
                            {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                fullWidth
                            >
                                Confirmer
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link component={AdapterLink} to="/login" color="primary">
                                        Retour
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

LoginNewPassword.propTypes = {
    loginNewPasswordUser: PropTypes.func.isRequired,
    loginCheckNewPasswordUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { loginCheckNewPasswordUser, loginNewPasswordUser })(withStyles(styles)(LoginNewPassword))
