import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { clearAlert } from "../actions/alertAction"; 
import { Snackbar, IconButton, SnackbarContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import alertStyle from '../css/alert';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const MySnackbarContentWrapper = (props) => {
    const classes = alertStyle();
    const { message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];
  
    return (
      <SnackbarContent
        className={classes[variant]}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classes.icon && classes.iconVariant} />
            {message}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
        {...other}
      />
    );
}

const AlertRedux = () => {
    const dispatch = useDispatch();
    const { alertOpen, alertVariant, alertMessage } = useSelector(
        state => state.ui
    );

    const handleClose = () => {
        dispatch(clearAlert());
    }
  
    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
            >
                <MySnackbarContentWrapper
                    onClose={handleClose}
                    variant={alertVariant}
                    message={alertMessage}
                />
            </Snackbar>
        </div>
    );
}

export default AlertRedux;