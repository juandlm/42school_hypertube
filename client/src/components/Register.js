import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { registerUser } from '../actions/authentication';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField, FormControlLabel, Checkbox, Link, Grid, Paper, Typography } from '@material-ui/core';
import styles from '../css/public';
import Legals from './Legals';

const AdapterLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const GitHubButton = withStyles(theme => ({
    root: {
      color: '#FFFFFF',
      backgroundColor: '#24292e',
      '&:hover': {
        backgroundColor: '#000000',
      },
    },
  }))(Button);

const FacebookButton = withStyles(theme => ({
    root: {
      color: '#FFFFFF',
      backgroundColor: '#3b5998',
      '&:hover': {
        backgroundColor: '#2f477a',
      },
    },
  }))(Button);

const GoogleButton = withStyles(theme => ({
    root: {
      color: '#FFFFFF',
      backgroundColor: '#db3236',
      '&:hover': {
        backgroundColor: '#b72024',
      },
    },
  }))(Button);

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
                        <div className="text-center mt-4 w-75">
                        <h6 className="font-weight-bold">Vous pouvez également vous enregistrer à travers de</h6>
                        <div className="d-flex justify-content-between mt-3">
                            <a href="http://localhost:5000/api/oauth/42" style={{ textDecoration: 'none' }}>
                                <Button
                                variant="contained"
                                color="default"
                                className={classes.button}
                                >
                                <img with="35px" height="28px" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" alt="42" />
                                </Button>
                            </a>
                            <a href="http://localhost:5000/api/oauth/github" style={{ textDecoration: 'none' }}>
                                <GitHubButton
                                variant="contained"
                                color="default"
                                className={classes.button}
                                >
                                <i className="fab fa-github fa-2x fa-fw"></i>
                                </GitHubButton>
                            </a>
                            <a href="http://localhost:5000/api/oauth/google" style={{ textDecoration: 'none' }}>
                                <GoogleButton
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                >
                                <i className="fab fa-google fa-2x fa-fw"></i>
                                </GoogleButton>
                            </a>      
                            <a href="http://localhost:5000/api/oauth/facebook" style={{ textDecoration: 'none' }}>
                                <FacebookButton
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                >
                                <i className="fab fa-facebook-f fa-2x fa-fw"></i>
                                </FacebookButton>
                            </a>
                            </div>
                        </div>                       
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
