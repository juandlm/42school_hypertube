import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { modifySettings, getUserSettings } from '../actions/settings';
import { withStyles } from '@material-ui/core/styles';
import { Button, Container, Paper, Grid, Typography, TextField, MenuItem, Avatar } from '@material-ui/core/';
import settingsStyle from '../css/settings';
import PrimarySearchAppBar from './PrimarySearchAppBar';
import Loader from './Loader';
import { settingsTranslate } from '../translate';

const ReactLanguage = require('react-language');

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oAuth: '',
            lang: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            password_confirm: '',
            avatar: '',
            cancel: false,
            isLoading: false,
            revealPassword: false,
        }
    }

    componentDidMount = () => {
        this.getUserSettings();
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        const data = nextProps.settings.data;
        this.setState({
            oAuth: Boolean(data.oAuth),
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
        if (this.state.lang === 'fr') {
            ReactLanguage.setLanguage('fr');
            sessionStorage.setItem('lang', 'fr');
        }
        else if (this.state.lang === 'en') {
            ReactLanguage.setLanguage('en');
            sessionStorage.setItem('lang', 'en');
        }
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
        this.setState({ cancel: true });
    }

    onSubmit = (e) => {
        e.preventDefault();
        let settings = {};
        if (!this.state.oAuth)
            settings = {
                oAuth: false,
                avatar: this.state.avatar,
                lang: this.state.lang,
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                password: this.state.password,
                password_confirm: this.state.password_confirm
            }
        else
            settings = {
                oAuth: true,
                avatar: this.state.avatar,
                lang: this.state.lang
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
        const { oAuth, lang, email, firstName, lastName, password, password_confirm, revealPassword, cancel, isLoading } = this.state;

        if (!isLoading) return Loader(isLoading);

        return (
            <div className="Settings">

                <PrimarySearchAppBar searchBar={false} />

                <Container maxWidth="lg">
                    <Paper className={classes.paper}>
                        <Grid container justify="center" alignItems="center">
                            <Typography variant="h5">
                                {settingsTranslate('title')}
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
                                    label={settingsTranslate('lang')}
                                    name="lang"
                                    value={lang}
                                    onChange={this.handleInputChange}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    required
                                >
                                    <MenuItem value={'en'}>
                                        {settingsTranslate('en')}
                                    </MenuItem>
                                    <MenuItem value={'fr'}>
                                        {settingsTranslate('fr')}
                                    </MenuItem>
                                </TextField>

                                {!oAuth &&
                                    <div>
                                        <TextField
                                            name="email"
                                            label="Email"
                                            value={email}
                                            type="email"
                                            onChange={this.handleInputChange}
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                            required
                                        />

                                        <TextField
                                            name="firstName"
                                            label={settingsTranslate('firstName')}
                                            value={firstName}
                                            onChange={this.handleInputChange}
                                            inputProps={{ maxLength: 50 }}
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                            required
                                        />

                                        <TextField
                                            name="lastName"
                                            label={settingsTranslate('lastName')}
                                            value={lastName}
                                            onChange={this.handleInputChange}
                                            inputProps={{ maxLength: 50 }}
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                            required
                                        />

                                        {revealPassword ? (
                                            <div className={classes.revealPassword}>
                                                <Typography variant="h6">
                                                    {settingsTranslate('newPwd')}
                                                </Typography>
                                                <TextField
                                                    name="password"
                                                    label={settingsTranslate('pwd')}
                                                    type="password"
                                                    value={password}
                                                    onChange={this.handleInputChange}
                                                    inputProps={{
                                                        minLength: 7,
                                                        maxLength: 30
                                                    }}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required={password_confirm !== ''}
                                                    fullWidth
                                                />

                                                <TextField
                                                    name="password_confirm"
                                                    label={settingsTranslate('confPwd')}
                                                    type="password"
                                                    value={password_confirm}
                                                    onChange={this.handleInputChange}
                                                    inputProps={{
                                                        minLength: 7,
                                                        maxLength: 30
                                                    }}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required={password !== ''}
                                                    fullWidth
                                                />
                                            </div>
                                        ) : (
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    fullWidth
                                                    onClick={this.revealPassword}
                                                    className={classes.revealPassword && classes.button}
                                                >
                                                    {settingsTranslate('modifPwd')}
                                            </Button>
                                            )}
                                    </div>
                                }

                                {cancel &&
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        className={classes.button}
                                        onClick={this.getUserSettings}
                                        size="large"
                                        fullWidth
                                    >
                                        {settingsTranslate('cancel')}
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
                                    {settingsTranslate('ok')}
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
