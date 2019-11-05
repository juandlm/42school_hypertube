import { makeStyles } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';

const circularStyle = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
    colorPrimary: indigo[500]
  },
}));

export default circularStyle;
