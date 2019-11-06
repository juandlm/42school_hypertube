import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core/';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Search from './Search';
import navBar from '../css/navBar';
import { logoutUser } from '../actions/authentication';
import Brightness2Icon from '@material-ui/icons/Brightness2';

import { changeTheme } from '../actions/themeAction';

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
      <MenuItem component={Link} to={`/user/${username}`}>
        <IconButton
          aria-label="account of current user"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        Profile
      </MenuItem>

      <MenuItem component={Link} to='/settings'>
        <IconButton
          aria-label="settings"
          aria-haspopup="true"
          color="inherit"
        >
          <SettingsIcon />
        </IconButton>
        Settings
      </MenuItem>

      <MenuItem onClick={logOut}>
        <IconButton
          aria-label="logout"
          aria-haspopup="true"
          color="inherit"
        >
          <PowerSettingsNewIcon />
        </IconButton>
        Logout
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

              <Tooltip title="Toggle light/dark theme">
                  <IconButton
                    edge="end"
                    aria-label="switch theme"
                    className={classes.iconButton}
                    onClick={switchTheme}
                  >
                    <Brightness2Icon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Profile">
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

                <Tooltip title="Settings" className={classes.tooltip}>
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

                <Tooltip title="Logout" className={classes.tooltip}>
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
