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
    revealPassword: {
        marginTop: theme.spacing(2),
        marginButton: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(2),
        marginButton: theme.spacing(2),
    }
});

export default settingsStyle;