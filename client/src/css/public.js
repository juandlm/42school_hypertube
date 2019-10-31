const styles = theme => ({
    root: {
        height: '100vh'
    },
    image: {
        // backgroundImage: 'url(https://source.unsplash.com/collection/1736993)',
        backgroundImage: 'url(https://source.unsplash.com/collection/3327473)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.8
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw'
    },
    legals: {
        margin: theme.spacing(1, 1),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100vw'
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    subtitle: {
        margin: theme.spacing(4, 0, 0, 0)
    }
});

export default styles;