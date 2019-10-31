import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { modifySettings, getUserSettings } from '../actions/settings';
import classnames from 'classnames';
// import store from '../store';

import registerStyle from '../css/register';
import { 
    Button, 
    // CssBaseline,
    InputLabel, 
    MenuItem, 
    FormControl, 
    Select 
} from '@material-ui/core/';

import PrimarySearchAppBar from './navBar';

function style() {
	return registerStyle;
}

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirm: '',
            errors: {},
		    isMenuOpen:false,
			lang: '',
			settings: ''
        }
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

	componentDidMount(){
		this.setState({ lang: this.props.settings.data.langue || '' });
        /*store.subscribe(() => {
            const settings = store.getState().settings.data
            console.log(this.props.settings.data)
            if (this.props.settings.data !== settings){
                console.log(store.getState())
            }
        })*/
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

    componentWillReceiveProps(nextProps) {
		//console.log(nextProps)
        if (nextProps.errors)
            this.setState({ errors: nextProps.errors });
		if (nextProps.settings) {
			console.log(nextProps.settings)
			this.setState({
				lang:nextProps.settings.data.langue,
				settings: nextProps.settings.data
			});
		}
    }

    handleOpenMenu(type) {
        this.setState({ isMenuOpen:true });
    }

    handleCloseMenu() {
        this.setState({ isMenuOpen:false });
    }

    handleMenuChange(e) {
        this.setState({ lang:e.target.value });
    }

    handleSettings(e){
        //e.preventDefault()
        this.props.modifySettings(this.props.auth.user._id, {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirm: this.state.password_confirm,
            lang:this.state.lang
        })
    }

	// ---> modifier langue, nom, prenom, password, email, image
    render() {
		const classes = style();
        const { errors } = this.state;
        return(
            <div>
                <PrimarySearchAppBar 
                    searchBar={false} 
                    location={window.location.href} 
                    key={Date.now()}
                />
                <div className="container" style={{ marginTop: '50px', width: '700px'}}>
                {/* <CssBaseline /> */}
                    <h2 style={{marginBottom: '40px'}}>Modifier</h2>
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
                </form>
            </div>
		</div>
        )
    }
}

Settings.propTypes = {
    modifySettings: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
	auth:PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    settings: state.settings,
	auth:state.auth
});

export default connect(mapStateToProps, { modifySettings, getUserSettings })(withRouter(Settings))
