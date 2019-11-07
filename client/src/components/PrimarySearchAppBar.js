import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Tooltip, ListItemIcon, ListItemText } from '@material-ui/core/';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Search from './Search';
import navBar from '../css/navBar';
import { logoutUser } from '../actions/authentication';
import { changeTheme } from '../actions/themeAction';
import { navbarTranslate } from '../translate';

const ReactLanguage = require('react-language');
ReactLanguage.setLanguage('xxx');
const useStyles = navBar;

const PrimarySearchAppBar = (props) => {

  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const username = props.auth.user.username;
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const handleMobileMenuOpen = (e) => {
    setMobileMoreAnchorEl(e.currentTarget);
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  }

  const logOut = (e) => {
    e.preventDefault();
    props.logoutUser(props.history);
  }

  const refreshHome = () => {
    if (typeof props.refresh == 'function')
      props.refresh(true);
  }

  const switchTheme = () => {
    props.changeTheme(props.theme.theme)
  }

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={switchTheme}>
        <ListItemIcon className={classes.listItemIcon}>
          <Brightness4Icon fontSize="default" />
        </ListItemIcon>
        <ListItemText primary={navbarTranslate('theme')} />
      </MenuItem>

      <MenuItem component={Link} to={`/user/${username}`}>
        <ListItemIcon className={classes.listItemIcon}>
          <AccountCircle fontSize="default" />
        </ListItemIcon>
        <ListItemText primary={navbarTranslate('profile')} />
      </MenuItem>

      <MenuItem component={Link} to='/settings'>
        <ListItemIcon className={classes.listItemIcon}>
          <SettingsIcon fontSize="default" />
        </ListItemIcon>
        <ListItemText primary={navbarTranslate('settings')} />
      </MenuItem>

      <MenuItem onClick={logOut}>
        <ListItemIcon className={classes.listItemIcon}>
          <PowerSettingsNewIcon fontSize="default" />
        </ListItemIcon>
        <ListItemText primary={navbarTranslate('logout')} />
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>

          <MenuItem component={Link} to='/' className={classes.title} onClick={refreshHome}>
            <img src="/logonav.png" alt="logo" className={classes.navlogo} />
          </MenuItem>
          <MenuItem component={Link} to='/' className={classes.smTitle} onClick={refreshHome}>
            <img src="/logosmnav.png" alt="mini logo" className={classes.miniNavlogo} />
          </MenuItem>

          <Search
            classes={classes}
            displaySearch={props.searchBar}
            updateFilms={props.updateFilms}
          />
          {!props.searchBar &&
            <div className={classes.grow} />
          }

          {!props.hideButtons &&
            <div>
              <div className={classes.sectionDesktop}>

                <Tooltip title={navbarTranslate('theme')}>
                  <IconButton
                    edge="end"
                    aria-label="switch theme"
                    className={classes.iconButton}
                    onClick={switchTheme}
                  >
                    <Brightness4Icon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={navbarTranslate('profile')}>
                  <IconButton
                    component={Link}
                    to={`/user/${username}`}
                    edge="end"
                    aria-label="account of current user"
                    className={classes.iconButton}
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>

                <Tooltip title={navbarTranslate('settings')} className={classes.tooltip}>
                  <IconButton
                    component={Link}
                    to={`/settings`}
                    edge="end"
                    aria-label="settings"
                    className={classes.iconButton}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={navbarTranslate('logout')} className={classes.tooltip}>
                  <IconButton
                    onClick={logOut}
                    edge="end"
                    aria-label="settings"
                    color="inherit"
                  >
                    <PowerSettingsNewIcon />
                  </IconButton>
                </Tooltip>
              </div>

              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </div>
          }
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
}

PrimarySearchAppBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  changeTheme: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  theme: state.theme
})

export default connect(mapStateToProps, { logoutUser, changeTheme })(withRouter(PrimarySearchAppBar));
