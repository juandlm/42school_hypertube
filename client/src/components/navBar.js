import React from 'react';
//import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
/* import { fade, makeStyles } from '@material-ui/core/styles'; */
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MoreIcon from '@material-ui/icons/MoreVert';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Search from './search';
import navBar from '../css/navBar';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';


const useStyles = navBar;

function PrimarySearchAppBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(null);

  const {isAuthenticated, user} = props.auth;

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose(location) {
    setMobileMoreAnchorEl(null);
  }

  function logOut(e){
    e.preventDefault();
    props.logoutUser(props.history);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
    //setLocation(props.location)
    if (typeof props.refresh == 'function'){
      props.refresh(true)
      console.log('refresh')
    }
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const toggleDrawer = (flag) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(flag)
  };

  const userLogin = (
  <div>
    <List>
      <ListItem button key={'Register'} component={Link} to='/register'>
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        <ListItemText primary={'Register'} />
      </ListItem>
      <Divider />
      <ListItem button key={'Login'} component={Link} to='/login'>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary={'Login'} />
      </ListItem>
    </List>
  </div>
)

  const userLogout = (
    <div>
      <ListItem button key={'Logout'} component={Link} to='/' onClick={logOut}>
        <ListItemIcon><HighlightOffIcon/></ListItemIcon>
        <ListItemText primary={'Logout'} />
      </ListItem>
      <ListItem component={Link} to="/users/me" >
        <img src={user.avatar} alt={user.name} title={user.name}
            className="rounded-circle"
            style={{ width: '25px', marginRight: '5px'}} />
                {user.name}
      </ListItem>
   </div>
  )

  const side = side => {
     return (
      <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
     >
      {isAuthenticated && user ? userLogout : userLogin}
    </div>
     );
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component={Link} to='/users/me' onClick={handleMenuClose}>Profil</MenuItem>
      <MenuItem component={Link} to='/settings' onClick={handleMenuClose}>Settings</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
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
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            <MenuItem component={Link} to='/' onClick={handleMenuClose}> Hypertube </MenuItem>
          </Typography>
          <Search classes={classes} displaySearch={props.searchBar} updateFilms={props.updateFilms}/>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
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
        </Toolbar>
      </AppBar>
      <Drawer open={open ? true : false} onClose={toggleDrawer(false)}>
        {side('left')}
      </Drawer>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

// PrimarySearchAppBar : login / logout / register / mYprofil (+ modif des infos du profil)

PrimarySearchAppBar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(withRouter(PrimarySearchAppBar));
