import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { modifySettings, getUserSettings } from '../actions/settings';
import { withStyles } from '@material-ui/core/styles';
import { Button, Container, Paper, Grid, Typography, TextField, MenuItem } from '@material-ui/core/';
import settingsStyle from '../css/settings';
import PrimarySearchAppBar from './navBar';
import classnames from 'classnames';
import Loader from './Loader';

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lang: '',
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            password_confirm: '',

            avatar: '',
            errors: {},

            isLoading: false,
            revealPassword: false,
        }
    }

    componentDidMount = () => {
        this.getUserSettings();
    }

    getUserSettings = () => {
        const userId = this.props.auth.user._id;
        this.props.getUserSettings(userId);
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (nextProps.errors)
            this.setState({ errors: nextProps.errors });
        const data = nextProps.settings.data;
        this.setState({
            lang: data.lang,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            isLoading: true,
        });
    }

	// componentDidMount(){
	// 	this.setState({ lang: this.props.settings.data.langue || '' });
    //     /*store.subscribe(() => {
    //         const settings = store.getState().settings.data
    //         console.log(this.props.settings.data)
    //         if (this.props.settings.data !== settings){
    //             console.log(store.getState())
    //         }
    //     })*/
    // 	}

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
       
    }
    

    /*static getDerivedStateFromProps(props, current_state) {
        console.log(props)
        console.log(current_state)
    if (props.settings.data !== current_state.settings.data) {
            console.log('new props')
    return {
        value: props.value
    }
    }
    }*/

    // UNSAFE_componentWillReceiveProps(nextProps) {
	// 	//console.log(nextProps)
    //     if (nextProps.errors)
    //         this.setState({ errors: nextProps.errors });
	// 	if (nextProps.settings) {
	// 		console.log(nextProps.settings)
	// 		this.setState({
	// 			lang:nextProps.settings.data.langue,
	// 			settings: nextProps.settings.data
	// 		});
	// 	}
    // }

    // handleOpenMenu() {
    //     this.setState({ isMenuOpen: true });
    // }

    // handleCloseMenu() {
    //     this.setState({ isMenuOpen: false });
    // }

    // handleMenuChange(e) {
    //     this.setState({ lang:e.target.value });
    // }

    // handleSettings(e){
    //     //e.preventDefault()
    //     this.props.modifySettings(this.props.auth.user._id, {
    //         name: this.state.name,
    //         email: this.state.email,
    //         password: this.state.password,
    //         password_confirm: this.state.password_confirm,
    //         lang:this.state.lang
    //     })
    // }

    //password
    // $2a$10$mmDWnj3si0fVSkjwEuwmBOAmlwyyIATEyddZogqFRBP2V15BxQlrG

    onSubmit = (e) => {
        e.preventDefault();
        let settings = {
            lang: this.state.lang,
            username: this.state.username,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password,
            password_confirm: this.state.password_confirm
        }
        this.props.modifySettings(this.props.auth.user._id, settings);
    }

    revealPassword = () => {
        this.setState({ revealPassword: true });
    }

    // ---> modifier: OK langue, OK nom, OK prenom, OK password, OK email, (OK username ?), manque image
    render() {
        const { classes } = this.props;
        const { lang, username, email, firstName, lastName, password, password_confirm, revealPassword, errors, isLoading } = this.state;

        if (!isLoading) return Loader(isLoading);

        return(
            <div className="Settings">
       
                <PrimarySearchAppBar 
                    searchBar={false} 
                    // location={window.location.href} 
                    // key={Date.now()}
                />

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
                                    name="username"
                                    label="Nom d'utilisateur"
                                    value={username}
                                    onChange={this.handleInputChange}
                                    inputProps={{
                                        minLength: 3,
                                        maxLength: 50
                                    }}
                                    variant="outlined"
                                    margin="normal"
                                    className={classnames('form-control form-control-lg', {
                                        'is-invalid': errors.username
                                    })}
                                    fullWidth
                                    required
                                />
                                {errors.username && (<div className="invalid-feedback">{errors.username}</div>)}

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
                                            required
                                            fullWidth
                                        />
                                        {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}

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
                                            variant="outlined"
                                            margin="normal"
                                            className={classnames('form-control form-control-lg', {
                                                'is-invalid': errors.password
                                            })}
                                            required
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



                        {/* <div className="container" style={{ marginTop: '50px', width: '700px'}}> */}
                        {/* <CssBaseline /> */}
                            {/* <h2 style={{marginBottom: '40px'}}>Modifier</h2>
                            <form>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="demo-controlled-open-select">Langue</InputLabel>
                                    <Select
                                        onClose={this.handleCloseMenu.bind(this)}
                                        onOpen={this.handleOpenMenu.bind(this)}
                                        value={this.state.lang}
                                        onChange={this.handleMenuChange.bind(this)}
                                        inputProps={{
                                            name: '',
                                            id: 'demo-controlled-open-select',
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={'en'}>Anglais</MenuItem>
                                        <MenuItem value={'fr'}>Français</MenuItem>
                                    </Select>
                                </FormControl>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Changer le nom d'utilisateur"
                                    className={classnames('form-control form-control-lg', {
                                        'is-invalid': errors.name
                                    })}
                                    name="name"
                                    onChange={ this.handleInputChange }
                                    value={ this.state.name }
                                />
                                {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Changer l'email"
                                    className={classnames('form-control form-control-lg', {
                                        'is-invalid': errors.email
                                    })}
                                    name="email"
                                    onChange={ this.handleInputChange }
                                    value={ this.state.email }
                                />
                                {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Changer le mot de passe"
                                    className={classnames('form-control form-control-lg', {
                                        'is-invalid': errors.password
                                    })}
                                    name="password"
                                    onChange={ this.handleInputChange }
                                    value={ this.state.password }
                                />
                                {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Confirmer le nouveau mot de passe"
                                    className={classnames('form-control form-control-lg', {
                                        'is-invalid': errors.password_confirm
                                    })}
                                    name="password_confirm"
                                    onChange={ this.handleInputChange }
                                    value={ this.state.password_confirm }
                                />
                                {errors.password_confirm && (<div className="invalid-feedback">{errors.password_confirm}</div>)}
                            </div>
                            <div className="form-group">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSettings.bind(this)}
                                    className={classes.submit}
                                >
                                    Confirmer
                                </Button>
                            </div>
                        </form> */}
                    {/* </div> */}
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
