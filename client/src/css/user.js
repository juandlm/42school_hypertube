import { indigo } from '@material-ui/core/colors';

const userStyle = theme => ({
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
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
        color: '#fff',
        backgroundColor: indigo[500],
    }
});

export default userStyle;