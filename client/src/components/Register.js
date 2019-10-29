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

const styles = theme => ({
    root: {
        height: '100vh'
    },
    image: {
        height: '100vh',
        width: '100%',
        opacity: '0.8',
        objectFit: 'cover',
        objectPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw'
    },
    legals: {
        margin: theme.spacing(0, 4),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100vw'
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    test: {
        // zIndex: '50',
        color: '#e91e63'
    }
});

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
            errors: {}
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.state.username,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password,
            password_confirm: this.state.password_confirm
        }
        this.props.registerUser(user, this.props.history);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
			  // Plu besoin de ca, c'est gere par le router
        /*if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/')
        }*/
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    // componentDidMount() {
			// Plu besoin de ca, c'est gere par le router
      /*  if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        } */
    // }

    handleInputCheckedChange = (event) => {
        const { checked, name } = event.target;
        this.setState({
            [name]: checked
        });
    }

    handleLink = (event) => {
        event.preventDefault();
        document.getElementById('Legals').click();
    }

    render() {
        const { classes } = this.props;
        const { username, email, firstName, lastName, password, password_confirm, errors } = this.state;
        const label = (<div><span>J'ai lu et j'accepte la </span><span className="signupConsent" onClick={this.handleLink}>politique d'utilisation des données</span></div>);

        return (
            <Grid container component="main" className={classes.root} >

                <Grid item xs={false} sm={4} md={7} className="bgGradient">
                    <img
                        src="https://source.unsplash.com/collection/1736993"
                        alt="Movie"
                        className={classes.image}
                    />
                </Grid>
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
                            helperText="Le mot de passe doit contenir au moins 8 caractères avec des chiffres et des lettres minuscules et majuscules"
                            inputProps={{
                                minLength: 7,
                                maxLength: 30
                            }}
                            variant="filled"
                            margin="dense"
                            className={classnames('form-control form-control-lg', {
                                'is-invalid': errors.password_confirm
                            })}
                            required
                            fullWidth
                        />
                        {errors.password_confirm && (<div className="invalid-feedback">{errors.password_confirm}</div>)}
                    </Grid>
                </Grid>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="consent"
                            onChange={this.handleInputCheckedChange}
                            color="primary"
                        />}
                    label={label}
                    className="mt-4"
                />
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

    // render() {
    //     const { classes } = this.props;
    //     const { errors } = this.state;

    //     return(
	// 	<div>
	// 	<PrimarySearchAppBar searchBar={false} location={window.location.href} key={Date.now()}/>

    //     <div className="container" style={{ marginTop: '50px', width: '700px'}}>
	// 		<CssBaseline />
    //         <h2 style={{marginBottom: '40px'}}>Registration</h2>
    //         <form onSubmit={ this.handleSubmit }>
    //             <div className="form-group">
    //                 <input
    //                 type="text"
    //                 placeholder="Name"
    //                 className={classnames('form-control form-control-lg', {
    //                     'is-invalid': errors.name
    //                 })}
    //                 name="name"
    //                 onChange={ this.handleInputChange }
    //                 value={ this.state.name }
    //                 />
    //                 {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
    //             </div>
    //             <div className="form-group">
    //                 <input
    //                 type="email"
    //                 placeholder="Email"
    //                 className={classnames('form-control form-control-lg', {
    //                     'is-invalid': errors.email
    //                 })}
    //                 name="email"
    //                 onChange={ this.handleInputChange }
    //                 value={ this.state.email }
    //                 />
    //                 {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
    //             </div>
    //             <div className="form-group">
    //                 <input
    //                 type="password"
    //                 placeholder="Password"
    //                 className={classnames('form-control form-control-lg', {
    //                     'is-invalid': errors.password
    //                 })}
    //                 name="password"
    //                 onChange={ this.handleInputChange }
    //                 value={ this.state.password }
    //                 />
    //                 {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
    //             </div>
    //             <div className="form-group">
    //                 <input
    //                 type="password"
    //                 placeholder="Confirm Password"
    //                 className={classnames('form-control form-control-lg', {
    //                     'is-invalid': errors.password_confirm
    //                 })}
    //                 name="password_confirm"
    //                 onChange={ this.handleInputChange }
    //                 value={ this.state.password_confirm }
    //                 />
    //                 {errors.password_confirm && (<div className="invalid-feedback">{errors.password_confirm}</div>)}
    //             </div>
    //             <div className="form-group">
    //                 <Button
	// 				type="submit"
	// 				fullWidth
	// 				variant="contained"
	// 				color="primary"
	// 				className={classes.submit}>
    //                     Sign Up
    //                 </Button>
    //             </div>
    //         </form>
    //     </div>
	// 	</div>
    //     )
    // }
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
