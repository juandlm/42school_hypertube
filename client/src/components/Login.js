import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import extractParamsUrl from '../validation/extractParams';
import { loginUser } from '../actions/authentication';
import jsonwebtoken from 'jsonwebtoken'
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography, Link, TextField, Button, ButtonGroup } from '@material-ui/core';
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

    componentDidMount() {
        const getParams = extractParamsUrl(this.props.location.search)

        if (getParams.oauth) {
            let decoded = new Buffer.from(decodeURIComponent(getParams.oauth), 'base64').toString('utf8'),
                verified
            jsonwebtoken.verify(decoded.replace('Bearer ', ''), 'LeStageApproche2019', function (err, token) {
                if (!err)
                    verified = token
            })
            if (verified) {
                localStorage.setItem('jwtToken', decoded)
                window.location.reload()
            } else {
                return false
            }
        }
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

    handleFortyTwo = (e) => {
        e.preventDefault();
        this.props.fortyTwo();
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
                            alt="Hypertube logo"
                            height="80px"
                            width="auto"
                            className="mb-5"
                        />
                        <Typography component="h1" variant="h5">
                            Connection
                        </Typography>
                        <form className={classes.form} onSubmit={this.handleSubmit}>
                            <TextField
                                name="email"
                                label="Username (or email)"
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
                                label="Password"
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
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                fullWidth
                            >
                                Connection
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link component={AdapterLink} to="/loginForgotten" color="primary">
                                        Forgotten password ?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link component={AdapterLink} to="/register" color="primary">
                                        Not yet a member ? Sign up
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                        <Grid container spacing={5} className="mt-3">
                            <Grid item xl={12} >
                                <Typography variant="h6" className="d-flex justify-content-center mb-4">
                                    You can also connect via
                                </Typography>

                                <ButtonGroup fullWidth>
                                    <Button
                                        href="http://localhost:5000/api/oauth/42"
                                        variant="contained"
                                        color="default"
                                        className={classes.button}
                                    >
                                        <img with="35px" height="28px" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" alt="42" />
                                    </Button>

                                    <Button
                                        href="http://localhost:5000/api/oauth/github"
                                        variant="contained"
                                        color="default"
                                        className={classes.button + ' ' + classes.gitHubButton}
                                    >
                                        <i className="fab fa-github fa-2x fa-fw"></i>
                                    </Button>

                                    <Button
                                        href="http://localhost:5000/api/oauth/google"
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button + ' ' + classes.googleButton}
                                    >
                                        <i className="fab fa-google fa-2x fa-fw"></i>
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
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
