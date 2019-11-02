import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginForgottenUser } from '../actions/authentication';

import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography, Box, Link, TextField, Button } from '@material-ui/core';
import Legals from './Legals';
import styles from '../css/public';

const AdapterLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

class LoginForgotten extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            send: false,
            errors: {}
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.errors)
            this.setState({ errors: nextProps.errors });
        if (nextProps.send)
            this.setState({ send: true });
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
            email: this.state.email
        }
        this.props.loginForgottenUser(user);
    }

    beforeSubmit = () => {
        const { classes } = this.props;
        const { email, errors } = this.state;

        return (
            <div>
                <Typography component="h2" variant="subtitle1" className={classes.subtitle}>
                    Saisissez l’adresse email de votre compte afin de recevoir des instructions pour réinitialiser votre mot de passe.
                </Typography>
                <TextField
                    name="email"
                    label="Email"
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    fullWidth
                >
                    Continuer
                </Button>
            </div>
        );
    }

    afterSubmit = () => {
        const { classes } = this.props;

        return (
            <div>
                <Typography className={classes.subtitle}>
                    Un email vient de vous être envoyé à cette adresse:
                </Typography>
                <Paper>
                    <Box m={3} p={3} textAlign="center">
                        {this.state.email}
                    </Box>
                </Paper>
                <Typography paragraph>
                    Pour réinitialiser votre mot de passe veuillez cliquer dans cet email et suivre les instructions. Attention le lien dans l’email expirera rapidement. Pensez donc à vérifier dès maintenant !<br />
                </Typography>
            </div>
        );
    }

    render() {
        const { classes } = this.props;
        const { send } = this.state;
        const content = (send) ? this.afterSubmit() : this.beforeSubmit();

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
                            Mot de passe oublié ?
                        </Typography>

                        <form className={classes.form} onSubmit={ this.handleSubmit }>
               
                            {content}

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

LoginForgotten.propTypes = {
    loginForgottenUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    send: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
    send: state.send
})

export default connect(mapStateToProps, { loginForgottenUser })(withStyles(styles)(LoginForgotten))
