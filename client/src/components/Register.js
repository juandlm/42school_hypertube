import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { registerUser } from '../actions/authentication';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import { Grid, Paper, Typography } from '@material-ui/core';

import Legals from './Legals';
import styles from '../css/public';

const AdapterLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

class Register extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            password_confirm: '',
            consent: '',
            errors: {}
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.errors)
            this.setState({ errors: nextProps.errors });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            username: this.state.username,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password,
            password_confirm: this.state.password_confirm,
            consent: this.state.consent
        }
        this.props.registerUser(user, this.props.history);
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            errors: {}
        })
    }

    handleInputCheckedChange = (e) => {
        this.setState({
            [e.target.name]: e.target.checked,
            errors: {}
        });
    }

    handleLink = (e) => {
        e.preventDefault();
        document.getElementById('Legals').click();
    }

    render() {
        const { classes } = this.props;
        const { username, email, firstName, lastName, password, password_confirm, consent, errors } = this.state;
        const label = (<div><span>J'ai lu et j'accepte la </span><span className="signupConsent" onClick={this.handleLink}>politique d'utilisation des données</span></div>);

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
                            Register
                        </Typography>

                        <form className={classes.form} onSubmit={ this.handleSubmit }>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="firstName"
                                        label="Prénom"
                                        value={firstName}
                                        onChange={this.handleInputChange}
                                        inputProps={{ maxLength: 50 }}
                                        variant="filled"
                                        margin="dense"
                                        className={classnames('form-control form-control-lg', {
                                            'is-invalid': errors.firstName
                                        })}
                                        autoFocus
                                        fullWidth
                                        required
                                    />
                                    {errors.firstName && (<div className="invalid-feedback">{errors.firstName}</div>)}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="lastName"
                                        label="Nom"
                                        value={lastName}
                                        onChange={this.handleInputChange}
                                        inputProps={{ maxLength: 50 }}
                                        variant="filled"
                                        margin="dense"
                                        className={classnames('form-control form-control-lg', {
                                            'is-invalid': errors.lastName
                                        })}
                                        fullWidth
                                        required
                                    />
                                    {errors.lastName && (<div className="invalid-feedback">{errors.lastName}</div>)}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="username"
                                        label="Nom d'utilisateur"
                                        value={username}
                                        onChange={this.handleInputChange}
                                        inputProps={{
                                            minLength: 3,
                                            maxLength: 50
                                        }}
                                        variant="filled"
                                        margin="dense"
                                        className={classnames('form-control form-control-lg', {
                                            'is-invalid': errors.username
                                        })}
                                        fullWidth
                                        required
                                    />
                                    {errors.username && (<div className="invalid-feedback">{errors.username}</div>)}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        type="email"
                                        name="email"
                                        label="Email"
                                        value={email}
                                        onChange={this.handleInputChange}
                                        variant="filled"
                                        margin="dense"
                                        className={classnames('form-control form-control-lg', {
                                            'is-invalid': errors.email
                                        })}
                                        fullWidth
                                        required
                                    />
                                    {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="password"
                                        label="Mot de passe"
                                        type="password"
                                        value={password}
                                        onChange={this.handleInputChange}
                                        inputProps={{
                                            minLength: 7,
                                            maxLength: 30
                                        }}
                                        variant="filled"
                                        margin="dense"
                                        className={classnames('form-control form-control-lg', {
                                            'is-invalid': errors.password
                                        })}
                                        required
                                        fullWidth
                                    />
                                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="password_confirm"
                                        label="Confirmation mot de passe"
                                        type="password"
                                        value={password_confirm}
                                        onChange={this.handleInputChange}
                                        // helperText="Le mot de passe doit contenir au moins 7 caractères avec des chiffres et des lettres minuscules et majuscules"
                                        inputProps={{
                                            minLength: 7,
                                            maxLength: 30
                                        }}
                                        variant="filled"
                                        margin="dense"
                                        className={classnames('form-control form-control-lg', {
                                            'is-invalid': errors.password
                                        })}
                                        required
                                        fullWidth
                                    />
                                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                                </Grid>
                            </Grid>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="consent"
                                        required
                                        onChange={this.handleInputCheckedChange}
                                        color="primary"
                                        value={consent}
                                    />}
                                label={label}
                                className="mt-5"
                            />
                            {errors.remember_me && (<div className="invalid-feedback">{errors.remember_me}</div>)}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                fullWidth
                            >
                                Inscription
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link component={AdapterLink} to="/login" color="primary">
                                        Déjà membre ? Connectez-vous
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

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps,{ registerUser })(withStyles(styles)(withRouter(Register)))
