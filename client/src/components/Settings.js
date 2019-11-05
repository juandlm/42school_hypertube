import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { modifySettings, getUserSettings } from '../actions/settings';
import { withStyles } from '@material-ui/core/styles';
import { Button, Container, Paper, Grid, Typography, TextField, MenuItem, Avatar } from '@material-ui/core/';
import settingsStyle from '../css/settings';
import PrimarySearchAppBar from './navBar';
import classnames from 'classnames';
import Loader from './Loader';

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lang: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            password_confirm: '',
            avatar: '',
            errors: {},
            cancel: false,
            isLoading: false,
            revealPassword: false,
        }
    }

    componentDidMount = () => {
        this.getUserSettings();
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (nextProps.errors)
            this.setState({ errors: nextProps.errors });
        const data = nextProps.settings.data;
        this.setState({
            avatar: data.avatar,
            lang: data.lang,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: '',
            password_confirm: '',
            isLoading: true,
            revealPassword: false,
            cancel: false
        });
    }

    getUserSettings = () => {
        const userId = this.props.auth.user._id;
        this.props.getUserSettings(userId);
    }

    handleInputChange = (e) => {
        this.setState({ 
            [e.target.name]: e.target.value,
            cancel: true 
        });
    }

    handleInputCheckedChange = (e) => {
        this.setState({ 
            [e.target.name]: e.target.checked,
            avatar: e.target.name
        });
    }

    handleInputCheckedAvatar = (e) => {
        this[e.target.alt].click();
    }
    
    onSubmit = (e) => {
        e.preventDefault();
        let settings = {
            avatar: this.state.avatar,
            lang: this.state.lang,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password,
            password_confirm: this.state.password_confirm
        }
        this.props.modifySettings(this.props.auth.user._id, settings);
    }

    revealPassword = () => {
        this.setState({ 
            revealPassword: true,
            cancel: true
        });
    }

    avatarChange = (num) => {
        const { classes } = this.props;
        const { avatar } = this.state;

        return (
            <Grid item xs={4}>
                <Avatar 
                    alt={`${num}`}
                    src={`/avatar_pictures/${num}.png`}
                    className={(avatar === `${num}` ? classes.bigAvatarChecked : classes.bigAvatar)} 
                    onClick={this.handleInputCheckedAvatar}
                />
                <input 
                    type="checkbox"
                    ref={checkInput => this[num] = checkInput}
                    className={classes.checkbox}
                    name={num}
                    checked={avatar === `${num}`}
                    onChange={this.handleInputCheckedChange} 
                />
            </Grid>
        );
    }

    render() {
        const { classes } = this.props;
        const { lang, email, firstName, lastName, password, password_confirm, revealPassword, cancel, errors, isLoading } = this.state;

        if (!isLoading) return Loader(isLoading);

        return (
            <div className="Settings">

                <PrimarySearchAppBar searchBar={false} />

                <Container maxWidth="lg">
                    <Paper className={classes.paper}>
                        <Grid container justify="center" alignItems="center">
                            <Typography variant="h5">
                                Settings
                            </Typography>
                        </Grid>
                        <hr />
                        <form className={classes.form} onSubmit={this.onSubmit}>
                            <Container maxWidth="sm">

                                <Paper className={classes.paperAvatar}>
                                    <Grid 
                                        container 
                                        spacing={3} 
                                        justify="space-around"
                                        direction="row"
                                        alignItems="center"
                                    >
                                        {this.avatarChange(1)}
                                        {this.avatarChange(2)}
                                        {this.avatarChange(3)}
                                        {this.avatarChange(4)}
                                        {this.avatarChange(5)}
                                        {this.avatarChange(6)}
                                        {this.avatarChange(7)}
                                        {this.avatarChange(8)}
                                        {this.avatarChange(9)}
                                    </Grid>
                                </Paper>  
               
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Langue des sous-titres"
                                    name="lang"
                                    value={lang}
                                    onChange={this.handleInputChange}
                                    margin="normal"
                                    variant="outlined"
                                    className={classnames('form-control form-control-lg', {
                                        'is-invalid': errors.lang
                                    })}
                                    fullWidth
                                    required
                                >
                                    <MenuItem value={'en'}>Anglais</MenuItem>
                                    <MenuItem value={'fr'}>Français</MenuItem>
                                </TextField>
                                {errors.lang && (<div className="invalid-feedback">{errors.lang}</div>)}

                                <TextField
                                    name="email"
                                    label="Email"
                                    value={email}
                                    type="email"
                                    onChange={this.handleInputChange}
                                    variant="outlined"
                                    margin="normal"
                                    className={classnames('form-control form-control-lg', {
                                        'is-invalid': errors.email
                                    })}
                                    fullWidth
                                    required
                                />
                                {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}

                                <TextField
                                    name="firstName"
                                    label="Prénom"
                                    value={firstName}
                                    onChange={this.handleInputChange}
                                    inputProps={{ maxLength: 50 }}
                                    variant="outlined"
                                    margin="normal"
                                    className={classnames('form-control form-control-lg', {
                                        'is-invalid': errors.firstName
                                    })}
                                    fullWidth
                                    required
                                />
                                {errors.firstName && (<div className="invalid-feedback">{errors.firstName}</div>)}
                        
                                <TextField
                                    name="lastName"
                                    label="Nom"
                                    value={lastName}
                                    onChange={this.handleInputChange}
                                    inputProps={{ maxLength: 50 }}
                                    variant="outlined"
                                    margin="normal"
                                    className={classnames('form-control form-control-lg', {
                                        'is-invalid': errors.lastName
                                    })}
                                    fullWidth
                                    required
                                />
                                {errors.lastName && (<div className="invalid-feedback">{errors.lastName}</div>)}

                                {revealPassword ? (
                                    <div className={classes.revealPassword}>
                                        <Typography variant="h6">
                                            Nouveau mot de passe
                                        </Typography>
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
                                            variant="outlined"
                                            margin="normal"
                                            className={classnames('form-control form-control-lg', {
                                                'is-invalid': errors.password
                                            })}
                                            required={password_confirm !== ''}
                                            
                                            fullWidth
                                        />
                                        {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}

                                        <TextField
                                            name="password_confirm"
                                            label="Confirmation mot de passe"
                                            type="password"
                                            value={password_confirm}
                                            onChange={this.handleInputChange}
                                            inputProps={{
                                                minLength: 7,
                                                maxLength: 30
                                            }}
                                            variant="outlined"
                                            margin="normal"
                                            className={classnames('form-control form-control-lg', {
                                                'is-invalid': errors.password
                                            })}
                                            required={password !== ''}
                                            fullWidth
                                        />
                                        {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                                    </div>
                                ) : (
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        fullWidth
                                        onClick={this.revealPassword}
                                        className={classes.revealPassword && classes.button}
                                    >
                                        Modifier mot de passe
                                    </Button>
                                )}

                                {cancel &&
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        className={classes.button}
                                        onClick={this.getUserSettings}
                                        size="large"
                                        fullWidth
                                    >
                                        Annuler
                                    </Button>
                                }

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    size="large"
                                    fullWidth
                                >
                                    Confirmer
                                </Button>
                            </Container>
                        </form>
                    </Paper>
                </Container>
		    </div>
        )
    }
}

Settings.propTypes = {
    modifySettings: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    settings: state.settings,
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { modifySettings, getUserSettings })(withRouter(withStyles(settingsStyle)((Settings))))
