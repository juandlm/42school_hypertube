import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    transform: 'translateZ(0)'
  },
  gridList: {
    width: 500,
    height: 450,
  },
}));

export default useStyles;
