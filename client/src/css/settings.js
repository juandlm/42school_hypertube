import { indigo } from '@material-ui/core/colors';

const settingsStyle = theme => ({
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    paperAvatar: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
    revealPassword: {
        marginTop: theme.spacing(2),
        marginButton: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(2),
        marginButton: theme.spacing(2),
    },
    bigAvatar: {
        margin: 'auto',
        width: 50,
        height: 50,
        [theme.breakpoints.up('sm')]: {
            width: 70,
            height: 70,
        },
        border: '0px solid',
        borderColor: indigo[500],
        boxShadow: '0',
        transition: 'all 0.2s',
        cursor: 'pointer'
    },
    bigAvatarChecked: {
        margin: 'auto',
        width: 50,
        height: 50,
        [theme.breakpoints.up('sm')]: {
            width: 70,
            height: 70,
        },
        border: '3px solid',
        borderColor: indigo[500],
        boxShadow: '0 3px 6px rgba(0,0,0,0.2), 0 3px 6px rgba(0,0,0,0.3)',
        transition: 'all 0.2s',
        cursor: 'pointer'

    },
    checkbox: {
        display: 'none'
    },
});

export default settingsStyle;